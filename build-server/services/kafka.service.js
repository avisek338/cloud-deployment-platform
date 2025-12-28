const { kafka } = require('../config/kafka.config');
const logger = require('../logger');
class KafkaService {
  constructor() {
    this.producer = kafka.producer();
  }

  async connect() {
    try {
      await this.producer.connect();
      logger.info('Kafka producer connected successfully');
    } catch (error) {
      logger.error('Failed to connect Kafka producer:', error);
      throw error;
    }
  }

  async sendLog(topic, message) {
    try {
      await this.producer.send({
        topic,
        messages: [{
          key: 'log',
          value: JSON.stringify(message),
          timestamp: Date.now()
        }]
      });
    } catch (error) {
      logger.error('Failed to send log to Kafka:', error);
      throw error;
    }
  }

  async sendStatus(topic, message) {
    try {
      await this.producer.send({
        topic,
        messages: [{
          key: 'status',
          value: JSON.stringify(message),
          timestamp: Date.now()
        }]
      });
    } catch (error) {
      logger.error('Failed to send status to Kafka:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      logger.info('Kafka producer disconnected successfully');
    } catch (error) {
      logger.error('Failed to disconnect Kafka producer:', error);
      throw error;
    }
  }
}

module.exports = { KafkaService };
