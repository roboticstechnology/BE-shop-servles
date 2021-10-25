import { SNS } from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';
import { MessageAttributeMap } from 'aws-sdk/clients/sns';

const { REGION, PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
};

export const catalogBatchProcess = async (event) => {
    const client = new Client(dbOptions);
    try {
        const InputProducts = event.Records.map(({ body }) => JSON.parse(body));
        const sns = new SNS({ region: REGION });
        console.log(InputProducts);
        await client.connect();

        for (const product of InputProducts) {
            const { title, description, price, count } = product;
            console.log(product);

            const { rows: createProductRow } = await client.query('insert into products (title, description, price) VALUES($1, $2, $3) returning id', [title, description, price]);
            console.log('createProductRow', createProductRow[0]);
            const createStockRow = await client.query('insert into stocks (product_id, count) VALUES ($1, $2)', [createProductRow[0].id, count]);
            console.log('createStockRow', createStockRow);

            const TopicArn = process.env.SNS_ARN;
            const Subject = 'added new product is Success';
            const Message = JSON.stringify(product);
            const MessageAttributes: MessageAttributeMap = {
                event: {
                    DataType: 'String',
                    StringValue: 'product_added',
                },
                product_title: {
                    DataType: 'String',
                    StringValue: product.title,
                },
            };

            await sns.publish({ TopicArn, Subject, Message, MessageAttributes }).promise();

            console.log('send message is final ', product);
        }
    } catch (e) {
        console.error('ERROR in catalogBatchProcess', e);
    } finally {
        client.end();
    }
};


export const main = middyfy(catalogBatchProcess);