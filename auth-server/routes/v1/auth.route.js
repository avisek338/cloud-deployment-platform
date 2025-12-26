const express = require('express');
const authController = require('../../controller')
const router = express.Router();

router.get('/google',authController.googleLogin);
router.get('/google/callback',authController.googleAuthCallback);

module.exports = router;