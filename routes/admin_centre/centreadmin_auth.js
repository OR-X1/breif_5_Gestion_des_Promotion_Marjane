const express = require('express')
const router = express.Router();
const authController = require('../../controller/admin_centre/auth')

router.post('/creation', authController.isLoginIn, authController.creation)
router.post('/creationpromotion', authController.isLoginIn, authController.creationpromotion)
router.post('/update/:id', authController.isLoginIn, authController.update)
router.post('/delete/:id', authController.isLoginIn, authController.delete)
// router.post('/creationcategorie', authController.isLoginIn, authController.creationproduit)
router.post('/login', authController.login)
router.get('/logout', authController.logout)


module.exports = router;