
awsConfig = [
    {
        AWS_REGION: 'ap-south-1',
        CLUSTER: 'arn:aws:ecs:ap-south-1:346936569116:cluster/builder-cluster',
        VPC: {
            SUBNETS: ['subnet-050a07081bfdde9aa'],
            SECURITY_GROUPS: ['sg-0afdfe0eba547d85c'],
        },
        ECS: {
            TASK: 'arn:aws:ecs:ap-south-1:346936569116:task-definition/builder-task',
        },
        ECR: {
            REPOSITORIS: [
                {
                    NAME: 'builder-server',
                    URI: '346936569116.dkr.ecr.ap-south-1.amazonaws.com/builder-server',
                    IMAGES: [
                        {
                            NAME: 'builder-image',
                            TAG: 'latest',
                            CONTAINERS: [
                                {
                                    NAME: 'builder-image',
                                }
                            ]
                        }
                    ]
                },
            ],

        },
        S3:{
            BUCKETS:[
                {
                    NAME:'cloud-deployment-platform-output',
                }
            ]
        }
    }
]

awsRegionIndexMap = {
    'ap-south-1': 0
}

module.exports = { awsConfig, awsRegionIndexMap };