import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import products from '../../db/products.json';

export const getProductsList = async () => {
    return formatJSONResponse(products, 200);
}

export const main = middyfy(getProductsList);