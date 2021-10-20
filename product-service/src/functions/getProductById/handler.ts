import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { Client } from 'pg';
import { middyfy } from '@libs/lambda';

import { getProduct } from '../../db/db.utill';
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

// export const getProductById = async (event) => {
//   const { id } = event.pathParameters;
//   console.log(event);
//   const product = await getProduct(products, id);
//   // console.log('product', product);

//   if (!product) {
//     return formatJSONResponse(
//       'Product not found',
//       404);
//   }

//   return formatJSONResponse({
//     product,
//   }, 200);
// }

export const getProductById = async (event) => {
  let productId: string;
  console.log(event);
  try {
    productId = event.pathParameters.id;
  } catch {
    return formatJSONResponse(
      { message: 'you need send product id to request' },
      404
    );
  }
  const client = new Client(dbOptions);
  try {
    await client.connect();
    console.log("Successfully connected");
  } catch (err) {
    return formatJSONResponse(err, 500);
  }

  try {
    console.log(productId);
    const { rows: selectedProduct } = await client.query(
    // const selectedProduct = await client.query(
      `SELECT * 
      FROM products AS T1 
        LEFT JOIN stocks AS T2 ON
          T1.id = T2.product_id
      WHERE T1.id = $1`,
      [productId]
    );

    console.log(selectedProduct[0]);
    const response =
      Object.keys(selectedProduct).length === 0
        ? formatJSONResponse(
          'id not found',
          404
        )
        : formatJSONResponse(selectedProduct[0], 200);
    return response;
  } catch (err) {
    return formatJSONResponse(err.message, 500);
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductById);
