const { ECSClient} = require('@aws-sdk/client-ecs');
const {AppConfig} = require('./app.config');
const {awsConfig} = require('./aws.config');

class EcsConfig {
    static getInstance() {
        if (!this.ecsClient) {
            this.ecsClient = new ECSClient({
                region: awsConfig[0].AWS_REGION,
                credentials: {
                    accessKeyId: AppConfig.ECS_ACCESS_KEY,
                    secretAccessKey: AppConfig.SECRET_ACCESS_KEY
                }
            })
        }
        return this.ecsClient;
    }
}

module.exports = {EcsConfig};