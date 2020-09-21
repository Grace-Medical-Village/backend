import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { GetItemOutput } from 'aws-sdk/clients/dynamodb';

interface Options {
  region?: string;
  endpoint?: string;
}

interface Item {
  id: string;
  key?: string;
}

let options: Options = {};

if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event: APIGatewayEvent, _context: Context, callback: Callback): void => {
  let response;

  const id: string = event?.queryStringParameters?.id;
  const key: string = event?.queryStringParameters?.key;

  if (!id || !key) {
    response = {
      statusCode: 400,
      body: {
        error: true,
        message: 'Error: ID and Key are required',
      },
    };
    throw new Error(JSON.stringify(response));
  } else {
    const item: Item = {
      id,
      key,
    };

    const params = {
      TableName: process.env.DYNAMODB_TABLE ?? 'patients',
      Key: item,
    };

    dynamoDb.get(params, (error: AWSError, result: GetItemOutput) => {
      if (error) {
        console.error(error);
        response = {
          statusCode: error.statusCode || 400,
          headers: { 'Content-Type': 'text/plain' },
          body: {
            error: true,
            message: 'Error: Item does not exist for that id/key',
          },
        };
        callback(error, JSON.stringify(response));
      } else if (!result.Item) {
        response = {
          statusCode: 404,
          body: JSON.stringify({
            error: false,
            message: 'Not Found',
          }),
        };
      } else {
        response = {
          statusCode: 200,
          body: JSON.stringify(result.Item),
        };
      }

      console.log(response);
      callback(null, response);
    });
  }
};
