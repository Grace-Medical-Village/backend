import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import {
  Con,
  Condition,
  MapPatient,
  Med,
  MedCat,
  Medication,
  MedicationCategory,
  Metric,
  MetricDataIndex,
  MetricFormatDataIndex,
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

      const medication: Medication = {
        id,
        name,
        strength,
        categoryId,
        categoryName,
        archived,
        createdAt,
        modifiedAt,
      };

      return medication;
    });
  },
  buildMedicationCategoryData(records: FieldList[]): MedicationCategory[] {
    return records?.map((med: FieldList) => {
      const id = getFieldValue(med, MedCat.ID) as number;
      const name = getFieldValue(med, MedCat.NAME) as string;
      const createdAt = getFieldValue(med, MedCat.CREATED_AT) as string;
      const modifiedAt = getFieldValue(med, MedCat.MODIFIED_AT) as string;

      const medicationCategory: MedicationCategory = {
        id,
        name,
        createdAt,
        modifiedAt,
      };

      return medicationCategory;
    });
  },
  buildMetricData: (records: FieldList[]): Metric[] => {
    return records?.map((m: FieldList) => {
      const id = getFieldValue(m, MetricDataIndex.ID) as number;
      const metricName = getFieldValue(
        m,
        MetricDataIndex.METRIC_NAME
      ) as string;
      const unitOfMeasure = getFieldValue(
        m,
        MetricDataIndex.UNIT_OF_MEASURE
      ) as string;
      const uom = getFieldValue(m, MetricDataIndex.UOM) as string;
      const map = getFieldValue(m, MetricDataIndex.MAP) as boolean;
      const format = getFieldValue(m, MetricDataIndex.FORMAT) as string;
      const pattern = getFieldValue(m, MetricDataIndex.PATTERN) as string;
      const minValue = getFieldValue(m, MetricDataIndex.MIN_VALUE) as number;
      const maxValue = getFieldValue(m, MetricDataIndex.MAX_VALUE) as number;
      const createdAt = getFieldValue(m, MetricDataIndex.CREATED_AT) as string;
      const modifiedAt = getFieldValue(
        m,
        MetricDataIndex.MODIFIED_AT
      ) as string;

      const metric: Metric = {
        id,
        metricName,
        unitOfMeasure,
        uom,
        map,
        format,
        pattern,
        minValue,
        maxValue,
        createdAt,
        modifiedAt,
      };

      return metric;
    });
  },
  buildMetricFormatData: (records: FieldList[]): Array<Partial<Metric>> => {
    return records?.map((m: FieldList) => {
      const id = getFieldValue(m, MetricFormatDataIndex.ID) as number;
      const pattern = getFieldValue(m, MetricFormatDataIndex.PATTERN) as string;
      const minValue = getFieldValue(
        m,
        MetricFormatDataIndex.MIN_VALUE
      ) as number;
      const maxValue = getFieldValue(
        m,
        MetricFormatDataIndex.MAX_VALUE
      ) as number;

      const metricFormatData: Partial<Metric> = {
        id,
        pattern,
        minValue,
        maxValue,
      };

      return metricFormatData;
    });
  },
};

export { dataBuilder };
