import { Callback, Context, Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { Options, RequestBody, Response } from './types';

const { IS_OFFLINE, TABLE_NAME } = process.env;
let options: Options = {};

if (IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event: any, _context: Context, callback: Callback): void => {
  const data: RequestBody = event?.body ?? {};
  const params = {
    TableName: TABLE_NAME,
    Item: data,
  };

  let response: Response = {};
  dynamoDb.put(params, (error: AWSError, result: PutItemOutput) => {
    if (error) {
      response = {
        statusCode: error.statusCode,
        body: JSON.stringify({ error: error.message }),
      };
      console.error(error);
    } else {
      response = {
        statusCode: 201,
      };
      console.log({ ...result, ...data });
    }
    console.log(response);
    callback(null, response);
  });
};
