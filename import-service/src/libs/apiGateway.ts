import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const headers = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  "Access-Control-Allow-Credentials": true
}

export const formatJSONResponse = (response: Record<string, unknown> | Array<Record<string, unknown>> | string, statusCode) => {

  if (statusCode === 200) {
    return {
      headers,
      statusCode,
      body: JSON.stringify(response)
    }
  }

  if (statusCode === 404 || 500) {
    return {
      headers,
      statusCode,
      body: response
    }
  }


}
