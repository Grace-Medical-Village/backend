Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const aws_sdk_1 = require("aws-sdk");
let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient(options);
exports.main = (event, context, callback) => {
    let response;
    const id = event?.queryStringParameters?.id ?? '';
    console.log(id);
    const item = {
        id,
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
                body: "Error: Couldn't get the new patient",
            };
            callback(error, response);
        }
        response = {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
        callback(null, response);
    });
};
