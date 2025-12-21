const express = require('express');
require('dotenv').config();
const {s3ProxyMiddleware} = require('./middlewere/proxy.middlewere');
const {proxyReqHandler} = require('./handler/proxyRequest.handler');
const HttpProxyConfig = require('./config/http-proxy.config');
const logger = require('./logger');
const app = express();

const PORT = process.env.PORT || 8000;
const proxy = HttpProxyConfig.getInstance();

app.use(s3ProxyMiddleware);
proxy.on('proxyReq', proxyReqHandler);


app.listen(PORT, () => {
  logger.info(`s3 proxy server is listening at port ${PORT}`);
})

