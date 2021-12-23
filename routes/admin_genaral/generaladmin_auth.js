const express = require('express')
const router = express.Router();
const authController = require('../../controller/admin_genaral/auth')

router.post('/creation', authController.isLoginIn, authController.creation)
router.post('/update/:id', authController.isLoginIn, authController.update)
router.post('/delete/:id', authController.isLoginIn, authController.delete)
router.post('/creationcentre', authController.isLoginIn, authController.creationcentre)
router.post('/login', authController.login)
router.get('/logout', authController.logout)


module.exports = router;