import {
  ExecuteStatementRequest,
  ExecuteStatementResponse,
  FieldList,
  SqlParametersList,
} from 'aws-sdk/clients/rdsdataservice';
import { RDSDataService } from 'aws-sdk';

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
  archived: boolean;
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
  format?: string;
  pattern?: string;
  minValue?: number;
  maxValue?: number;
  archived?: boolean;
  createdAt: string;
  modifiedAt: string;
};

export enum DATA_API_TYPES {
  IS_NULL = 'isNull',
  NUMBER = 'longValue',
}

export type MapPatient = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  birthdate?: string;
  createdAt: string;
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
  country: string;
  nativeLanguage?: string;
  nativeLiteracy?: string;
  smoker: boolean;
  zipCode5?: string;
};

export type AnalyticsCount = {
  count: number;
};

export type PatientListRecord = {
  id: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  birthdate: string;
  gender: string;
};

export type PatientAllergies = {
  id: number;
  allergies: string;
  patientId: number;
  createdAt: string;
  modifiedAt: string;
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
  comment: string | null;
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
  ARCHIVED,
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
export enum MetricDataIndex {
  ID,
  METRIC_NAME,
  UNIT_OF_MEASURE,
  UOM,
  MAP,
  MIN_VALUE,
  MAX_VALUE,
  FORMAT,
  PATTERN,
  CREATED_AT,
  MODIFIED_AT,
  ARCHIVED,
}

export enum MetricFormatDataIndex {
  ID,
  PATTERN,
  MIN_VALUE,
  MAX_VALUE,
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
  ZIP_CODE,
  ARCHIVED,
  CREATED_AT,
  MODIFIED_AT,
}

export type MetricFormat = {
  id: number;
  minValue?: number | null;
  maxValue?: number | null;
  pattern?: string | null;
};

export type ValidMetric = {
  isValid: boolean;
  metric?: string;
  error?: string;
};

export type CreateMedicationRequestBody = {
  categoryId: number;
  name: string;
  strength?: string;
};

export type ExecuteStatement = (
  sql: string,
  transactionId?: string | null
) => Promise<FieldList[]>;

export type ExecuteStatementRefactor = (
  sql: string,
  transactionId?: string | null
) => Promise<unknown[]>;

export type BuildData = (response: ExecuteStatementResponse) => unknown[];

export interface UnknownObject {
  [key: string]: string | number | boolean | null;
}

export type DB = {
  beginTransaction: () => void;
  buildData: BuildData;
  commitTransaction: () => void;
  executeStatement: ExecuteStatement;
  executeStatementRefactor: ExecuteStatementRefactor;
};

// type BeginTransaction = () => Promise<Id | null>;

// type CommitTransaction = (
//   transactionId: string
// ) => Promise<CommitTransactionResponse | void>;

export type GetFieldValue = (
  fieldList: FieldList,
  index: number
) => string | number | boolean | null;

export type GetRdsDataService = () => RDSDataService | void;

interface Overrides {
  parameters?: SqlParametersList | undefined;
}

export type GetRdsParams = (
  sql: string,
  transactionId: string | null,
  overrides: Overrides
) => ExecuteStatementRequest | void;
