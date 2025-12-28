const jwt = require('jsonwebtoken');

class algorithmEnum {
    static HS256 = 'HS256';
    static RS256 = 'RS256';
}

class JwtUtil {
    constructor(algorithm) {
        this.algorithm = algorithm || algorithmEnum.RS256;
    }
    async verifyToken(token, publicKey) {
        return jwt.verify(token, publicKey, { algorithms: [this.algorithm] });
    }
}

module.exports = { JwtUtil, algorithmEnum };