const express = require('express');
const router = express.Router();
const auth = require('../../controllers/auth.controller');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.post('/refresh-tokens', auth.refreshTokens);

// router.post('/forgot-password', auth.forgotPassword);
// router.post('/reset-password', auth.resetPassword);
// router.post('/send-verification-email', auth.sendVerificationEmail);
// router.post('/verify-email', auth.verifyEmail);

module.exports = router;
