import { Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { Options, RequestBody, Response } from './types';
import { localOptions } from './utils';

const { IS_OFFLINE, TABLE_NAME } = process.env;

const options: Options = IS_OFFLINE ? { ...localOptions } : {};

const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event, _context, callback) => {
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
