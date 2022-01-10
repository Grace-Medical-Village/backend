import { RDSDataService } from 'aws-sdk';
import {
  BeginTransactionRequest,
  CommitTransactionRequest,
  CommitTransactionResponse,
  ExecuteStatementRequest,
  FieldList,
  Id,
  SqlParametersList,
} from 'aws-sdk/clients/rdsdataservice';
import { DATA_API_TYPES } from '../types';
import { isLocal, isTest } from './index';

type DbRequest = (
  sql: string,
  transactionId?: string | null
) => Promise<FieldList[]>;

type BeginTransaction = () => Promise<Id | null>;

type CommitTransaction = (
  transactionId: string
) => Promise<CommitTransactionResponse | void>;

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
  transactionId: string | null,
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

export const getRdsParams: GetRdsParams = (sql, transactionId, overrides) => {
  if (DATABASE && RESOURCE_ARN && SECRET_ARN) {
    const result: ExecuteStatementRequest = {
      continueAfterTimeout: false,
      database: DATABASE,
      includeResultMetadata: isLocal() ?? false,
      parameters: [],
      resourceArn: RESOURCE_ARN,
      secretArn: SECRET_ARN,
      sql,
      ...overrides,
    };
    if (transactionId) {
      result.transactionId = transactionId;
    }
    return result;
  } else {
    throw new Error(
      `Error: unable to build rdsParams with { DATABASE: ${DATABASE}, RESOURCE_ARN: ${RESOURCE_ARN}, SECRET_ARN: ${SECRET_ARN} }`
    );
  }
};

export const buildBeginTransactionRequest =
  (): BeginTransactionRequest | void => {
    if (DATABASE && RESOURCE_ARN && SECRET_ARN) {
      return {
        database: DATABASE,
        resourceArn: RESOURCE_ARN,
        secretArn: SECRET_ARN,
      };
    } else {
      throw new Error(
        `Error: unable to build buildBeginTransactionRequest with { DATABASE: ${DATABASE}, RESOURCE_ARN: ${RESOURCE_ARN}, SECRET_ARN: ${SECRET_ARN} }`
      );
    }
  };

export const buildCommitTransactionRequest = (
  transactionId: string
): CommitTransactionRequest | void => {
  if (RESOURCE_ARN && SECRET_ARN && transactionId) {
    return {
      resourceArn: RESOURCE_ARN,
      secretArn: SECRET_ARN,
      transactionId,
    };
  } else {
    throw new Error(
      `Error: unable to build buildCommitTransactionRequest with { RESOURCE_ARN: ${RESOURCE_ARN}, SECRET_ARN: ${SECRET_ARN}, transactionId: ${transactionId}`
    );
  }
};

export const dbRequest: DbRequest = async (sql, transactionId = null) => {
  const rdsDataService = getRdsDataService();
  const rdsParams: ExecuteStatementRequest | void = getRdsParams(
    sql,
    transactionId,
    {}
  );

  let data: FieldList[] = [];

  if (rdsDataService && rdsParams) {
    const response = await rdsDataService.executeStatement(rdsParams).promise();

    if (response.records && response.records.length > 0) {
      data = response.records;
    }
  }
  return data;
};

export const beginTransaction: BeginTransaction = async () => {
  const rdsDataService = getRdsDataService();
  const beginTransactionRequest: BeginTransactionRequest | void =
    buildBeginTransactionRequest();

  let result: string | null = null;

  if (rdsDataService && beginTransactionRequest) {
    const response = await rdsDataService
      .beginTransaction(beginTransactionRequest)
      .promise();

    result = response?.transactionId ?? null;
  }
  return result;
};

export const commitTransaction: CommitTransaction = async (transactionId) => {
  const rdsDataService = getRdsDataService();
  const commitTransactionRequest: CommitTransactionRequest | void =
    buildCommitTransactionRequest(transactionId);

  if (rdsDataService && commitTransactionRequest) {
    const response = await rdsDataService
      .commitTransaction(commitTransactionRequest)
      .promise();

    return response;
  }
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
