import { Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { GetItemOutput } from 'aws-sdk/clients/dynamodb';
import { Item, Response } from './types';
import { genericResponse, options } from './utils';

const { TABLE_NAME } = process.env;

const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event, context, callback) => {
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
    console.log('YOU ARE HERE...');
    if (error) {
      response = {
        ...response,
        statusCode: error.statusCode,
        body: JSON.stringify({ error: error.message }),
      };
      console.log('__ERROR__');
      console.log(error);
    } else response.body = JSON.stringify(result.Item) ?? '{}';

    console.log('__RESULT__');
    console.log({ ...result });
    console.log({
      item: { ...item },
      response: { ...response },
      remainingTimeMillis: context.getRemainingTimeInMillis(),
    });

    callback(null, response);
  });
};
