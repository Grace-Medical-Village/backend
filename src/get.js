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
exports.main = (event, _context, callback) => {
    let response;
    const id = event?.queryStringParameters?.id ?? '';
    const key = event?.queryStringParameters?.key ?? '';
    if (!id) {
        response = {
            statusCode: 400,
            body: {
                error: 'Error',
                message: 'ID parameter is required',
            },
        };
        throw new Error(JSON.stringify(response));
    }
    const item = {
        id,
    };
    if (key) {
        item.key = key;
    }
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
        console.log(response);
        callback(null, response);
    });
};
