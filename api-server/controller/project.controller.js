const { ProjectService } = require('../service/project.service');
const logger = require('../logger');
const { GITHUB_REPO_REGEX } = require('../utils/regex');

const projectService = new ProjectService();

async function createProject(req, res) {
     try {
          const gitURL = req.body.gitURL;
          if (!gitURL || !GITHUB_REPO_REGEX.test(gitURL)) {
               logger.error('Invalid or missing gitURL:', gitURL);
               return res.status(400).send({ error: 'Invalid or missing gitURL' });
          }
          const { projectSlug, url } = await projectService.createProject(gitURL);
          return res.json({ status: 'queued', data: { projectSlug, url } });
     } catch (error) {
          logger.error('error in creating project', error);
          return res.status(500).send({ error });
     }
}


module.exports = { createProject };