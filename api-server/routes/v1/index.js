const express = require('express');
const router = express.Router();

const {projectRouter} = require('./project.routes');

router.use('/projects', projectRouter);

module.exports = router;