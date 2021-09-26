import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';

// import products from '../../db/products.json';

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

export const getProductsList = async () => {
  console.log(`Get list of all products, no query parameters`);
  const client = new Client(dbOptions);
  try {
    await client.connect();
    console.log("Successfully connected");
  } catch (err) {
    return formatJSONResponse(err, 500);
  }

  try {
    const { rows: products } = await client.query(
      // const products = await client.query(
      `SELECT * 
        FROM products AS T1 
          JOIN stocks AS T2 ON
            T1.id = T2.product_id`
    );

    return formatJSONResponse(products, 200);
  } catch (err) {
    return formatJSONResponse(
      'internal error',
      500
    );
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductsList);