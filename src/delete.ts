import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { DeleteItemOutput } from 'aws-sdk/clients/dynamodb';
import { Item, Options, Response } from './types';

const { IS_OFFLINE, TABLE_NAME } = process.env;

let options: Options = {};

if (IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event: APIGatewayEvent, _context: Context, callback: Callback): void => {
  const id: string = event?.queryStringParameters?.id;
  const key: string = event?.queryStringParameters?.key;

  const item: Item = {
    id,
    key,
  };

  const params = {
    Key: item,
    TableName: TABLE_NAME,
  };

  let response: Response = {};
  dynamoDb.delete(params, (error: AWSError, result: DeleteItemOutput) => {
    if (error) {
      response = {
        statusCode: error.statusCode,
        body: JSON.stringify({ error: error.message }),
      };
      console.error(error);
    } else {
      response = {
        statusCode: 200,
      };
      console.log(result);
    }
    callback(null, response);
  });
};
