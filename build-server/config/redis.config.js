const {appConfig} = require('./app.config');
const Redis = require("ioredis");

class RedisConfig {
    constructor(){
        throw new Error("Use RedisConfig.getInstance()");
    }
    static getInstance() {
        if (!this.redisClient) {
            this.redisClient = new Redis(appConfig.REDIS_URL);
        }
        return this.redisClient;
    }
}

module.exports = { RedisConfig };