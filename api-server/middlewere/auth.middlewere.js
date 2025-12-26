const { JwtUtil, algorithmEnum } = require("../utils/jwt.util");
const logger = require('../logger');
const jwtUtil = new JwtUtil(algorithmEnum.RS256);
const { JWT_PUBLIC_KEY } = require('../config/app.config.js').AppConfig;

class AuthMiddlewere {
    static async verifyToken(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new Error("authorization bearer token not found");
            }
            const token = authHeader.split(" ")[1];
            const decodedToken = await jwtUtil.verifyToken(token, JWT_PUBLIC_KEY);
            req.user = {
                email: decodedToken.email,
            };
            next();
        } catch (error) {
            logger.error("token invalid:: ", error)
            res.status(401).json({ sucess: false, message: error.message })
        }
    }
}

module.exports = { AuthMiddlewere };