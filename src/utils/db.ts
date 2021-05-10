import { RDSDataService } from 'aws-sdk';
import {
  ExecuteStatementRequest,
  FieldList,
} from 'aws-sdk/clients/rdsdataservice';
import { T } from '../types';
import { indexOutOfBounds } from './index';

type GetData = (sql: string) => Promise<FieldList[]>;

type GetField = (
  fieldList: FieldList,
  index: number,
  type: T
) => string | number | boolean | undefined | void;
type GetFieldNumber = (fieldList: FieldList, index: number) => number;
type GetFieldString = (fieldList: FieldList, index: number) => string;
type GetRdsDataService = () => RDSDataService | void;
type GetDefaultRdsParams = () => ExecuteStatementRequest | void;

const { DATABASE, ENDPOINT, RESOURCE_ARN, SECRET_ARN } = process.env;

export const getRdsDataService: GetRdsDataService = () => {
  if (ENDPOINT) {
    return new RDSDataService({
      apiVersion: '2018-08-01',
      endpoint: ENDPOINT,
      maxRetries: 3,
      region: 'us-east-1',
      sslEnabled: true,
    });
  } else {
    throw new Error(
      `Error: unable to getRdsDataService with { ENDPOINT: ${ENDPOINT} }`
    );
  }
};

export const getDefaultRdsParams: GetDefaultRdsParams = () => {
  if (DATABASE && RESOURCE_ARN && SECRET_ARN)
    return {
      continueAfterTimeout: false,
      database: DATABASE,
      includeResultMetadata: false,
      parameters: [],
      resourceArn: RESOURCE_ARN,
      secretArn: SECRET_ARN,
      sql: '',
    };
  else {
    throw new Error(
      `Error: unable to build rdsParams with { DATABASE: ${DATABASE}, RESOURCE_ARN: ${RESOURCE_ARN}, SECRET_ARN: ${SECRET_ARN} }`
    );
  }
};

export const getData: GetData = async (sql) => {
  const rdsDataService = getRdsDataService();
  const defaultRdsParams = getDefaultRdsParams();

  let data: FieldList[] = [];

  if (rdsDataService && defaultRdsParams) {
    const params: ExecuteStatementRequest = {
      ...defaultRdsParams,
      sql,
    };

    const response = await rdsDataService.executeStatement(params).promise();

    if (response.records && response.records.length > 0)
      data = response.records;
  }
  return data;
};

export const getField: GetField = (fieldList, index, type) => {
  if (indexOutOfBounds(index, fieldList)) {
    throw new Error(
      `Error: getField - index ${index} out of bounds for fieldList ${fieldList}`
    );
  } else if (!fieldList[index][type]) {
    throw new Error(
      `Error: getField - unable to access property on ${fieldList}[${index}][${type}]`
    );
  } else {
    return fieldList[index][type];
  }
};

export const getFieldNumber: GetFieldNumber = (fieldList, index) => {
  const result = getField(fieldList, index, T.NUMBER);
  if (typeof result === 'number') return result;
  else {
    throw new Error(
      `Error: getFieldNumber did not return ${T.NUMBER} for ${fieldList}[${index}][${T.NUMBER}]`
    );
  }
};

export const getFieldString: GetFieldString = (fieldList, index) => {
  const result = getField(fieldList, index, T.STRING);
  if (typeof result === 'string') return result;
  else {
    throw new Error(
      `Error: getFieldString did not return ${T.STRING} for ${fieldList}[${index}][${T.STRING}]`
    );
  }
};
