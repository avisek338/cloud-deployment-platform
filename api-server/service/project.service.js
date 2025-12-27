const { generateSlug } = require('random-word-slugs');
const { EcsRunTaskBuilder } = require('../builders/task.builder');
const { awsConfig, awsRegionIndexMap } = require('../config/aws.config');
const { AppConfig } = require('../config/app.config');
const { ProjectRepository } = require('../repository/project.repository');
const { DeploymentRepository } = require('../repository/deployment.repository');
const { DeployementStatus } = require('../utils/enums');

//settings
const regionIndex = awsRegionIndexMap['ap-south-1'];
const ecsSettings = awsConfig[regionIndex].ECS;
const CLUSTER_ARN = awsConfig[regionIndex].CLUSTER;
const vpcSettings = awsConfig[regionIndex].VPC;
const ecrSettings = awsConfig[regionIndex].ECR;

//required fields
const ECR_CONTAINER = ecrSettings.REPOSITORIS[0].IMAGES[0].CONTAINERS[0]; //builder-image

class ProjectService {
    constructor() {
        this.projectRepository = new ProjectRepository();
        this.deploymentRepository = new DeploymentRepository();
    }
    async deployProject(projectId) {

        const projectDTO = await this.projectRepository.findById(projectId);
        const { id, gitURL, subDomain } = projectDTO;
        const projectSlug = subDomain;
        if (!id) {
            throw new Error("project does not exists");
        }

        //check if deployment is already in progress
        const deployments = await this.deploymentRepository.findDeployments({
            projectId,
            status: {
                in: [
                    DeployementStatus.QUEUED,
                    DeployementStatus.IN_PROGRESS,
                    DeployementStatus.READY
                ]
            }
        });
        if (deployments.length > 0) {
            throw new Error("deployment already in progress");
        }

        const deployment = await this.deploymentRepository.create({
            projectId,
            status: DeployementStatus.QUEUED
        });

        const ecsTask = new EcsRunTaskBuilder()
            .withCluster(CLUSTER_ARN)
            .withTaskDefinition(ecsSettings.TASK)
            .withFargate()
            .withNetwork(vpcSettings.SUBNETS[0], vpcSettings.SECURITY_GROUPS[0], true)
            .withContainerEnv(ECR_CONTAINER.NAME, {
                'GIT_REPOSITORY__URL': gitURL,
                'DEPLOYMENT_ID': deployment.id,
                'PROJECT_ID': projectSlug,
                'ECS_ACCESS_KEY_ID': AppConfig.ECS_ACCESS_KEY,
                'ECS_SECERET_ACCESS_KEY': AppConfig.SECRET_ACCESS_KEY,
                'REDIS_URL': AppConfig.REDIS_URL,
                'KAFKA_BROKER_1': AppConfig.KAFKA_BROKER_1,
                'KAFKA_USERNAME': AppConfig.KAFKA_USERNAME,
                'KAFKA_PASSWORD': AppConfig.KAFKA_PASSWORD
            })
            .build();
        
        await ecsTask.execute();
        return { projectSlug, url: `http://${projectSlug}.localhost:8000` };
    }

    async createProject(projectDTO) {
        const project = await this.projectRepository.create({
            ...projectDTO,
            subDomain: generateSlug(),
        })
        return project;
    }
}
module.exports = { ProjectService };