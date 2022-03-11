const jwt = require('jsonwebtoken'); 
const JWT_SECRET = 'jhdyq9uyhbcnakqpud%/&($"FGTHEuhavjhb';
const User = require('../model/user');

const requireAuth = (req, res, next) =>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if(err){
                console.log(err);
                res.redirect('/login');
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }else{
        res.redirect('/login');
    }
}

//check user 
const checkUser = (req,res, next) =>{
    const token = req.cookies.jwt; 
    if(token){
        jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
            if(err){
                console.log(err);
                res.locals.user = null;
                next();
            }else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id).lean();
                res.locals.username = user.username;
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }

}

module.exports = { requireAuth, checkUser };