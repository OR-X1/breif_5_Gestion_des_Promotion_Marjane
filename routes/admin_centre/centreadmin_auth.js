const express = require('express')
const router = express.Router();
const authController = require('../../controller/admin_centre/auth')

// authController.isLoginIn,

router.post('/creation',  authController.creation)
router.get('/getallresponsablerayon',   authController.getall)
router.post('/update/:id', authController.update)
router.post('/delete/:id', authController.delete)

router.post('/creationpromotion', authController.creationpromotion)
router.get('/getallpromotion',   authController.getallpromotion)

router.get('/getvalidepromo', authController.getvalidepromo)
router.get('/getinvalidepromo',  authController.getinvalidepromo)
router.get('/promopasencore',  authController.promopasencore)

// router.post('/creationcategorie', authController.isLoginIn, authController.creationproduit)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

module.exports = router;