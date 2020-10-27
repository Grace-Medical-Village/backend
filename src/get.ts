import { APIGatewayEvent, APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { GetItemOutput } from 'aws-sdk/clients/dynamodb';
import { Response, Item, Options } from './types';

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

  let response: Response = {};
  dynamoDb.get(params, (error: AWSError, result: GetItemOutput) => {
    if (error) {
      response = {
        statusCode: error.statusCode,
        body: JSON.stringify({ error: error.message }),
      };
    } else {
      response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
    }
    console.log(response);
    callback(null, response);
  });
};
