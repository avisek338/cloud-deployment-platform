const { Kafka } = require('kafkajs');
const { KAFKA_BROKER_1, KAFKA_USERNAME, KAFKA_PASSWORD, DEPLOYMENT_ID } = require('./app.config').appConfig;
const fs = require('fs');
const path = require('path');

const caPath = path.join(__dirname, '..', 'certs', 'ca.pem');

const kafka = new Kafka({
  clientId: `docker-build-server-${DEPLOYMENT_ID}`,
  brokers: [KAFKA_BROKER_1],
  // ssl: {
  //     ca: [fs.readFileSync(caPath, 'utf8')]
  // },
  ssl: {
    rejectUnauthorized: false   // bypass cert validation 
  },
  sasl: {
    username: KAFKA_USERNAME,
    password: KAFKA_PASSWORD,
    mechanism: 'plain'
  }

})

module.exports = { kafka };