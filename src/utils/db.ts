import { RDSDataService } from 'aws-sdk';
import { ExecuteStatementRequest } from 'aws-sdk/clients/rdsdataservice';
import {
  DATA_API_TYPES,
  UnknownObject,
  GetRdsDataService,
  GetRdsParams,
  DB,
  GetFieldValue,
} from '../types';
import { isLocal, isTest } from './index';
import { camelCase } from 'lodash';

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
      // includeResultMetadata: isLocal() ?? false,
      includeResultMetadata: true,
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

export const db: DB = {
  beginTransaction: (): void => {
    return;
  },
  buildData: (response) => {
    const result: UnknownObject[] = [];
    const { columnMetadata, records } = response;
    if (columnMetadata && records && records.length > 0) {
      records.map((fieldList) => {
        let object: UnknownObject = {};
        fieldList.map((field, idx) => {
          const key = camelCase(columnMetadata[idx].name);

          let value = null;
          if ('longValue' in field) {
            value = field.longValue;
          } else if ('stringValue' in field) {
            value = field.stringValue;
          } else if ('booleanValue' in field) {
            value = field.booleanValue;
          } else if ('doubleValue' in field) {
            value = field.doubleValue;
          } else if ('isNull' in field) {
            value = field.isNull ? null : undefined;
          }

          if (key && value !== undefined) {
            object = {
              ...object,
              [key]: value,
            };
          }
        });
        result.push(object);
      });
    }
    return result;
  },
  commitTransaction: (): void => {
    return;
  },
  executeStatement: async (sql, transactionId = null) => {
    let result: unknown[] = [];

    try {
      const rdsDataService = getRdsDataService();
      const rdsParams: ExecuteStatementRequest | void = getRdsParams(
        sql,
        transactionId,
        {}
      );

      if (rdsDataService && rdsParams) {
        const response = await rdsDataService
          .executeStatement(rdsParams)
          .promise();

        if (response.records && response.records.length > 0) {
          result = db.buildData(response);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return result;
  },
};

// export const buildBeginTransactionRequest =
//   (): BeginTransactionRequest | void => {
//     if (DATABASE && RESOURCE_ARN && SECRET_ARN) {
//       return {
//         database: DATABASE,
//         resourceArn: RESOURCE_ARN,
//         secretArn: SECRET_ARN,
//       };
//     } else {
//       throw new Error(
//         `Error: unable to build buildBeginTransactionRequest with { DATABASE: ${DATABASE}, RESOURCE_ARN: ${RESOURCE_ARN}, SECRET_ARN: ${SECRET_ARN} }`
//       );
//     }
//   };

// export const buildCommitTransactionRequest = (
//   transactionId: string
// ): CommitTransactionRequest | void => {
//   if (RESOURCE_ARN && SECRET_ARN && transactionId) {
//     return {
//       resourceArn: RESOURCE_ARN,
//       secretArn: SECRET_ARN,
//       transactionId,
//     };
//   } else {
//     throw new Error(
//       `Error: unable to build buildCommitTransactionRequest with { RESOURCE_ARN: ${RESOURCE_ARN}, SECRET_ARN: ${SECRET_ARN}, transactionId: ${transactionId}`
//     );
//   }
// };
// export const beginTransaction: BeginTransaction = async () => {
//   const rdsDataService = getRdsDataService();
//   const beginTransactionRequest: BeginTransactionRequest | void =
//     buildBeginTransactionRequest();
//
//   let result: string | null = null;
//
//   if (rdsDataService && beginTransactionRequest) {
//     const response = await rdsDataService
//       .beginTransaction(beginTransactionRequest)
//       .promise();
//
//     result = response?.transactionId ?? null;
//   }
//   return result;
// };

// export const commitTransaction: CommitTransaction = async (transactionId) => {
//   const rdsDataService = getRdsDataService();
//   const commitTransactionRequest: CommitTransactionRequest | void =
//     buildCommitTransactionRequest(transactionId);
//
//   if (rdsDataService && commitTransactionRequest) {
//     const response = await rdsDataService
//       .commitTransaction(commitTransactionRequest)
//       .promise();
//
//     return response;
//   }
// };

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
