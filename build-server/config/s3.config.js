const { S3Client } = require('@aws-sdk/client-s3');
const {appConfig} = require('./app.config');
const {awsConfig} = require('./aws.config');
class S3ClientConfig {
    constructor(){
        throw new Error("Use S3ClientConfig.getInstance()");
    }
    static getInstance() {
        if (!S3ClientConfig.instance) {
            S3ClientConfig.instance = new S3Client({
                region: awsConfig[0].AWS_REGION,
                credentials: {
                    accessKeyId: appConfig.ECS_ACCESS_KEY,
                    secretAccessKey: appConfig.SECRET_ACCESS_KEY
                },
            });
        }
        return S3ClientConfig.instance;
    }
}

module.exports = { S3ClientConfig };