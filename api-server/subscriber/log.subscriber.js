const { RedisConfig } = require('../../build-server/config/redis.config');
const logger = require('../logger');
const { SocketConfig } = require('../config/socket.config');

class LogSubscriber {
    constructor() {
        this.subscriber = RedisConfig.getInstance();
        this.io = SocketConfig.getInstance();
    }
    async init() {
        logger.info('Subscribed to logs....')
        this.subscriber.psubscribe('logs:*')
        this.subscriber.on('pmessage', (pattern, channel, message) => {
            this.io.to(channel).emit('message', message)
        })
    }

}
module.exports = { LogSubscriber };


