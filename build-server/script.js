const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const logger = require('./logger');
const {PutObjectCommand} = require('@aws-sdk/client-s3');
const {awsConfig,appConfig,RedisConfig,S3ClientConfig} = require('./config/index.js');

const mime = require('mime-types');


const s3Client = S3ClientConfig.getInstance();
const publisher = RedisConfig.getInstance();

const s3Settings = awsConfig[0].S3;
const PROJECT_ID = appConfig.PROJECT_ID;


function publishLog(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }))
}

async function init() {
    logger.info("executing script...");
    publishLog('Build Started...'); 
    const outputDir = path.join(__dirname, 'output');

    const p = exec(`cd ${outputDir} && npm install && npm run build`);

    p.stdout.on('data', (data) => {
        logger.info(data.toString());
        publishLog(data.toString());
    });
    p.stderr.on('data', (data) => {
        logger.error(data.toString());
        publishLog(data.toString());
    });
    p.on('close', async function () {
        logger.info("build completed.");
        logger.info('Build Complete');
        const distDir = path.join(__dirname, 'output', 'dist');
        const distFolderContents = fs.readdirSync(distDir,{ recursive: true });
        publishLog(`Starting to upload`);

        for (const file of distFolderContents) {
            const filePath = path.join(distDir,file);
            if (fs.lstatSync(filePath).isDirectory()) {
                continue;
            }

            logger.info(`Uploading file: ${filePath}`);

            const commad = new PutObjectCommand({
                Bucket: s3Settings.BUCKETS[0].NAME,
                Key : `__output/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath),
            });

            await s3Client.send(commad);
            publishLog(`uploaded ${file}`)
            logger.info(`Uploaded file: ${filePath}`);   
        }
        publishLog(`Done`);
        logger.info("Done...");
        await publisher.quit();  
        logger.info("Redis closed");
    }
    );
};

init();

