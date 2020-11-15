import { Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { QueryOutput } from 'aws-sdk/clients/dynamodb';
import { Response } from './types';
import { genericResponse, options } from './utils';

const { TABLE_NAME } = process.env;

const dynamoDb = new DynamoDB.DocumentClient(options);

export const main: Handler = (event, context, callback) => {
  const id: string = event?.query?.id ?? '';

  const params = {
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': id,
    },
    KeyConditionExpression: '#id = :id',
    TableName: TABLE_NAME,
  };

  let response: Response = { ...genericResponse };
  dynamoDb.query(params, (error: AWSError, result: QueryOutput) => {
    if (error) {
      response = {
        ...response,
        statusCode: error.statusCode,
        body: JSON.stringify({ error: error.message }),
      };
    } else {
      response.body = JSON.stringify(result.Items);
    }

    console.log({
      id,
      response: { ...response },
      remainingTimeMillis: context.getRemainingTimeInMillis(),
    });

    callback(null, response);
  });
};
