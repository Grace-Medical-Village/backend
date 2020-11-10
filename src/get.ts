import { Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { GetItemOutput } from 'aws-sdk/clients/dynamodb';
import { Response, Item, Options } from './types';
import { localOptions } from './utils';

const { IS_OFFLINE, TABLE_NAME } = process.env;

const options: Options = IS_OFFLINE ? { ...localOptions } : {};

const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event, _context, callback) => {
  const id: string = event?.query?.id;
  const key: string = event?.query?.key;

  const item: Item = {
    id,
    key,
  };

  const params = {
    TableName: TABLE_NAME,
    Key: item,
  };

  let response: Response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
  dynamoDb.get(params, (error: AWSError, result: GetItemOutput) => {
    if (error) {
      response = {
        statusCode: error.statusCode,
        body: JSON.stringify({ error: error.message }),
      };
    } else {
      response = {
        body: JSON.stringify(result.Item) ?? '{}',
      };
    }
    console.log(response);
    callback(null, response);
  });
};
