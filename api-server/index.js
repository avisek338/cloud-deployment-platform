const express = require('express');
require('dotenv').config();
const { StatusConsumer } = require('./consumer/status.consumer');
const logger = require('./logger');
const router = require('./routes');

const app = express();
const statusConsumer = new StatusConsumer();

statusConsumer.start().catch((error) => {
    logger.error(`error in starting consumer: `, error);
});

//REST connection
app.use(express.json());


const PORT = process.env.PORT || 9000;

app.use('/api', router);

app.listen(PORT, () => {
    logger.info(`api server is listening at port ${PORT}`);
})

process.on('SIGINT', async () => {
    logger.info('Shutting down gracefully...');
    await statusConsumer.stop();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('Shutting down gracefully...');
    await statusConsumer.stop();
    process.exit(0);
});



