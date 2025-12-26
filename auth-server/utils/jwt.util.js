const jwt = require('jsonwebtoken');

class algorithmEnum{
    static HS256 = 'HS256';
    static RS256 = 'RS256';
}

class JwtUtil {
    constructor(algorithm) {
      this.algorithm = algorithm || algorithmEnum.RS256;
    }
    async generateToken(payload, privateKey,expiresIn) {
        return await jwt.sign(payload, privateKey, { algorithm: this.algorithm, expiresIn});
    }
    async verifyToken(token, publicKey) {
        return await jwt.verify(token, publicKey, { algorithms: [this.algorithm] });
    }
}

module.exports = {JwtUtil,algorithmEnum};