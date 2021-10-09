import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { Client } from 'pg';
import { middyfy } from '@libs/lambda';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

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

export const createProduct = async (event) => {
    console.log(event);
    const client = new Client(dbOptions);

    try {
        const { title, description, price, count } = event.body;


        await client.connect();

        console.log("Successfully connected");

        const { rows: createProductRow } = await client.query('insert into products (title, description, price) VALUES($1, $2, $3) returning id', [title, description, price]);
        console.log('createProductRow', createProductRow[0]);
        const createStockRow = await client.query('insert into stocks (product_id, count) VALUES ($1, $2)', [createProductRow[0].id, count]);
        console.log('createStockRow', createStockRow);

        const response =
            Object.keys(createProductRow).length === 0
                ? formatJSONResponse(
                    'error create new product',
                    500
                )
                : formatJSONResponse(createProductRow[0], 200);
        return response;
    } catch (err) {
        return formatJSONResponse(err.message, 500);
    } finally {
        client.end();
    }
};

export const main = middyfy(createProduct);
