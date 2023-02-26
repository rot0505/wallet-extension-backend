import { Stack, StackProps, aws_apigateway as apigateway, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { CfnSubnetGroup, CfnCacheCluster } from 'aws-cdk-lib/aws-elasticache';
import { Vpc, DefaultInstanceTenancy, SubnetType } from 'aws-cdk-lib/aws-ec2';
import * as path from 'path';

export class ExpressInfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambda.Function(this, 'gosu-backend', {
      runtime: lambda.Runtime.NODEJS_16_X,
      memorySize: 2048,
      timeout: Duration.seconds(90),
      handler: 'build/index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '/../../express-app')),
      environment: {
        REGION: Stack.of(this).region,
        AVAILABILITY_ZONES: JSON.stringify(
          Stack.of(this).availabilityZones,
        ),
      },
    });

    const api = new apigateway.LambdaRestApi(this, 'gosu-api', {
      handler: lambdaFunction,
      proxy: true,
    });

  }
}

export class RedisInfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'RedisVPC', {
      cidr: '10.10.0.0/16',
      enableDnsHostnames: true,
      enableDnsSupport: true,
      defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
          {
              cidrMask: 24,
              name: 'Public',
              subnetType: SubnetType.PUBLIC
          },
          {
              cidrMask: 26,
              name: 'Private',
              subnetType: SubnetType.PRIVATE_WITH_NAT
        },
      ]
    });

    const subnets = vpc.selectSubnets({subnetType: SubnetType.PUBLIC}).subnetIds;

    const redisSubnetGroup = new CfnSubnetGroup(
      this,
      'GiruToolsRedisSubnetGroup',
      {
        cacheSubnetGroupName: 'GiruToolsRedis',
        subnetIds: subnets,
        description: 'Subnet for GiruTools'
      }
    );

    const redis = new CfnCacheCluster(this, 'GiruRedisCluster', 
    {
      engine: 'redis',
      cacheNodeType: 'cache.t4g.micro',
      numCacheNodes: 1,
      clusterName: 'GiruToolsCluster',
      vpcSecurityGroupIds: [vpc.vpcDefaultSecurityGroup],
      cacheSubnetGroupName: redisSubnetGroup.ref,
    });
    redis.addDependsOn(redisSubnetGroup);

  }
}

export class DevExpressInfrastructure extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambda.Function(this, 'giru-app-dev', {
      runtime: lambda.Runtime.NODEJS_16_X,
      memorySize: 1024,
      timeout: Duration.seconds(90),
      handler: 'build/index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '/../../express-app')),
      environment: {
        REGION: Stack.of(this).region,
        AVAILABILITY_ZONES: JSON.stringify(
          Stack.of(this).availabilityZones,
        ),
      },
    });

    const api = new apigateway.LambdaRestApi(this, 'giru-api-dev', {
      handler: lambdaFunction,
      proxy: true,
    });

  }
}


