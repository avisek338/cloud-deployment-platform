
const appConfig = {
    PORT: process.env.PORT || 9001,
    KAFKA_BROKER_1: process.env.KAFKA_BROKER_1,
    KAFKA_USERNAME: process.env.KAFKA_USERNAME,
    KAFKA_PASSWORD: process.env.KAFKA_PASSWORD,
    CLICKHOUSE_HOST: process.env.CLICKHOUSE_HOST,
    CLICKHOUSE_DATABASE: process.env.CLICKHOUSE_DATABASE,
    CLICKHOUSE_USERNAME: process.env.CLICKHOUSE_USERNAME,
    CLICKHOUSE_PASSWORD: process.env.CLICKHOUSE_PASSWORD,
    JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY
}


module.exports = { appConfig };