import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { getProduct } from '../../db/db.utill';
import products from '../../db/products.json';

export const getProductById = async (event) => {
  const { id } = event.pathParameters;
  console.log(event);
  const product = await getProduct(products, id);
  // console.log('product', product);

  if (!product) {
    return formatJSONResponse(
      'Product not found',
      404);
  }

  return formatJSONResponse({
    product,
  }, 200);
}

export const main = middyfy(getProductById);