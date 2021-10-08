import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { S3 } from "aws-sdk";
import { S3EventRecord } from 'aws-lambda';
import csv from 'csv-parser';

const { REGION } = process.env;

const importFileParser = async (event) => {
  
};

export const main = middyfy(importFileParser);