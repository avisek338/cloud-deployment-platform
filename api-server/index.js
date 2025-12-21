const express = require('express');
require('dotenv').config();
const {SocketConfig} = require('./config/socket.config');
const {LogSubscriber} = require('./subscriber/log.subscriber');
const logger = require('./logger');
const router = require('./routes');

const app = express();
const io = SocketConfig.getInstance();
const logSubscriber = new LogSubscriber();

logSubscriber.init();

//REST connection
app.use(express.json());


const PORT = process.env.PORT || 9000;

app.use('/api', router);

app.listen(PORT, () => {
    logger.info(`api server is listening at port ${PORT}`);
})

//socket connection

io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})

io.listen(9001, () => logger.info('Socket Server 9001'))

