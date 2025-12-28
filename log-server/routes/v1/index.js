const express = require('express');
const router = express.Router();
const logRouter = require('./log.route');

router.use('/logs',logRouter);

module.exports = router;