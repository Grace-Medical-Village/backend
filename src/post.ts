import { Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { RequestBody, Response } from './types';
import { genericResponse, options } from './utils';

const { TABLE_NAME } = process.env;

const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event, context, callback) => {
  const data: RequestBody = event?.body ?? {};
  const params = {
    TableName: TABLE_NAME,
    Item: data,
  };

  let response: Response = { ...genericResponse };
  dynamoDb.put(params, (error: AWSError, result: PutItemOutput) => {
    if (error) {
      response = {
        statusCode: error.statusCode,
        body: JSON.stringify({ error: error.message }),
      };
      console.error(error);
    } else {
      response.statusCode = 201;
      console.log({
        data: { ...data },
        result: { ...result },
        remainingTimeMillis: context.getRemainingTimeInMillis(),
      });
    }
    console.log(response);
    callback(null, response);
  });
};
