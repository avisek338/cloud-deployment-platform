const {
    GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI,
    GOOGLE_CLIENT_SECRET,
    TOKEN_URI } = require('../config/app.config').appConfig;
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { JwtUtil, algorithmEnum } = require('../utils/jwt.util');
const { UserRepository } = require('../repository/user.repository');
const { JWT_TTL } = require('../config/app.config').appConfig;
const { JWT_PRIVATE_KEY } = require('../config/key.config').KeyConfig;

class AuthService {
    constructor() {
        this.jwtUtil = new JwtUtil(algorithmEnum.RS256);
        this.userRepository = new UserRepository();
    }
    async handleGoogleCallback(code) {
        const tokenRes = await axios.post(
            TOKEN_URI,
            {
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code"
            }
        );
        const userData = await jwt.decode(tokenRes.data.id_token);
        //check if user exists. if not create
        let user = await this.userRepository.getUserByEmail(userData.email);
        if (!user) {
            user = await this.userRepository.create({
                email: userData.email,
                name: userData.name,
            });
        }
        const token = await this.jwtUtil.generateToken({
            userId: user.id,
            email: user.email
        }, JWT_PRIVATE_KEY, JWT_TTL);

        return { email: user.email, token };
    }
}

module.exports = { AuthService };