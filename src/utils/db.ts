import { RDSDataService } from 'aws-sdk';
import {
  ExecuteStatementRequest,
  ExecuteStatementResponse,
} from 'aws-sdk/clients/rdsdataservice';

const { DATABASE, ENDPOINT, RESOURCE_ARN, SECRET_ARN } = process.env;

export const rdsParams: ExecuteStatementRequest = {
  continueAfterTimeout: true,
  database: DATABASE,
  includeResultMetadata: false,
  parameters: [],
  resourceArn: RESOURCE_ARN,
  secretArn: SECRET_ARN,
  sql: '',
};

export const rdsDataService = new RDSDataService({
  apiVersion: '2018-08-01',
  endpoint: ENDPOINT,
  maxRetries: 3,
  region: 'us-east-1',
  sslEnabled: true,
});

export const getData = async (
  sql: string
): Promise<ExecuteStatementResponse> => {
  return await rdsDataService
    .executeStatement({
      ...rdsParams,
      sql,
    })
    .promise();
};
