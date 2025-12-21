const { s3BucketConfig } = require('../config/bucket.config');
const HttpProxyConfig = require('../config/http-proxy.config');
const { hostnameRegex } = require('../utils/regex');
const logger = require('../logger');
const https = require('https');

const BASE_PATH = s3BucketConfig.BASE_URL;
const proxy = HttpProxyConfig.getInstance();


function checkS3Object(url) {
    return new Promise((resolve) => {
        const req = https.request(url + `/index.html`, { method: 'HEAD' }, res => {
            resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.end();
    });
}

async function s3ProxyMiddleware(req, res, next) {
    try {
        const hostname = req.hostname;
        if (!hostnameRegex.test(hostname)) {
            logger.error('Invalid hostname format:', hostname);
            return res.status(400).send({ error: 'Invalid hostname format' });
        }
        const subDomain = hostname.split('.')?.[0];
        const resolvesTo = `${BASE_PATH}/${subDomain}`;

        const exists = await checkS3Object(resolvesTo);

        if (!exists) {
            logger.error('Resource not found in S3 for subdomain:', subDomain);
            return res.status(404).send({ error: 'Resource not found' });
        }

        return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
    } catch (error) {
        logger.error('Error in S3 proxy middleware:', error);
        return res.status(500).send({ error });
    }
}

module.exports = { s3ProxyMiddleware };