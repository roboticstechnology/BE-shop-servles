import { main } from './handler';
import { formatJSONResponse } from '@libs/apiGateway';
import AWSMok from 'aws-sdk-mock';
const MOCK_SIGNED_URL =
  'https://rs-app-service.s3.eu-west-1.amazonaws.com/uploaded';
const event = require('./mock.json');

describe('importProductsFile lambda test', () => {
  beforeAll(async () => {
    AWSMok.mock('S3', 'getSignedUrl', MOCK_SIGNED_URL);
  });

  test('lambda returns success response', async () => {
    const response = (await main(event, null, null)) as formatJSONResponse;
    expect(response.statusCode).toBe(200);
  });

  test('lambda returns correct response', async () => {
    const { body } = (await main(event, null, null)) as formatJSONResponse;

    expect(body).toBeTruthy();
    expect(JSON.parse(body).signedUrl).toBe(MOCK_SIGNED_URL);
  });

  test('lambda returns 500 status on error', async () => {
    AWSMok.restore();
    AWSMok.mock('S3', 'getSignedUrl', () => {
      throw new Error('Error');
    });

    const response = (await main(event, null, null)) as formatJSONResponse;

    expect(response.statusCode).toBe(500);
  });
});