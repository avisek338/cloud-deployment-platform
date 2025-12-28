const express = require('express');
const { deployProject,createProject } = require('../../controller');
const { AuthMiddlewere } = require('../../middlewere/auth.middlewere');

const router = express.Router();

router.post('/', AuthMiddlewere.verifyToken,createProject);
router.post('/:id/deploy',AuthMiddlewere.verifyToken, deployProject);

module.exports = {
    projectRouter: router
};