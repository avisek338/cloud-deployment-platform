const { createClient } = require('@clickhouse/client')
const { CLICKHOUSE_HOST, CLICKHOUSE_DATABASE, CLICKHOUSE_USERNAME, CLICKHOUSE_PASSWORD } = require('./app.config').appConfig;

class ClickhouseConfig {
    static client;
    static getInstance() {
        if (!ClickhouseConfig.client) {
            const client = createClient({
                host: CLICKHOUSE_HOST,
                database: CLICKHOUSE_DATABASE,
                username: CLICKHOUSE_USERNAME,
                password: CLICKHOUSE_PASSWORD,
            })
            ClickhouseConfig.client = client;
        }
        return ClickhouseConfig.client;
    }
}

module.exports = { ClickhouseConfig };