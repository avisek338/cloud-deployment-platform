const express = require('express');
const {createProject} = require('../../controller');

const router = express.Router();


router.post('/',createProject);
    
module.exports = {
    projectRouter:router
};