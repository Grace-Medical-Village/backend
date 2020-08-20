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
console.log(options);
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient(options);
exports.main = (event, context, callback) => {
    let response;
    const patient = JSON.parse(event?.body ?? '{}');
    console.log(context);
    if (Object.entries(patient).length === 0) {
        response = {
            statusCode: 400,
            body: {
                error: 'Error',
                message: 'Patient data is empty',
            },
        };
        throw new Error(JSON.stringify(response));
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
        birthdate,
        country,
        firstName,
        gender,
        hispanic,
        language,
        lastName,
        zipCode5,
        createdAt,
    };
    const params = {
        TableName: process.env.DYNAMODB_TABLE ?? 'patients',
        Item: item,
    };
    dynamoDb.put(params, (error, result) => {
        if (error) {
            console.error(error);
            response = {
                statusCode: error.statusCode || 400,
                headers: { 'Content-Type': 'text/plain' },
                body: `Error: Couldn't put the patient ${firstName} ${lastName} with ID: ${id}`,
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
