const express = require ('express');
const path = require ('path');
const app = express();
const handle = require('express-handlebars');
const bodyParser = require ('body-parser');
const User = require('./model/user');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const JWT_SECRET = 'jhdyq9uyhbcnakqpud%/&($"FGTHEuhavjhb';

app.engine('.hbs', handle.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use("/public", express.static(path.join(__dirname, "public"))); 
app.use(bodyParser.json());

const dotenv = require('dotenv');
const connectDB = require('./config/db');
dotenv.config({ path: './config/config.env' });
connectDB();



app.get('/', (req,res) =>{
    res.render('index');
})

app.get('/login', (req,res) =>{
    res.render('login');
})

app.get('/change-password', (req,res) => {
    res.render('change-password');
})


app.post('/change-password', async (req, res) => {
    try{
        const { token, newPassword: plainTextPassword } = req.body

        if(!plainTextPassword || typeof plainTextPassword !== 'string'){
            return res.json({status: 'error', error: 'Password non valida'});
        }
        if(plainTextPassword.length < 5 ){
            return res.json({status: 'error', error: 'Password inferiore di 5 caratteri'});
        }
    
        const user = jwt.verify(token, JWT_SECRET);
        const _id = user.id
    
        const password = await bcrypt.hash(plainTextPassword, 10)
    
        await User.updateOne({ _id }, {
            $set: {password}
        })
    
        res.json({ status : 'ok', })
    }catch(err){
        res.json({ status: 'error', err});
    }

})


app.post('/api/login', async(req,res) => {
    try{
        const { username, password } = req.body  
        const user = await User.findOne({ username }).lean()
    
        if(!user){
            return res.json({status: 'error', error: 'invalid username/password'});
        }
        if( await bcrypt.compare(password, user.password)){
            //combination username/password successful
            const token = jwt.sign({
                id: user._id, username: user.username
            }, JWT_SECRET );
    
            return res.json({ status: 'ok', data: token})
        }
        res.json({status: 'error', error: 'invalid username/password'});

    }catch(err){
        res.json({status: 'error', err});
    }
})


app.post('/register', async(req,res)=>{
    console.log(req.body);

    //Hashing passwords 
    //bcrypt
    const {username, password: plainTextPassword } = req.body
    const password = await bcrypt.hash(plainTextPassword, 10);

    if(!username || typeof plainTextPassword !== 'string'){
        return res.json({status: 'error', error: 'Username non valido'});
    }
    if(!plainTextPassword || typeof plainTextPassword !== 'string'){
        return res.json({status: 'error', error: 'Password non valida'});
    }
    if(plainTextPassword.length < 5 ){
        return res.json({status: 'error', error: 'Password inferiore di 5 caratteri'});
    }

    try{
        const response = await User.create({
            username, password
        })
        console.log('Utente creato correttamente',response);
    }catch(err){
        if(err.code === 11000){
            //key duplicata
            return res.json({ status: 'error', error: 'Username già in uso' });
        }
        throw err
    }
    res.json({status: 'ok'})
})






app.listen(2000, () => { 
    console.log('Server starting at port: ', 2000)
});