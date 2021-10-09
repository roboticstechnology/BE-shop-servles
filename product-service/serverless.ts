import type { AWS } from '@serverless/typescript';

// import hello from '@functions/hello';
import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  useDotenv: true,
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',
    endpointType: 'regional',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: '${env:PG_HOST}',
      PR_PORT: '${env:PR_PORT}',
      PG_DATABASE: '${env:PG_DATABASE}',
      PG_USERNAME: '${env:PG_USERNAME}',
      PG_PASSWORD: '${env:PG_PASSWORD}',
      SNS_ARN: { Ref: 'SNSTopic' },
      SQL_URL: { Ref: 'SQSQueue' }
    },
    lambdaHashingVersion: '20201221',
    httpApi: {
      cors: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] },
      },
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: { Ref: 'SNSTopic' },
      },
    ]
  },

  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: { QueueName: 'aws-task6-sqs' },
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: { TopicName: 'aws-task6-sns' },
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '5777863@mail.ru',
          Protocol: 'email',
          TopicArn: { Ref: 'SNSTopic' },
        },
      },

    },
    Outputs: {
      SQSQueueOutput: {
        Value: {
          Ref: 'SQSQueue',
        },
        Export: {
          Name: {
            "Fn::Sub": "${AWS::StackName}-SQSQueueOutput"
          }
        }
      },
      SQSQueueArnOutput: {
        Value: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] },
        Export: {
          Name: {
            "Fn::Sub": "${AWS::StackName}-SQSQueueArnOutput"
          }
        }
      },
    },
  },

  // import the function via paths
  functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
};

module.exports = serverlessConfiguration;
