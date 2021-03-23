import { RDSDataService } from 'aws-sdk';
import { ExecuteStatementRequest } from 'aws-sdk/clients/rdsdataservice';
import { BuildValues } from './types';

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
  sslEnabled: true,
});

export const buildValues: BuildValues = (values) => values.map((_, i) => `$${i + 1}`).join();
