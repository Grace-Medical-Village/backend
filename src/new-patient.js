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
    const patient = JSON.parse(event?.body ?? '{}');
    if (Object.entries(patient).length === 0) {
        callback(JSON.stringify({
            error: 'Error',
            detail: 'Patient data is empty',
        }));
    }
    /**
     * TODO's
     * Testing
     * Birthdate Regex Validation
     * First Name Regex Validation
     * Last Name Regex Validation
     */
    const birthdate = patient?.birthdate;
    const firstName = patient?.firstName.toLowerCase().trim();
    const lastName = patient?.lastName.toLowerCase().trim();
    const id = `${lastName}${firstName}${birthdate}`;
    const createdAt = new Date().getTime();
    const item = {
        id,
        key: 'general',
        lastName,
        firstName,
        birthdate,
        createdAt,
    };
    const params = {
        TableName: process.env.DYNAMODB_TABLE ?? 'patients',
        Item: item,
    };
    dynamoDb.put(params, (error, result) => {
        let response;
        if (error) {
            console.error(error);
            response = {
                statusCode: error.statusCode || 400,
                headers: { 'Content-Type': 'text/plain' },
                body: `Error: Couldn't put the patient ${firstName} ${lastName} with ID: ${id}`,
            };
            callback(null, response);
            return;
        }
        response = {
            statusCode: 200,
            body: JSON.stringify(result),
        };
        callback(null, response);
    });
    console.log(context.getRemainingTimeInMillis()); // TODO CLEAN
};
