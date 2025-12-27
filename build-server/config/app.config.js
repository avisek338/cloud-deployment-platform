
const appConfig = {
   ECS_ACCESS_KEY: `${process.env.ECS_ACCESS_KEY_ID}`,
   SECRET_ACCESS_KEY: `${process.env.ECS_SECERET_ACCESS_KEY}`,
   REDIS_URL: `${process.env.REDIS_URL}`,
   PROJECT_ID: process.env.PROJECT_ID,
   DEPLOYMENT_ID: process.env.DEPLOYMENT_ID,
   KAFKA_BROKER_1: process.env.KAFKA_BROKER_1,
   KAFKA_USERNAME: process.env.KAFKA_USERNAME,
   KAFKA_PASSWORD: process.env.KAFKA_PASSWORD
}

module.exports = { appConfig };