import { DockerImageAsset, NetworkMode } from 'aws-cdk-lib/aws-ecr-assets';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import { ContainerImage, FargatePlatformVersion, Secret } from 'aws-cdk-lib/aws-ecs';
import { Subnet, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { StringParameter }from 'aws-cdk-lib/aws-ssm';
import { ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';

enum Subnets {
    SUBNET1 = 'subnet-095e0d1745aa5ed14',
    SUBNET2 = 'subnet-0fc7317f42c55b5b3',
    SUBNET3 = 'subnet-03451d035a017e398',
    SUBNET4 = 'subnet-03ba99ec3a0d47c63',
    SUBNET5 = 'subnet-0312b0f54eb5a876c',
    SUBNET6 = 'subnet-0ef85fec6891de0cf',
}

enum SecretKeys {
    ICY1 = 'ICY_TOOLS_API_KEY_1',
    ICY2 = 'ICY_TOOLS_API_KEY_2',
    OS = 'OS_API_KEY',
    REDIS = 'REDIS_CLIENT_URL',
    PROD_REDIS = '/prod/REDIS_CLIENT_URL',
    AK = 'AK',
    AKS = 'AKS'
}
const securityGroup = 'sg-0e5df111a2097d83e';
const vpcId = 'vpc-074e8d0832e527fff';
const arn = 'arn:aws:acm:us-east-1:056971060393:certificate/19f5e5ae-f661-4d8e-a555-3688f095c3f2';
const ONE_VCPU = 1024;
const MODERATE_RAM = 2048;

export class ExpressECRStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);

      const asset = new DockerImageAsset(this, 'gosu-fargate-build-image', {
        directory: path.join(__dirname, '../express-app'),
        networkMode: NetworkMode.HOST,
      })
  
    }
}

export class ExpressFargateStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const icy = StringParameter.fromSecureStringParameterAttributes(this, SecretKeys.ICY1, {parameterName: SecretKeys.ICY1});
        const icy2 = StringParameter.fromSecureStringParameterAttributes(this, SecretKeys.ICY2, {parameterName: SecretKeys.ICY2});
        const os = StringParameter.fromSecureStringParameterAttributes(this, SecretKeys.OS, {parameterName: SecretKeys.OS});
        const redis = StringParameter.fromSecureStringParameterAttributes(this, SecretKeys.REDIS, {parameterName: SecretKeys.REDIS});
        const ak = StringParameter.fromSecureStringParameterAttributes(this, SecretKeys.AK, {parameterName: SecretKeys.AK});
        const aks = StringParameter.fromSecureStringParameterAttributes(this, SecretKeys.AKS, {parameterName: SecretKeys.AKS});

        const certificate = Certificate.fromCertificateArn(this, 'SSLcertificate', arn);

        const loadBalancedFargateService = new ApplicationLoadBalancedFargateService(this, 'Gosu-Tools-Fargate', {
            memoryLimitMiB: MODERATE_RAM,
            desiredCount: 1,
            cpu: ONE_VCPU,
            protocol: ApplicationProtocol.HTTPS,
            redirectHTTP: true,
            certificate: certificate,
            taskImageOptions: {
                image: ContainerImage.fromAsset('../express-app'),
                secrets: {
                    'ICY_TOOLS_API_KEY_1': Secret.fromSsmParameter(icy),
                    'ICY_TOOLS_API_KEY_2': Secret.fromSsmParameter(icy2),
                    'OS_API_KEY' : Secret.fromSsmParameter(os),
                    'REDIS_CLIENT_URL' : Secret.fromSsmParameter(redis),
                    'AK' : Secret.fromSsmParameter(ak),
                    'AKS' : Secret.fromSsmParameter(aks),
                }
            },
            platformVersion: FargatePlatformVersion.LATEST,
            publicLoadBalancer: true,
            taskSubnets: {
                subnets: [
                    // Subnet.fromSubnetId(this, 'subnet1', Subnets.SUBNET1),
                    // Subnet.fromSubnetId(this, 'subnet2', Subnets.SUBNET2),
                    Subnet.fromSubnetId(this, 'subnet3', Subnets.SUBNET3),   
                    // Subnet.fromSubnetId(this, 'subnet4', Subnets.SUBNET4),   
                    // Subnet.fromSubnetId(this, 'subnet5', Subnets.SUBNET5),   
                    // Subnet.fromSubnetId(this, 'subnet6', Subnets.SUBNET6),                   
                ],
            },
            securityGroups: [ 
                SecurityGroup.fromSecurityGroupId(this, 'sg', securityGroup, {
                    mutable: false
                })
            ],
            vpc: Vpc.fromLookup(this, vpcId, {
                vpcId: vpcId,
            }),
        });

        const scalableTarget = loadBalancedFargateService.service.autoScaleTaskCount({
            minCapacity: 1,
            maxCapacity: 10,
        });

        scalableTarget.scaleOnCpuUtilization('CpuScaling', {
            targetUtilizationPercent: 50,
        });
          
        scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
            targetUtilizationPercent: 50,
        });

    }
}

