const { generateSlug } = require('random-word-slugs');
const { EcsRunTaskBuilder} = require('../builders/task.builder');
const {awsConfig, awsRegionIndexMap} = require('../config/aws.config');
const {AppConfig} = require('../config/app.config');

//settings
const regionIndex = awsRegionIndexMap['ap-south-1'];
const ecsSettings = awsConfig[regionIndex].ECS;
const CLUSTER_ARN = awsConfig[regionIndex].CLUSTER;
const vpcSettings = awsConfig[regionIndex].VPC;
const ecrSettings = awsConfig[regionIndex].ECR;

//required fields
const ECR_CONTAINER = ecrSettings.REPOSITORIS[0].IMAGES[0].CONTAINERS[0]; //builder-image

class ProjectService {
    async createProject(gitURL) {
        const projectSlug = generateSlug();
        const ecsTask = new EcsRunTaskBuilder()
            .withCluster(CLUSTER_ARN)
            .withTaskDefinition(ecsSettings.TASK)
            .withFargate()
            .withNetwork(vpcSettings.SUBNETS[0], vpcSettings.SECURITY_GROUPS[0], true)
            .withContainerEnv(ECR_CONTAINER.NAME, {
                'GIT_REPOSITORY__URL': gitURL,
                'PROJECT_ID': projectSlug,
                'ECS_ACCESS_KEY_ID': AppConfig.ECS_ACCESS_KEY,
                'ECS_SECERET_ACCESS_KEY': AppConfig.SECRET_ACCESS_KEY,
                'REDIS_URL': AppConfig.REDIS_URL
            })
            .build();
        await ecsTask.execute();
        return { projectSlug, url: `http://${projectSlug}.localhost:8000` };
    }

}
module.exports = { ProjectService };