const express = require ('express');
const path = require ('path');
const app = express();
const handle = require('express-handlebars');
const bodyParser = require ('body-parser');
const { check, validationResult} = require('express-validator');
const User = require('./model/user');
const Card = require('./model/card');
const Favorites = require('./model/favorites');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const cookieParser = require('cookie-parser');
const JWT_SECRET = 'jhdyq9uyhbcnakqpud%/&($"FGTHEuhavjhb';

app.engine('.hbs', handle.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use("/public", express.static(path.join(__dirname, "public"))); 
app.use(bodyParser.json());
app.use(cookieParser());

const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
dotenv.config({ path: './config/config.env' });
connectDB();

const maxAge = 900;
const createToken = (id, username) => {
    return jwt.sign({ id, username }, JWT_SECRET, {
        expiresIn: maxAge //15min
    })
}

app.get('*', checkUser);

app.get('/', (req,res) =>{
    res.render('index');
})

app.get('/login', (req,res) =>{
    res.render('login');
})

app.get('/change-password', requireAuth, (req,res) => {
    res.render('change-password');
})

app.get('/main-menu', requireAuth, (req,res) =>{
    res.render('mainMenu');
})

app.get('/logout', (req,res) =>{
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/login');
})


app.get('/cards', (req, res) =>{
    Card.find({}, (err,data) =>{
        if(!err){
            res.render('cards',{data});
        }else{
            console.log(err);
        }
    }).lean();
})

app.get('/favorites', requireAuth, (req, res) =>{
    Favorites.find({}, (err, data) => {
        if(!err){
            res.render('favorites', {data});
        }else{
            console.log(err);
        }
    }).lean();
})



app.post('/favorites', async (req,res) =>{
    try{
        const token = req.cookies.jwt;
        if(token){
           jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
               if(err){
                   console.log(err);
               }else{
                   console.log('da token: ', decodedToken.username);
               }
            })
        }else{
            return res.json({status: 'error'});
        }

        let {id} = req.body;
        // console.log('idtrovato:' , id);
        let data = await Card.findById(id);
        // console.log(data);
        if(data.favorites == "false"){
            await Card.findByIdAndUpdate(id, {favorites: "true"});
            data.favorites = "true";
            await Favorites.insertMany(data);
        }else{
            await Card.findByIdAndUpdate(id, {favorites: "false"});
            data.favorites = "false";
            await Favorites.findByIdAndRemove(id);
        }
        // console.log(data);
        return res.json({status: 'ok', data: data });
    }catch(error){
        console.log(error);
        return res.json({status: 'error', error: error});
    }


})


app.post('/register', [
    check('username')
        .notEmpty().withMessage('Username cannot be empty')
        .isLength({min: 5}).withMessage('Username must be at least 5 character'),
    check('password')
        .notEmpty().withMessage('Password cannot be empty'),
],async(req,res)=>{
    //Hashing passwords  //bcrypt
    const {username, password: plainTextPassword } = req.body
    const password = await bcrypt.hash(plainTextPassword, 10);
    
    const errors = validationResult(req);
    console.log(errors);
    const alert = errors.array();
    if(!errors.isEmpty()){
        return res.json({status: 'error', errors: alert});
    }

    try{
        const response = await User.create({ username, password });
        const token = createToken(response._id, response.username);
        res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge*1000}); //15min
    }catch(err){
        if(err.code === 11000){
            return res.json({ status: 'error', error: 'Username is already use' });
        }
        throw err
    }
    res.json({status: 'ok'})
})

app.post('/api/login', async(req,res) => {      
    try{
        const { username, password } = req.body;
        const user = await User.login(username, password);
        const token = createToken(user._id, user.username);
        res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge*1000}); //15min
        return res.json({ status: 'ok', data: user._id});
    }catch(err){
        res.json({ status: 'error', error: 'Invalid Username/Password'});
    }
})

app.post('/change-password', [
    check('newPassword')
        .notEmpty().withMessage('Password cannot be empty'),
],async (req, res) => {
    try{
        const { newPassword: plainTextPassword } = req.body
        const token = req.cookies.jwt; 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json({status: 'error', error: errors.array()});
        }

        if(token){
            jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
                if(err){
                    console.log(err);
                }else{
                    const password = await bcrypt.hash(plainTextPassword, 10);
                    let user = await User.findByIdAndUpdate(decodedToken.id,{
                        $set: {password}
                    });
                }
            })
        }else{
            res.json({ status: 'error', err});
        }

        res.json({ status : 'ok', })
    }catch(err){
        res.json({ status: 'error', err});
    }
})



app.listen(2000, () => { 
    console.log('Server starting at port: ', 2000)
});