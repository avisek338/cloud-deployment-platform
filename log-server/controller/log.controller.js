const { ClickhouseConfig } = require('../config/clickhouse.config');
const logger = require('../logger');
const client = ClickhouseConfig.getInstance();

async function getDeploymentLogs(req, res) {
    try {
        const deploymentId = req.params.id;
        if (!deploymentId) {
            res.status(400).json({ success: false, message: 'valid deployment id not found' });
        }

        const logsJson = await client.query({
            query: `select * from log_events where deployment_id = {deploymentId:String}`,
            format: 'JSONEachRow',
            query_params: {
                deploymentId: deploymentId
            }
        });
     
        const logs = await logsJson.json();
        res.json({ success: true, message: 'sucessfuly fetched logs', data: logs });

    } catch (error) {
        logger.error('error fetching deployment logs');
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {getDeploymentLogs}
