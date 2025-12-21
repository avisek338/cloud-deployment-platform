const {awsConfig,awsRegionIndexMap} = require('./aws.config');
const {S3ClientConfig} = require('./s3.config');
const {RedisConfig} = require('./redis.config');
const {appConfig} = require('./app.config');

module.exports = { awsConfig,awsRegionIndexMap,S3ClientConfig,RedisConfig,appConfig};
