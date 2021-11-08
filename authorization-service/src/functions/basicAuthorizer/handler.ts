import 'source-map-support/register';

// import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const basicAuthorizer = async (event, _ctx, cb) => {

  console.log('event', event);

  //const authorizationHeader = event.headers.Authorization;

  if (event.type !== 'TOKEN') {
    cb('Unauthorized');
  }

  try {
    const encoded = event.authorizationToken.split(' ')[1];
    const [username, password] = Buffer.from(encoded, 'base64')
      .toString('utf-8')
      .split(':');
    const pass = process.env[username];
    const effect = !pass || pass !== password ? 'Deny' : 'Allow';
    const policy = generatePolicy(encoded, event.methodArn, effect);
    cb(null, policy);
  } catch (e) {
    console.log('basicAuthorizer lamda', e);
    cb(`Unauthorized: ${e.message}`);
  }
};

const generatePolicy = (
  principalId: string,
  resource: string,
  effect: 'Deny' | 'Allow' = 'Allow'
) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

export const main = middyfy(basicAuthorizer);