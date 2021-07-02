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
  defaultValue: number | null;
  minValue: number | null;
  maxValue: number | null;
  mask: string | null;
  createdAt: string;
  modifiedAt: string;
};

export enum DATA_API_TYPES {
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
  zipCode5?: string;
};

export type PatientListRecord = {
  id: number;
  firstName: string;
  lastName: string;
  fullName?: string;
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
export enum Met {
  ID,
  METRIC_NAME,
  UNIT_OF_MEASURE,
  UOM,
  MAP,
  DEFAULT_VALUE,
  MIN_VALUE,
  MAX_VALUE,
  MASK,
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
  ZIP_CODE,
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
  PATIENT_ID,
  MEDICATION_ID,
  CREATED_AT,
  MODIFIED_AT,
}

// Patient Medications
export enum PMet {
  ID,
  PATIENT_ID,
  METRIC_ID,
  VALUE,
  COMMENT,
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
  FULL_NAME,
  BIRTHDATE,
  GENDER,
}
