const { kafka } = require('../config/kafka.config');
const { DeploymentRepository } = require('../repository/deployment.repository');
const logger = require('../logger');

class StatusConsumer {
    constructor() {
        this.consumer = kafka.consumer({ groupId: 'api-server-status-group' });
        this.deploymentRepository = new DeploymentRepository();
        this.isRunning = false;
    }

    async start() {
        try {
            await this.consumer.connect();
            logger.info('Status consumer connected to Kafka');

            await this.consumer.subscribe({
                topic: 'deployment-status',
                fromBeginning: true
            });

            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    await this.handleStatusMessage(message);
                }
            });

            this.isRunning = true;
            logger.info('Status consumer started successfully');

        } catch (error) {
            logger.error('Failed to start status consumer:', error);
            throw error;
        }
    }

    async handleStatusMessage(message) {
        try {
            const statusData = JSON.parse(message.value.toString());
            const { deploymentId, status, timestamp } = statusData;

            logger.info(`Received status update: ${status} for deployment ${deploymentId}`);
            const updatedDeployment = await this.deploymentRepository.update(
                deploymentId,
                {
                    status,
                    updatedAt: new Date(timestamp)
                }
            );

            if (updatedDeployment) {
                logger.info(`Deployment ${deploymentId} status updated to: ${status}`);
            } else {
                logger.error(`Failed to update deployment ${deploymentId} - not found`);
            }
        } catch (error) {
            logger.error('Error handling status message:', error);
        }
    }

    async stop() {
        if (this.isRunning) {
            try {
                await this.consumer.disconnect();
                this.isRunning = false;
                logger.info('Status consumer stopped successfully');
            } catch (error) {
                logger.error('Error stopping status consumer:', error);
            }
        }
    }
}

module.exports = { StatusConsumer };
