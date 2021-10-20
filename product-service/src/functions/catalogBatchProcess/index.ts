import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        bachSize: 5,
        arn: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        },
      },
    },
  ],
};