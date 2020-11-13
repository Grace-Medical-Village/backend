import { Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { GetItemOutput } from 'aws-sdk/clients/dynamodb';
import { Item, Options, Response } from './types';
console.log('FOO');
import { genericResponse, localOptions } from './utils';
console.log('BAR');

const { IS_OFFLINE, TABLE_NAME } = process.env;
console.log('BAZ');

const options: Options = IS_OFFLINE ? { ...localOptions } : {};

const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event, context, callback) => {
  console.log('42');
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

  let response: Response = { ...genericResponse };
  dynamoDb.get(params, (error: AWSError, result: GetItemOutput) => {
    console.log('TEST');
    if (error) {
      response = {
        ...response,
        statusCode: error.statusCode,
        body: JSON.stringify({ error: error.message }),
      };
    } else response.body = JSON.stringify(result.Item) ?? '{}';

    console.log({
      item: { ...item },
      response: { ...response },
      remainingTimeMillis: context.getRemainingTimeInMillis(),
    });

    console.log('HERE');
    callback(null, response);
  });
};
