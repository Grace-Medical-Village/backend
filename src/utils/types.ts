import { APIGatewayProxyEvent } from 'aws-lambda';

// REQUESTS
export type BuildSetStatement = (event: APIGatewayProxyEvent, o: string[]) => string[];

export type BuildValsFromKeys = (keys: string[]) => string[];

export type GetParameter = (event: APIGatewayProxyEvent, key: string) => Value;

export type GetRequestBodyKeys = (event: APIGatewayProxyEvent) => string[];

export type GetRequestBodyValue = (event: APIGatewayProxyEvent, key: string) => Value;

export type GetRequestBodyValues = (event: APIGatewayProxyEvent) => Value[];

export type Value = string | number | boolean | null;

type Values = unknown | string | number | boolean;

export type Query = {
  name: string;
  text: string;
  values?: Values[];
};

// DATABASE RESPONSE
interface GetObject {
  id: number;
  created_at: string;
  modified_at: string;
}

export interface GetPatientResponse extends GetObject {
  first_name: string;
  last_name: string;
  birthdate: string;
  gender: string;
  email: string | null;
  height: string | null;
  map: boolean;
  country: string;
  native_language: string;
  native_literacy: number | null;
  smoker: boolean;
  zip_code_5: string;
}

// CLIENT RESPONSE
// export type Response = {
//   statusCode: number;
//   headers: any;
//   data: any;
//   error: any;
// };
