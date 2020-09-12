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
    const data = JSON.parse(event?.body ?? '{}');
    if (Object.entries(data).length === 0) {
        response = {
            statusCode: 400,
            body: {
                error: 'Error',
                message: 'Patient data is empty',
            },
        };
        throw new Error(JSON.stringify(response));
    }
    console.log(data);
    const params = {
        TableName: process.env.DYNAMODB_TABLE ?? 'patients',
        Item: data,
    };
    dynamoDb.put(params, (error, result) => {
        if (error) {
            console.error(error);
            response = {
                statusCode: error.statusCode || 400,
                headers: { 'Content-Type': 'text/plain' },
                body: `Error: Couldn't put the data ${JSON.stringify(data)}`,
            };
            return;
        }
        response = {
            statusCode: 200,
            body: JSON.stringify(result),
        };
        callback(null, response);
    });
};
