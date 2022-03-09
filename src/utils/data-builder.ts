import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import {
  Con,
  Condition,
  MapPatient,
  Med,
  MedCat,
  Medication,
  MedicationCategory,
  Pat,
  Patient,
  PatientAllergies,
  PatientCondition,
  PatientListRecord,
  PatientMedication,
  PatientMetric,
  PatientNote,
} from '../types';
import { getFieldValue } from './db';

const dataBuilder = {
  buildConditionData: (records: FieldList[]): Condition[] => {
    return records?.map((c: FieldList) => {
      const id = getFieldValue(c, Con.ID) as number;
      const conditionName = getFieldValue(c, Con.CONDITION_NAME) as string;

      const condition: Condition = {
        id,
        conditionName,
      };

      return condition;
    });
  },
  buildCount: (records: FieldList[]): number => {
    let patientCount = 0;
    if (records.length === 1) {
      const count = getFieldValue(records[0], 0);
      if (count && typeof count === 'number' && count > 0) {
        patientCount = count;
      }
    }
    return patientCount;
  },
  buildMapPatientsData: (records: FieldList[]): MapPatient[] => {
    return records.map((rec) => {
      const id = getFieldValue(rec, 0) as number;
      const firstName = getFieldValue(rec, 1) as string;
      const lastName = getFieldValue(rec, 2) as string;
      const birthdate = getFieldValue(rec, 3) as string;
      const createdAt = getFieldValue(rec, 4) as string;

      return {
        id,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        birthdate,
        createdAt,
      };
    });
  },
  buildMedicationData: (records: FieldList[]): Medication[] => {
    return records?.map((med: FieldList) => {
      const id = getFieldValue(med, Med.ID) as number;
      const name = getFieldValue(med, Med.NAME) as string;
      const strength = getFieldValue(med, Med.STRENGTH) as string;
      const categoryId = getFieldValue(med, Med.CATEGORY_ID) as number;
      const categoryName = getFieldValue(med, Med.CATEGORY_NAME) as string;
      const archived = getFieldValue(med, Med.ARCHIVED) as boolean;
      const createdAt = getFieldValue(med, Med.CREATED_AT) as string;
      const modifiedAt = getFieldValue(med, Med.MODIFIED_AT) as string;

      const result: Medication = {
        id,
        name,
        strength,
        categoryId,
        categoryName,
        archived,
        createdAt,
        modifiedAt,
      };

      return result;
    });
  },
  buildMedicationCategoryData(records: FieldList[]): MedicationCategory[] {
    return records?.map((med: FieldList) => {
      const id = getFieldValue(med, MedCat.ID) as number;
      const name = getFieldValue(med, MedCat.NAME) as string;
      const createdAt = getFieldValue(med, MedCat.CREATED_AT) as string;
      const modifiedAt = getFieldValue(med, MedCat.MODIFIED_AT) as string;

      const result: MedicationCategory = {
        id,
        name,
        createdAt,
        modifiedAt,
      };

      return result;
    });
  },
  buildPatientAllergies: (record: FieldList): PatientAllergies => {
    const id = getFieldValue(record, 0) as number;
    const patientId = getFieldValue(record, 1) as number;
    const allergies = getFieldValue(record, 2) as string;
    const createdAt = getFieldValue(record, 3) as string;
    const modifiedAt = getFieldValue(record, 4) as string;

    return {
      id,
      allergies,
      patientId,
      createdAt,
      modifiedAt,
    };
  },
  buildPatientConditions: (
    records: FieldList[]
  ): ArrayLike<PatientCondition> => {
    return records?.map((pc: FieldList) => {
      const id = getFieldValue(pc, 0) as number;
      const conditionId = getFieldValue(pc, 1) as number;
      const patientId = getFieldValue(pc, 2) as number;
      const createdAt = getFieldValue(pc, 3) as string;
      const modifiedAt = getFieldValue(pc, 4) as string;

      const patientCondition: PatientCondition = {
        id,
        conditionId,
        patientId,
        createdAt,
        modifiedAt,
      };
      return patientCondition;
    });
  },
  buildPatientMedications: (
    records: FieldList[]
  ): ArrayLike<PatientMedication> => {
    return records?.map((pm: FieldList) => {
      const id = getFieldValue(pm, 0) as number;
      const patientId = getFieldValue(pm, 1) as number;
      const medicationId = getFieldValue(pm, 2) as number;
      const createdAt = getFieldValue(pm, 3) as string;
      const modifiedAt = getFieldValue(pm, 4) as string;

      const patientMedication: PatientMedication = {
        id,
        patientId,
        medicationId,
        createdAt,
        modifiedAt,
      };
      return patientMedication;
    });
  },
  buildPatientMetrics: (records: FieldList[]): ArrayLike<PatientMetric> => {
    return records?.map((pm: FieldList) => {
      const id = getFieldValue(pm, 0) as number;
      const patientId = getFieldValue(pm, 1) as number;
      const metricId = getFieldValue(pm, 2) as number;
      const value = getFieldValue(pm, 3) as string;
      const comment = getFieldValue(pm, 4) as string | null;
      const createdAt = getFieldValue(pm, 5) as string;
      const modifiedAt = getFieldValue(pm, 6) as string;

      const patientMetric: PatientMetric = {
        id,
        metricId,
        patientId,
        value,
        comment,
        createdAt,
        modifiedAt,
      };
      return patientMetric;
    });
  },
  buildPatientNotes: (records: FieldList[]): ArrayLike<PatientNote> => {
    return records?.map((pm: FieldList) => {
      const id = getFieldValue(pm, 0) as number;
      const note = getFieldValue(pm, 1) as string;
      const patientId = getFieldValue(pm, 2) as number;
      const createdAt = getFieldValue(pm, 3) as string;
      const modifiedAt = getFieldValue(pm, 4) as string;

      const patientNote: PatientNote = {
        id,
        note,
        patientId,
        createdAt,
        modifiedAt,
      };
      return patientNote;
    });
  },
  buildPatientData: (p: FieldList): Patient => {
    const id = getFieldValue(p, Pat.ID) as number;
    const firstName = getFieldValue(p, Pat.FIRST_NAME) as string;
    const lastName = getFieldValue(p, Pat.LAST_NAME) as string;
    const birthdate = getFieldValue(p, Pat.BIRTHDATE) as string;
    const gender = getFieldValue(p, Pat.GENDER) as string;
    const email = getFieldValue(p, Pat.EMAIL) as string;
    const height = getFieldValue(p, Pat.HEIGHT) as string;
    const mobile = getFieldValue(p, Pat.MOBILE) as string;
    const country = getFieldValue(p, Pat.COUNTRY) as string;
    const nativeLanguage = getFieldValue(p, Pat.NATIVE_LANGUAGE) as string;
    const nativeLiteracy = getFieldValue(p, Pat.NATIVE_LITERACY) as string;
    const smoker = getFieldValue(p, Pat.SMOKER) as boolean;
    const zipCode5 = getFieldValue(p, Pat.ZIP_CODE) as string;

    return {
      id,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      birthdate,
      gender,
      email,
      height,
      mobile,
      country,
      nativeLanguage,
      nativeLiteracy,
      smoker,
      zipCode5,
    };
  },
  buildPatientsData: (records: FieldList[]): ArrayLike<PatientListRecord> => {
    return records?.map((p: FieldList) => {
      const id = getFieldValue(p, 0) as number;
      const firstName = getFieldValue(p, 1) as string;
      const lastName = getFieldValue(p, 2) as string;
      const fullName = getFieldValue(p, 3) as string;
      const birthdate = getFieldValue(p, 4) as string;
      const gender = getFieldValue(p, 5) as string;

      const patientListRecord: PatientListRecord = {
        id,
        firstName,
        lastName,
        fullName,
        birthdate,
        gender,
      };

      return patientListRecord;
    });
  },
};

export { dataBuilder };
