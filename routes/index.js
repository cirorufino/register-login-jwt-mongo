const express = require('express');
const router = express.Router();
const { requireAuth, checkUser } = require('../middleware/authMiddleware');


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

module.exports = router;