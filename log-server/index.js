const express = require('express');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const { PORT } = require('./config/app.config').appConfig;
const {Consumer}  =require('./consumer');
const router = require('./routes');
const logger = require('./logger');

//http express server
const app = express();
const httpServer = http.createServer(app);
const consumer = new Consumer();

app.use(express.json());

app.use('/api',router)

//socket server
const io = new Server(httpServer, { cors: '*' });

io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})


httpServer.listen(PORT, () => {
    logger.info(`log server is listening at port ${PORT}`);
});

consumer.run(io).catch((error)=>{
    logger.error('faild to start consumer ',error);
})

process.on('SIGINT', async () => {
    logger.info('Shutting down gracefully...');
    await consumer.stop();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('Shutting down gracefully...');
    await consumer.stop();
    process.exit(0);
});




