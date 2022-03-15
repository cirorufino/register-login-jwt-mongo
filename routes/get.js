const express = require('express');
const router = express.Router();
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

const User = require('../model/user');
const Card = require('../model/card');
const Favorites = require('../model/favorites');

router.get('*', checkUser);

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/change-password', requireAuth, (req, res) => {
    res.render('change-password');
})

router.get('/main-menu', requireAuth, (req, res) => {
    res.render('mainMenu');
})

router.get('/logout', (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 1
    });
    res.redirect('/login');
})


router.get('/cards', (req, res) => {
    Card.find({}, (err, data) => {
        if (!err) {
            res.render('cards', {
                data
            });
        } else {
            console.log(err);
        }
    }).lean();
})

router.get('/favorites', requireAuth, (req, res) => {
    Favorites.find({}, (err, data) => {
        if (!err) {
            res.render('favorites', {
                data
            });
        } else {
            console.log(err);
        }
    }).lean();
})

module.exports = router;