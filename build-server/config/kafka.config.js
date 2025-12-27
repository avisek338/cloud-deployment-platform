const { Kafka } = require('kafkajs');
const appConfig = require('./app.config');
const fs = require('fs');

const kafka = new Kafka({
  clientId: `docker-builder-server-${appConfig.DEPLOYMENT_ID}`,
  brokers: [appConfig.KAFKA_BROKER_1],
  ssl: {
    rejectUnauthorized: true,
    ca: [fs.readFileSync('../certs/kafka-ca.pem', 'utf8')],
    key: fs.readFileSync('../certs/kafka-access-key.pem', 'utf8'),
    cert: fs.readFileSync('../certs/kafka-access-cert.pem', 'utf8'),
  },
  sasl: {
    mechanism: 'plain',
    username: appConfig.KAFKA_USERNAME,
    password: appConfig.KAFKA_PASSWORD
  }
});

module.exports = { kafka };