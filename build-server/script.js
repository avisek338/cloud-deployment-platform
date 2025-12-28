const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const logger = require('./logger');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { awsConfig, appConfig, S3ClientConfig } = require('./config/index.js');
const { KafkaService } = require('./services/kafka.service');

const mime = require('mime-types');


const s3Client = S3ClientConfig.getInstance();
const kafkaService = new KafkaService();

const s3Settings = awsConfig[0].S3;
const PROJECT_ID = appConfig.PROJECT_ID;


async function publishLog(log) {
    try {
        await kafkaService.sendLog('container-logs', {
            projectId: appConfig.PROJECT_ID,
            deploymentId: appConfig.DEPLOYMENT_ID,
            log,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`error in publishing log:: ${error}`);
    }
}

async function updateDeploymentStatus(status) {
    try {
        await kafkaService.sendStatus('deployment-status', {
            deploymentId: appConfig.DEPLOYMENT_ID,
            status: status,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`error in updating deployment status:: ${error}`);
    }
}

async function init() {
    await kafkaService.connect();
    logger.info("executing script...");


    await updateDeploymentStatus('IN_PROGRESS');
    await publishLog('Build Started...');

    const outputDir = path.join(__dirname, 'output');

    const p = exec(`cd ${outputDir} && npm install && npm run build`);

    p.stdout.on('data', async (data) => {
        logger.info(data.toString());
        await publishLog(data.toString());
    });
    p.stderr.on('data', async (data) => {
        logger.error(data.toString());
        await publishLog(data.toString());
    });
    p.on('close', async function (code) {

        if (code !== 0) {
            await updateDeploymentStatus('FAILED');
            await publishLog(`Build failed with exit code: ${code}`);
            await kafkaService.disconnect();
            process.exit(1);
        }

        await publishLog('Build Complete');
        const distDir = path.join(__dirname, 'output', 'dist');
        const distFolderContents = fs.readdirSync(distDir, { recursive: true });
        await publishLog(`Starting to upload`);

        try {
            for (const file of distFolderContents) {
                const filePath = path.join(distDir, file);
                if (fs.lstatSync(filePath).isDirectory()) {
                    continue;
                }

                logger.info(`Uploading file: ${filePath}`);

                const commad = new PutObjectCommand({
                    Bucket: s3Settings.BUCKETS[0].NAME,
                    Key: `__output/${PROJECT_ID}/${file}`,
                    Body: fs.createReadStream(filePath),
                    ContentType: mime.lookup(filePath),
                });

                await s3Client.send(commad);
                await publishLog(`uploaded ${file}`)
                logger.info(`Uploaded file: ${filePath}`);
            }

            await publishLog(`Done`);
            await updateDeploymentStatus('SUCCESS');
            logger.info("Done...");

        } catch (uploadError) {
            logger.error(`Upload failed: ${uploadError.message}`);
            await updateDeploymentStatus('FAILED');
            await publishLog(`Upload failed: ${uploadError.message}`);
        }

        await kafkaService.disconnect();
        logger.info("Kafka disconnected");
        process.exit(0);
    });

    p.on('error', async function (error) {
        logger.error(`Build process error: ${error.message}`);
        await updateDeploymentStatus('FAILED');
        await publishLog(`Build process error: ${error.message}`);
        await kafkaService.disconnect();
        process.exit(1);
    });
};

init();

