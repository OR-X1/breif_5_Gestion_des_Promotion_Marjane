const express = require('express')
const authController = require('../../controller/admin_genaral/auth')
const router = express.Router();

router.get('/', authController.isLoginIn, (req, res) => {
    res.render('admin_general/index', {
        user: req.user
    })
})

router.get('/creation', authController.isLoginIn, (req, res) => {
    if (req.user) {
        res.render('admin_general/creation', {
            user: req.user
        })
    } else {
        res.redirect('login')
    }
})
router.get('/creationcentre', authController.isLoginIn, (req, res) => {
    if (req.user) {
        res.render('admin_general/creationcentre', {
            user: req.user
        })
    } else {
        res.redirect('login')
    }
})
router.get('/login', (req, res) => {
    res.render('admin_general/login')
})
router.get('/profile', authController.isLoginIn, (req, res) => {
    if (req.user) {
        res.render('admin_general/profile', {
            user: req.user
        })
    } else {
        res.redirect('login')
    }
})
module.exports = router;