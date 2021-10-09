import type { AWS } from '@serverless/typescript';
import { importProductsFile, importFileParser } from 'src/functions';
// import { importProductsFile } from 'src/functions';

const serverlessConfiguration: AWS = {
  service: 'import-service-s3',
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
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      S3_BUCKET: '${env:S3_BUCKET}',
      SQS_URL: '${cf:product-service-dev.SQSQueueOutput}'
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: 'arn:aws:s3:::import-service-s3'
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::import-service-s3/*'
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: '${cf:product-service-dev.SQSQueueArnOutput}',
      }
    ],

  },
  // resources: {
  //   Resources: {
  //     SQSQueue: {
  //       Type: 'AWS::SQS::Queue',
  //       Properties: { QueueName: 'aws-task6-sqs' },
  //     },
  //   }
  // },


  // import the function via paths
  functions: { importProductsFile, importFileParser },
  // functions: { importProductsFile }


};

module.exports = serverlessConfiguration;
