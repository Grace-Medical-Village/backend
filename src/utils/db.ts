import { RDSDataService } from 'aws-sdk';
import {
  ExecuteStatementRequest,
  FieldList,
  SqlParametersList,
} from 'aws-sdk/clients/rdsdataservice';
import { DATA_API_TYPES } from '../types';
import { isLocal, isTest } from './index';

type DbRequest = (sql: string) => Promise<FieldList[]>;

type GetFieldValue = (
  fieldList: FieldList,
  index: number
) => string | number | boolean | null;

type GetRdsDataService = () => RDSDataService | void;

interface Overrides {
  parameters?: SqlParametersList | undefined;
}

type GetRdsParams = (
  sql: string,
  overrides: Overrides
) => ExecuteStatementRequest | void;

const { DATABASE, ENDPOINT, RESOURCE_ARN, SECRET_ARN } = process.env;

export const getRdsDataService: GetRdsDataService = () => {
  const config: RDSDataService.Types.ClientConfiguration = {
    apiVersion: '2018-08-01',
    maxRetries: 3,
    region: 'us-east-1',
    sslEnabled: true,
  };
  if (isLocal() || isTest()) {
    config.endpoint = ENDPOINT;
  }

  return new RDSDataService(config);
};

export const getRdsParams: GetRdsParams = (sql, overrides) => {
  if (DATABASE && RESOURCE_ARN && SECRET_ARN)
    return {
      continueAfterTimeout: false,
      database: DATABASE,
      includeResultMetadata: isLocal() ?? false,
      parameters: [],
      resourceArn: RESOURCE_ARN,
      secretArn: SECRET_ARN,
      sql,
      ...overrides,
    };
  else {
    throw new Error(
      `Error: unable to build rdsParams with { DATABASE: ${DATABASE}, RESOURCE_ARN: ${RESOURCE_ARN}, SECRET_ARN: ${SECRET_ARN} }`
    );
  }
};

export const dbRequest: DbRequest = async (sql) => {
  const rdsDataService = getRdsDataService();
  const rdsParams: ExecuteStatementRequest | void = getRdsParams(sql, {});

  let data: FieldList[] = [];

  if (rdsDataService && rdsParams) {
    const response = await rdsDataService.executeStatement(rdsParams).promise();

    if (response.records && response.records.length > 0) {
      data = response.records;
    }
  }
  return data;
};

export const getFieldValue: GetFieldValue = (fieldList, index) => {
  let result: string | number | boolean | null = null;
  if (fieldList.length >= index + 1) {
    const [key, value] = Object.entries(fieldList[index])[0];
    if (key === DATA_API_TYPES.IS_NULL && value) {
      result = null;
    } else result = value;
  }
  return result;
};

export const sqlParen = (x: string): string => `'${x}'`;
