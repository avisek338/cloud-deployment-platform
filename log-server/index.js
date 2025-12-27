const express = require('express');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const { PORT } = require('./config/app.config').appConfig;
const {Consumer}  =require('./consumer');

//http express server
const app = express();
const httpServer = http.createServer(app);

//socket server
const io = new Server(httpServer, { cors: '*' });

io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})

Consumer.init(io);

httpServer.listen(PORT, () => {
    console.log(`log server is listening at port ${PORT}`);
});




