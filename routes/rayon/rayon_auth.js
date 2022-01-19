const express = require('express')
const router = express.Router();
const authController = require('../../controller/rayon/auth')

// router.get('/getpromo', authController.getpromo)
router.get('/getpromo/:category',  authController.getpromo)
router.post('/update/:id',  authController.update)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

module.exports = router;