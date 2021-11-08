import { middyfy } from '@libs/lambda';
import { S3, SQS } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import * as csvParser from 'csv-parser';

const { S3_BUCKET, REGION } = process.env;

const importFileParser = async (event: S3Event) => {
    const s3 = new S3({ region: REGION });

    event.Records.forEach(record => {
        const sqs = new SQS();
        const stream = s3.getObject({
            Bucket: S3_BUCKET,
            Key: record.s3.object.key,
        }).createReadStream();

        stream
            .pipe(csvParser())
            .on('data', (data) => {
                console.log(data);
                sqs.sendMessage({
                    // QueueUrl: process.env.SQS_URL,
                    QueueUrl: "https://sqs.eu-west-1.amazonaws.com/094910746491/aws-task6-sqs",
                    MessageBody: JSON.stringify(data),
                }, err => {
                    if (err) {
                        console.log(err, 'Error in SQS service. importFileParser dunction');
                    }
                });
            })
            .on('end', async () => {
                console.log(`Copy from ${S3_BUCKET}/${record.s3.object.key}`);

                await s3.copyObject({
                    Bucket: S3_BUCKET,
                    CopySource: `${S3_BUCKET}/${record.s3.object.key}`,
                    Key: record.s3.object.key.replace('uploaded', 'parsed'),
                }).promise();

                console.log('work is final');
            });
    });
};

export const main = middyfy(importFileParser);