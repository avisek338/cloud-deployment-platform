const {AppConfig} = require('../config/app.config');

class RedisConfig {
    constructor() {
        throw new Error("Use RedisConfig.getInstance()");
    }
    static getInstance() {
        if (!RedisConfig.instance) {
            RedisConfig.instance = new RedisConfig(AppConfig.REDIS_URL);
        }
        return RedisConfig.instance;
    }
}
module.exports = { RedisConfig };