const { Kafka } = require('kafkajs');
const { KAFKA_BROKER_1, KAFKA_USERNAME, KAFKA_PASSWORD } = require('./app.config').AppConfig;

const kafka = new Kafka({
  clientId: `api-server`,
  brokers: [KAFKA_BROKER_1],
  ssl: {
    rejectUnauthorized: false   
  },
  sasl: {
    username: KAFKA_USERNAME,
    password: KAFKA_PASSWORD,
    mechanism: 'plain'
  }

})

module.exports = { kafka };
