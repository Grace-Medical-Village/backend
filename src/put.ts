import { Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { UpdateItemOutput } from 'aws-sdk/clients/dynamodb';
import { Item, Options, Response } from './types';
import { genericResponse, localOptions } from './utils';

const { IS_OFFLINE, TABLE_NAME } = process.env;

const options: Options = IS_OFFLINE ? { ...localOptions } : {};
const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event, context, callback) => {
  const id: string = event?.query?.id;
  const key: string = event?.query?.key;
  const data: unknown = event?.body ?? '{}';
  let updateExpression = 'SET';
  const expressionAttributeValues: unknown = {};

  Object.keys(data).map((x: string) => {
    const y = `:${x}`;
    updateExpression = updateExpression.concat(` ${x} = ${y},`);
    expressionAttributeValues[y] = data[x];
  });

  const item: Item = {
    id,
    key,
  };

  const params = {
    Key: item,
    TableName: TABLE_NAME,
    UpdateExpression: updateExpression.substring(0, updateExpression.length - 1),
    ExpressionAttributeValues: expressionAttributeValues,
  };

  let response: Response = { ...genericResponse };
  dynamoDb.update(params, (error: AWSError, result: UpdateItemOutput) => {
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
