import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { S3 } from "aws-sdk";

const { S3_BUCKET, REGION } = process.env;

const importProductsFile = async (event) => {

    try {
        const { name } = event.queryStringParameters;
        const objectKey = `uploaded/${name}`;
        const s3 = new S3({ region: REGION });
        const params = { Bucket: S3_BUCKET, Key: objectKey, Expires: 3600, ContentType: 'text/csv' };
        const url = await s3.getSignedUrlPromise('putObject', params);

        return formatJSONResponse(url, 200);
    } catch (e) {
        console.log(e);
        return formatJSONResponse('internal error', 500);
    }
}

export const main = middyfy(importProductsFile);