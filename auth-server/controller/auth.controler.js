const {
    GOOGLE_OAUTH_URI,
    GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI,
} = require('../config/app.config').appConfig;
const logger = require("../logger")
const { AuthService } = require('../service/auth.service');
const crypto = require('crypto');

const authService = new AuthService();


async function googleLogin(req, res) {
    try {
        const state = crypto.randomBytes(16).toString('hex');
        res.cookie('oauth_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 5 * 60 * 1000,
        });
        const url = GOOGLE_OAUTH_URI + "?" + new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: GOOGLE_REDIRECT_URI,
            response_type: "code",
            scope: "openid email profile",
            access_type: "offline",
            prompt: "consent",
            state
        });
        return res.redirect(url);
    } catch (err) {
        logger.error("Error in Google Login:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function googleAuthCallback(req, res) {
    try {
        const code = req.query.code;
        const state = req.query.state;
        const storedState = req.cookies.oauth_state;
        if (!state || state !== storedState) {
            return res.status(403).json({ success: false, message: "Invalid state parameter" });
        }
        if(!code){
            return  res.status(400).json({ success: false, message: "Authorization code not provided" });
        }
        const response = await authService.handleGoogleCallback(code);
        logger.info(`Google Auth Callback Successful for user: ${response.email}`);
        return res.status(200).json({ success: true, message: "Google Auth Successful", data: response });
    } catch (err) {
        logger.error("Error in Google Auth Callback:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    googleLogin,
    googleAuthCallback
}