const express = require('express')
const router = express.Router();
const authController = require('../../controller/admin_genaral/auth')

router.post('/creation', authController.creation)
router.post('/creationcentre', authController.creationcentre)
router.post('/login', authController.login)
router.get('/logout', authController.logout)


module.exports = router;