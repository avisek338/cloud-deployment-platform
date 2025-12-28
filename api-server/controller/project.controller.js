const { ProjectService } = require('../service/project.service');
const logger = require('../logger');

const projectService = new ProjectService();

async function deployProject(req, res) {
     try {
          const projectId = req.params.id;
          const deploymentDTO = await projectService.deployProject(projectId);
          return res.json({ status: 'queued', data: deploymentDTO });
     } catch (error) {
          logger.error('error in creating project', error);
          return res.status(500).send({ error });
     }
}

async function createProject(req, res) {
     try {
          let projectDTO = req.body;
          projectDTO.userEmail = req.user.email;
          const project = await projectService.createProject(projectDTO);
          return res.json({ sucess: true, message: 'project created successfully', data: project });
     } catch (error) {
          logger.error('error in creating project', error);
          return res.status(500).send({ sucess: false, message: error.message });
     }
}


module.exports = { deployProject, createProject };