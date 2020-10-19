import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { QueryInput, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { Options, Response } from './types';

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
  const id: string = event?.queryStringParameters?.id ?? '';

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

  let response: Response = {};
  dynamoDb.query(params, (error: AWSError, result: QueryOutput) => {
    if (error) {
      response = {
        statusCode: error.statusCode,
        body: JSON.stringify({ error: error.message }),
      };
    } else {
      response = {
        statusCode: 200,
        body: JSON.stringify(result.Items),
      };
    }
    console.log(response);
    callback(null, response);
  });
};
