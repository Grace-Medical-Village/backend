import { Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { DeleteItemOutput } from 'aws-sdk/clients/dynamodb';
import { Item, Options, Response } from './types';
import { genericResponse, localOptions } from './utils';

const { IS_OFFLINE, TABLE_NAME } = process.env;

const options: Options = IS_OFFLINE ? { ...localOptions } : {};
const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event, context, callback) => {
  const id: string = event?.query?.id;
  const key: string = event?.query?.key;

  const item: Item = {
    id,
    key,
  };

  const params = {
    Key: item,
    TableName: TABLE_NAME,
  };

  let response: Response = { ...genericResponse };
  dynamoDb.delete(params, (error: AWSError, result: DeleteItemOutput) => {
    if (error) {
      response = {
        ...response,
        statusCode: error.statusCode,
        body: JSON.stringify({ error: error.message }),
      };
      console.error(error);
    } else
      console.log({
        item: { ...item },
        result: { ...result },
        remainingTimeMillis: context.getRemainingTimeInMillis(),
      });
    callback(null, response);
  });
};
