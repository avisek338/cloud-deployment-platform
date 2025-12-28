const logger = require('../logger');
const { kafka } = require('../config/kafka.config');
const { ClickhouseConfig } = require('../config/clickhouse.config');
const { v4: uuidv4 } = require('uuid');

const client = ClickhouseConfig.getInstance();
let io;

async function batchLogInsert(messages, resolveOffset, commitOffsetsIfNecessary, heartbeat) {
    const batchValues = [];
    const lastOffset = messages[messages.length - 1]?.offset;
    for (const message of messages) {
        if (!message.value) continue;

        const stringMessage = message.value.toString();
        const { projectId, deploymentId, log } = JSON.parse(stringMessage);

        batchValues.push({
            event_id: uuidv4(),
            deployment_id: deploymentId,
            log: log,
            metadata: projectId
        });

        if (io) {
            io.emit(deploymentId, { deploymentId, log });
        }

        logger.info(`deploymentId: ${deploymentId}, log: ${log}`);
    }

    try {
        if (batchValues.length > 0) {
            const { query_id } = await client.insert({
                table: 'log_events',
                values: batchValues,
                format: 'JSONEachRow'
            });

            logger.info(`Inserted ${batchValues.length} logs successfully: ${query_id}`);

            resolveOffset(lastOffset);
            await commitOffsetsIfNecessary(lastOffset);
        }

        await heartbeat();

    } catch (err) {
        logger.error(`Batch insert failed for ${batchValues.length} logs: ${err}`);
    }
}

class Consumer {

    constructor() {
        this.consumer = kafka.consumer({ groupId: 'log-server-group' });
        this.isRunning = false;
    }

    async run(socketIo) {
        try {
            io = socketIo;
            await this.consumer.connect();
            logger.info('consumer connected to kafka');
            this.consumer.subscribe({ topic: 'container-logs', fromBeginning: true });
            await this.consumer.run({
                eachBatch: async function ({ batch, heartbeat, commitOffsetsIfNecessary, resolveOffset }) {
                    const messages = batch.messages;
                    await batchLogInsert(messages, resolveOffset, commitOffsetsIfNecessary, heartbeat);
                }
            })
            logger.info('consumer is running');
            this.isRunning = true;
        } catch (error) {
            logger.error('error in running consumer ', error);
            this.isRunning = false;
            throw error;
        }
    }

    async stop() {
        if (this.isRunning) {
            try {
                await this.consumer.disconnect();
                this.isRunning = false;
                logger.info('consumer disconnected');
            } catch (error) {
                logger.error('failed to disconnect consumer');
            }

        }
    }

}

module.exports = { Consumer };
