const { RunTaskCommand } = require('@aws-sdk/client-ecs')
const { EcsConfig } = require('../config/ecsClient.config');
const logger = require('../logger');

const ecsClient = EcsConfig.getInstance();

class ECSTask {
  constructor(params) {
    this.params = params;
  }
  async execute() {
    try {
      const command = new RunTaskCommand(this.params);
      return await ecsClient.send(command);
    }
    catch (error) {
      logger.error('Error executing ECS Task:', error);
      throw error;
    }
  }
}


class EcsRunTaskBuilder {
  constructor() {
    this.params = {
      count: 1,
      overrides: { containerOverrides: [] }
    };
  }

  withCluster(clusterArn) {
    this.params.cluster = clusterArn;
    return this;
  }

  withTaskDefinition(taskDefArn) {
    this.params.taskDefinition = taskDefArn;
    return this;
  }

  withFargate() {
    this.params.launchType = 'FARGATE';
    return this;
  }

  withNetwork(subnetId, securityGroupId, publicIp = false) {
    this.params.networkConfiguration = {
      awsvpcConfiguration: {
        assignPublicIp: publicIp ? 'ENABLED' : 'DISABLED',
        subnets: [subnetId],
        securityGroups: [securityGroupId]
      }
    };
    return this;
  }

  withContainerEnv(containerName, envObj) {
    const environment = Object.entries(envObj).map(([name, value]) => ({
      name,
      value
    }));

    this.params.overrides.containerOverrides.push({
      name: containerName,
      environment
    });

    return this;
  }

  count(n) {
    this.params.count = n;
    return this;
  }

  build() {
    return new ECSTask(this.params);
  }
}

module.exports = { EcsRunTaskBuilder, ECSTask };