export class ExpressFargateStackProd extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const icy = StringParameter.fromSecureStringParameterAttributes(this, SecretKeys.ICY1, {parameterName: SecretKeys.ICY1});
        const icy2 = StringParameter.fromSecureStringParameterAttributes(this, SecretKeys.ICY2, {parameterName: SecretKeys.ICY2});
        const os = StringParameter.fromSecureStringParameterAttributes(this, SecretKeys.OS, {parameterName: SecretKeys.OS});
        const redis = StringParameter.fromSecureStringParameterAttributes(this, SecretKeys.PROD_REDIS, {parameterName: SecretKeys.PROD_REDIS});
        const ak = StringParameter.fromSecureStringParameterAttributes(this, SecretKeys.AK, {parameterName: SecretKeys.AK});
        const aks = StringParameter.fromSecureStringParameterAttributes(this, SecretKeys.AKS, {parameterName: SecretKeys.AKS});

        const certificate = Certificate.fromCertificateArn(this, 'SSLcertificate', arn);

        const loadBalancedFargateService = new ApplicationLoadBalancedFargateService(this, 'Gosu-Tools-Fargate-Prod', {
            memoryLimitMiB: MODERATE_RAM,
            desiredCount: 1,
            cpu: ONE_VCPU,
            protocol: ApplicationProtocol.HTTPS,
            redirectHTTP: true,
            certificate: certificate,
            taskImageOptions: {
                image: ContainerImage.fromAsset('../express-app'),
                secrets: {
                    'ICY_TOOLS_API_KEY_1': Secret.fromSsmParameter(icy),
                    'ICY_TOOLS_API_KEY_2': Secret.fromSsmParameter(icy2),
                    'OS_API_KEY' : Secret.fromSsmParameter(os),
                    'REDIS_CLIENT_URL' : Secret.fromSsmParameter(redis),
                    'AK' : Secret.fromSsmParameter(ak),
                    'AKS' : Secret.fromSsmParameter(aks),
                }
            },
            platformVersion: FargatePlatformVersion.LATEST,
            publicLoadBalancer: true,
            taskSubnets: {
                subnets: [
                    // Subnet.fromSubnetId(this, 'subnet1', Subnets.SUBNET1),
                    // Subnet.fromSubnetId(this, 'subnet2', Subnets.SUBNET2),
                    // Subnet.fromSubnetId(this, 'subnet3', Subnets.SUBNET3),   
                    Subnet.fromSubnetId(this, 'subnet4', Subnets.SUBNET4),   
                    // Subnet.fromSubnetId(this, 'subnet5', Subnets.SUBNET5),   
                    // Subnet.fromSubnetId(this, 'subnet6', Subnets.SUBNET6),                   
                ],
            },
            securityGroups: [ 
                SecurityGroup.fromSecurityGroupId(this, 'sg', securityGroup, {
                    mutable: false
                })
            ],
            vpc: Vpc.fromLookup(this, vpcId, {
                vpcId: vpcId,
            }),
        });

        const scalableTarget = loadBalancedFargateService.service.autoScaleTaskCount({
            minCapacity: 1,
            maxCapacity: 10,
        });

        scalableTarget.scaleOnCpuUtilization('CpuScaling', {
            targetUtilizationPercent: 50,
        });
          
        scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
            targetUtilizationPercent: 50,
        });

    }
}