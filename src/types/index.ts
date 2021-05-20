import { APIGatewayProxyEvent } from 'aws-lambda';

// REQUESTS
export type BuildSetStatement = (
  event: APIGatewayProxyEvent,
  o: string[]
) => string[];
export type BuildValsFromKeys = (keys: string[]) => string[];
export type GetParameter = (
  event: APIGatewayProxyEvent,
  key: string,
  required: boolean
) => Value;
export type GetRequestBodyKeys = (event: APIGatewayProxyEvent) => string[];
export type GetRequestBodyValue = (
  event: APIGatewayProxyEvent,
  key: string
) => Value;
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

export type Condition = {
  id: number;
  conditionName: string;
};

export type Medication = {
  id: number;
  name: string;
  strength: string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  modifiedAt: string;
};

export type MedicationCategory = {
  id: number;
  name: string;
  createdAt: string;
  modifiedAt: string;
};

export type Metric = {
  id: number;
  metricName: string;
  unitOfMeasure: string;
  uom: string;
  map: boolean;
  defaultValue: number | null;
  minValue: number | null;
  maxValue: number | null;
  createdAt: string;
  modifiedAt: string;
};

export enum T {
  IS_NULL = 'isNull',
  BOOLEAN = 'booleanValue',
  NUMBER = 'longValue',
  STRING = 'stringValue',
}

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

export type PatientListRecord = {
  id: number;
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
};

export type PatientCondition = {
  id: number;
  conditionId: number;
  patientId: number;
  createdAt: string;
  modifiedAt: string;
};

export type PatientMedication = {
  id: number;
  medicationId: number;
  patientId: number;
  createdAt: string;
  modifiedAt: string;
};

export type PatientMetric = {
  id: number;
  metricId: number;
  patientId: number;
  value: string;
  createdAt: string;
  modifiedAt: string;
};

export type PatientNote = {
  id: number;
  note: string;
  patientId: number;
  createdAt: string;
  modifiedAt: string;
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

export type ResponseData = Medication[];
// export type ResponseBody = {
// data: any; // todo
// };

export interface Response extends ResponseHeaders, ResponseStatus {
  body: string;
}

// GET
export type GetMedicationResponse = {
  data: Medication;
};

// POST

// PUT

// DELETE
export interface DeleteResponseBody extends ResponseError {
  data: Record<string, never>;
}

// UTILITY
export type BuildValues = <T>(values: Array<T>) => string;

// TEST
export type EnvironmentTestObject = {
  environment: string;
  false: Array<string | null | undefined>;
  function: () => boolean;
  true: string[];
  name: string;
};

// DATA API INDEXES
// Medication
export enum Med {
  ID,
  CATEGORY_ID,
  NAME,
  STRENGTH,
  CREATED_AT,
  MODIFIED_AT,
  CATEGORY_NAME,
}

// Medication Category
export enum MedCat {
  ID,
  NAME,
  CREATED_AT,
  MODIFIED_AT,
}

// Metric
export enum Met {
  ID,
  METRIC_NAME,
  UNIT_OF_MEASURE,
  UOM,
  MAP,
  DEFAULT_VALUE,
  MIN_VALUE,
  MAX_VALUE,
  CREATED_AT,
  MODIFIED_AT,
}

// Condition
export enum Con {
  ID,
  CONDITION_NAME,
}

// Patient
export enum Pat {
  ID,
  FIRST_NAME,
  LAST_NAME,
  BIRTHDATE,
  GENDER,
  EMAIL,
  HEIGHT,
  MOBILE,
  MAP,
  COUNTRY,
  NATIVE_LANGUAGE,
  NATIVE_LITERACY,
  SMOKER,
}

// Patient Conditions
export enum PC {
  ID,
  CONDITION_ID,
  PATIENT_ID,
  CREATED_AT,
  MODIFIED_AT,
  // CONDITION_NAME,
}

// Patient Medications
export enum PMed {
  ID,
  MEDICATION_ID,
  PATIENT_ID,
  CREATED_AT,
  MODIFIED_AT,
}

// Patient Medications
export enum PMet {
  ID,
  PATIENT_ID,
  METRIC_ID,
  VALUE,
  CREATED_AT,
  MODIFIED_AT,
}

// Patient Notes
export enum PNote {
  ID,
  NOTE,
  PATIENT_ID,
  CREATED_AT,
  MODIFIED_AT,
}

// Patients
export enum Pats {
  ID,
  FIRST_NAME,
  LAST_NAME,
  BIRTHDATE,
  GENDER,
}
