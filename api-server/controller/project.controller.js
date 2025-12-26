const { ProjectService } = require('../service/project.service');
const logger = require('../logger');
const { GITHUB_REPO_REGEX } = require('../utils/regex');

const projectService = new ProjectService();

async function deployProject(req, res) {
     try {
          const projectId = req.params.id;
          // const gitURL = req.body.gitURL;
          // if (!gitURL || !GITHUB_REPO_REGEX.test(gitURL)) {
          //      logger.error('Invalid or missing gitURL:', gitURL);
          //      return res.status(400).send({ error: 'Invalid or missing gitURL' });
          // }
          const { projectSlug, url } = await projectService.deployProject(projectId);
          return res.json({ status: 'queued', data: { projectSlug, url } });
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