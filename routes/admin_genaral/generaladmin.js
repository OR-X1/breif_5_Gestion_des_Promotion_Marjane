// const express = require('express')
// const authController = require('../../controller/admin_genaral/auth')
// const router = express.Router();

// router.get('/', authController.isLoginIn, (req, res) => {
//     res.render('admin_general/index', {
//         user: req.user
//     })
// })

// router.get('/creation', authController.isLoginIn, authController.getcenter, (req, res) => {
//     if (req.user) {
//         res.render('admin_general/creation', {
//             user: req.user,
//             centre: req.center
//         })
//     } else {
//         res.redirect('login')
//     }
// })
// router.get('/creationcentre', authController.isLoginIn, (req, res) => {
//     if (req.user) {
//         res.render('admin_general/creationcentre', {
//             user: req.user,
//         })
//     } else {
//         res.redirect('login')
//     }
// })
// router.get('/getuser', authController.isLoginIn, authController.getuseradmin, (req, res) => {
//     if (req.user && req.admin) {
//         res.render('admin_general/alluser', {
//             user: req.user,
//             admin: req.admin
//         })
//     } else {
//         res.redirect('login')
//     }
// })
// router.get('/login', (req, res) => {
//     res.render('admin_general/login')
// })
// router.get('/profile', authController.isLoginIn, (req, res) => {
//     if (req.user) {
//         res.render('admin_general/profile', {
//             user: req.user
//         })
//     } else {
//         res.redirect('login')
//     }
// })
// module.exports = router;