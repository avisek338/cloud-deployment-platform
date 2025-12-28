const express = require('express');
const {AuthMiddlewere} = require('../../middlewere/auth.middlewere');
const router = express.Router();
const {getDeploymentLogs} = require('../../controller')

router.get('/deployments/:id',AuthMiddlewere.verifyToken,getDeploymentLogs);

module.exports = router;