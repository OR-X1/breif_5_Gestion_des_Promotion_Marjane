const express = require('express')
const router = express.Router();
const authController = require('../../controller/rayon/auth')

router.get('/getpromo', authController.isLoginIn, authController.getpromo)
router.post('/update/:id', authController.isLoginIn, authController.update)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

module.exports = router;