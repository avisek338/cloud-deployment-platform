const express = require('express');
require('dotenv').config();
const logger = require('./logger');
const cookieParser = require('cookie-parser');

const {PORT} = require('./config/app.config').appConfig;
const router = require('./routes');
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api',router);

app.listen(PORT, () => {
  logger.info(`Auth server listening at http://localhost:${PORT}`);
});