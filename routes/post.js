const express = require('express');
const router = express.Router();

const jwt = require ('jsonwebtoken');
const JWT_SECRET = 'jhdyq9uyhbcnakqpud%/&($"FGTHEuhavjhb';
const { check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../model/user');
const Card = require('../model/card');
const Favorites = require('../model/favorites');

const maxAge = 900;
const createToken = (id, username) => {
    return jwt.sign({ id, username }, JWT_SECRET, {
        expiresIn: maxAge //15min
    })
}

//SIGN-IN
router.post('/register', [
    check('username').notEmpty().withMessage('Username cannot be empty')
        .isLength({min: 5}).withMessage('Username must be at least 5 character'),
    check('password').notEmpty().withMessage('Password cannot be empty'),
],async(req,res)=>{
    
    const {username, password: plainTextPassword } = req.body
    const password = await bcrypt.hash(plainTextPassword, 10);
    
    const errors = validationResult(req);
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
});


//LOGIN
router.post('/api/login', async(req,res) => {      
    try{
        const { username, password } = req.body;
        const user = await User.login(username, password);
        const token = createToken(user._id, user.username);
        res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge*1000}); //15min
        return res.json({ status: 'ok', data: user._id});
    }catch(err){
        res.json({ status: 'error', error: 'Invalid Username/Password'});
    }
});


// CHANGE PASSWORD
router.post('/change-password', [
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
});

//FAVORITES LIST
router.post('/favorites', async (req,res) =>{
    try{
        let token = req.cookies.jwt;
        if(token){
           jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
               if(err){
                   console.log(err);
               };
            })
        }else{
            return res.json({
                status: 'error'
            });
        }

        let {id} = req.body;
        let data = await Card.findById(id);
        if(data.favorites == "false"){
            await Card.findByIdAndUpdate(id, {
                favorites: "true"
            });
            data.favorites = "true";
            await Favorites.insertMany(data);
        }else{
            await Card.findByIdAndUpdate(id, {
                favorites: "false"
            });
            data.favorites = "false";
            await Favorites.findByIdAndRemove(id);
        }
        return res.json({
            status: 'ok', data: data 
        });
    }catch(error){
        return res.json({
            status: 'error', error: error
        });
    };
});

module.exports = router;