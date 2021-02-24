import { APIGatewayProxyEvent } from 'aws-lambda';

// REQUESTS
export type BuildSetStatement = (event: APIGatewayProxyEvent, o: string[]) => string[];
export type BuildValsFromKeys = (keys: string[]) => string[];
export type GetParameter = (event: APIGatewayProxyEvent, key: string, required: boolean) => Value;
export type GetRequestBodyKeys = (event: APIGatewayProxyEvent) => string[];
export type GetRequestBodyValue = (event: APIGatewayProxyEvent, key: string) => Value;
// export type GetRequestBodyString = (event: APIGatewayProxyEvent, key: string, required: boolean) => string;
// export type GetRequestBodyString = (event: APIGatewayProxyEvent, key: string, required: boolean) => number;
export type GetRequestBodyValues = (event: APIGatewayProxyEvent) => Value[];
export type Value = string | number | boolean | null;
type Values = unknown | string | number | boolean;

export type Query = {
  name: string;
  text: string;
  values?: Values[];
};

export type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  birthdate?: string;
  gender?: string;
  email?: string;
  height?: string;
  mobile?: string;
  map: boolean;
  country?: string;
  nativeLanguage?: string;
  nativeLiteracy?: string;
  smoker: boolean;
};

export type PatientCondition = {
  id: number;
  condition_id: number;
  patient_id: number;
  created_at: string;
  modified_at: string;
};

export type PatientMedication = {
  id: number;
  medication_id: number;
  patient_id: number;
  created_at: string;
  modified_at: string;
};

export type PatientMetric = {
  id: number;
  metric_id: number;
  patient_id: number;
  value: string;
  created_at: string;
  modified_at: string;
};

export type PatientNote = {
  id: number;
  note: string;
  patient_id: number;
  created_at: string;
  modified_at: string;
};

export type PatientData = {
  conditions?: PatientCondition[];
  medications?: PatientMedication[];
  metrics?: PatientMetric[];
  notes?: PatientNote[];
  patient?: Patient;
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

// RESPONSE
export type Headers = {
  [key: string]: string | boolean;
};

type ResponseHeaders = {
  headers: Headers;
};

export type ResponseStatus = {
  statusCode: number;
  statusText: string;
};

export type ResponseError = {
  error?: {
    code: number;
    message: string;
  };
};

export type ResponseBody = {
  data: any; // todo
};

export interface Response extends ResponseHeaders, ResponseStatus {
  body: string;
}

// GET

// POST

// PUT

// DELETE
export interface DeleteResponseBody extends ResponseError {
  data: Record<string, never>;
}

// UTILITY
export type BuildValues = <T>(values: Array<T>) => string;
