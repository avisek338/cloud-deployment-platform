const logger = require('../../build-server/logger');
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

    static async init(socketIo) {
        io = socketIo;
        const consumer = kafka.consumer({ groupId: 'log-server-group' });
        await consumer.connect();
        consumer.subscribe({ topic: 'container-logs', fromBeginning: true });

        await consumer.run({
            eachBatch: async function ({ batch, heartbeat, commitOffsetsIfNecessary, resolveOffset }) {
                const messages = batch.messages;
                await batchLogInsert(messages, resolveOffset, commitOffsetsIfNecessary, heartbeat);
            }
        })
    }
}

module.exports = { Consumer };
