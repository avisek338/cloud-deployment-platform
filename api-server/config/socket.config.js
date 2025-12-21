const { Server } = require('socket.io');

class SocketConfig {
    constructor() {
        throw new Error("Use SocketConfig.getInstance()");
    }
    static getInstance() {
        if (!SocketConfig.instance) {
            SocketConfig.instance = new Server({ cors: '*' })
        }
        return SocketConfig.instance;
    }
}

module.exports = { SocketConfig };