const { kafka } = require('../config/kafka.config');
const logger = require('../logger');
class KafkaService {
  constructor() {
    this.producer = kafka.producer();
  }

  async connect() {
    try {
      await this.producer.connect();
      logger.log('Kafka producer connected successfully');
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

  async disconnect() {
    await this.producer.disconnect();
  }
}

module.exports = { KafkaService };
