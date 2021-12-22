const express = require('express')
const authController = require('../controller/auth')
const router = express.Router();

router.get('/', authController.isLoginIn, (req, res) => {
    res.render('index', {
        user: req.user
    })
})

router.get('/register', (req, res) => {
    res.render('register')
})
router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/profile', authController.isLoginIn, (req, res) => {
    if (req.user) {
        res.render('profile', {
            user: req.user
        })
    } else {
        res.redirect('/login')
    }
})
module.exports = router;