Object.defineProperty(exports, '__esModule', { value: true });
exports.main = void 0;
const aws_sdk_1 = require('aws-sdk');
let options = {};
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient(options);
exports.main = (event, _context, callback) => {
  let response;
  const id = event?.queryStringParameters?.id;
  const key = event?.queryStringParameters?.key;
  if (!id || !key) {
    response = {
      statusCode: 400,
      body: {
        error: true,
        message: 'Error: ID and Key are required',
      },
    };
    throw new Error(JSON.stringify(response));
  } else {
    const item = {
      id,
      key,
    };
    const params = {
      TableName: process.env.DYNAMODB_TABLE ?? 'patients',
      Key: item,
    };
    dynamoDb.get(params, (error, result) => {
      if (error) {
        console.error(error);
        response = {
          statusCode: error.statusCode || 400,
          headers: { 'Content-Type': 'text/plain' },
          body: {
            error: true,
            message: 'Error: Item does not exist for that id/key',
          },
        };
        callback(error, JSON.stringify(response));
      } else if (!result.Item) {
        response = {
          statusCode: 404,
          body: JSON.stringify({
            error: false,
            message: 'Not Found',
          }),
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
  }
};
