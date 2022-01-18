const express = require('express')
const router = express.Router();
const authController = require('../../controller/admin_genaral/auth')

// authController.isLoginIn,

router.post('/creation',  authController.creation)
router.get('/getalladmincenter',   authController.getall)
router.post('/update/:id', authController.isLoginIn, authController.update)
router.post('/delete/:id',  authController.delete)

router.get('/getallcenter',   authController.getallcenter)
router.post('/creationcentre',  authController.creationcentre)
router.post('/deletecentre/:id',  authController.deletecentre)

router.post('/login', authController.login)
router.get('/logout', authController.logout)

module.exports = router;