import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import { dataBuilder } from '../data-builder';
import { Condition, Medication, MedicationCategory } from '../../types';

describe('data-builder', () => {
  describe('buildConditionData', () => {
    it('returns an empty list if field list is empty', () => {
      expect.assertions(1);
      const emptyArray: FieldList[] = [];
      const actual = dataBuilder.buildConditionData(emptyArray);
      expect(actual).toStrictEqual([]);
    });

    it('builds a list of conditions', () => {
      expect.assertions(1);
      const conditionList: FieldList[] = [
        [
          {
            longValue: 10,
          },
          {
            stringValue: 'Asthma',
          },
        ],
        [
          {
            longValue: 12,
          },
          {
            stringValue: 'Back Pain',
          },
        ],
        [
          {
            longValue: 15,
          },
          {
            stringValue: 'Diabetes',
          },
        ],
      ];

      const actual = dataBuilder.buildConditionData(conditionList);
      const expected: Condition[] = [
        {
          id: 10,
          conditionName: 'Asthma',
        },
        {
          id: 12,
          conditionName: 'Back Pain',
        },
        {
          id: 15,
          conditionName: 'Diabetes',
        },
      ];
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('buildMedicationData', () => {
    it('returns an empty list if field list is empty', () => {
      expect.assertions(1);
      const emptyArray: FieldList[] = [];
      const actual = dataBuilder.buildMedicationData(emptyArray);
      expect(actual).toStrictEqual([]);
    });

    it('builds a medication list', () => {
      expect.assertions(1);
      const records: FieldList[] = [
        [
          {
            longValue: 1,
          },
          {
            longValue: 5,
          },
          {
            stringValue: 'med',
          },
          {
            stringValue: '1000mg',
          },
          {
            booleanValue: false,
          },
          {
            stringValue: '2021-12-04 15:25:05.806837',
          },
          {
            stringValue: '2021-12-04 15:25:05.806837',
          },
          {
            stringValue: 'TestCategory',
          },
        ],
      ];
      const actual = dataBuilder.buildMedicationData(records);
      const expected: Medication[] = [
        {
          id: 1,
          name: 'med',
          strength: '1000mg',
          categoryId: 5,
          categoryName: 'TestCategory',
          archived: false,
          createdAt: '2021-12-04 15:25:05.806837',
          modifiedAt: '2021-12-04 15:25:05.806837',
        },
      ];
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('buildMedicationCategoryData', () => {
    it('returns an empty list if field list is empty', () => {
      expect.assertions(1);
      const emptyArray: FieldList[] = [];
      const actual = dataBuilder.buildMedicationCategoryData(emptyArray);
      expect(actual).toStrictEqual(emptyArray);
    });

    it('builds medication category data', () => {
      expect.assertions(1);
      const records: FieldList[] = [
        [
          {
            longValue: 1,
          },
          {
            stringValue: 'categoryOne',
          },
          {
            stringValue: '2022-01-04 15:25:05.806837',
          },
          {
            stringValue: '2022-01-04 15:25:05.806837',
          },
        ],
        [
          {
            longValue: 2,
          },
          {
            stringValue: 'categoryTwo',
          },
          {
            stringValue: '2022-01-05 15:25:05.806837',
          },
          {
            stringValue: '2022-01-05 15:25:05.806837',
          },
        ],
      ];

      const actual = dataBuilder.buildMedicationCategoryData(records);

      const expected: MedicationCategory[] = [
        {
          id: 1,
          name: 'categoryOne',
          createdAt: '2022-01-04 15:25:05.806837',
          modifiedAt: '2022-01-04 15:25:05.806837',
        },
        {
          id: 2,
          name: 'categoryTwo',
          createdAt: '2022-01-05 15:25:05.806837',
          modifiedAt: '2022-01-05 15:25:05.806837',
        },
      ];

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('buildPatientConditions', () => {
    it('returns an empty list if field list is empty', () => {
      expect.assertions(1);
      const emptyArray: FieldList[] = [];
      const actual = dataBuilder.buildPatientConditions(emptyArray);
      expect(actual).toStrictEqual([]);
    });
  });

  describe('buildPatientMedications', () => {
    it('returns an empty list if field list is empty', () => {
      expect.assertions(1);
      const emptyArray: FieldList[] = [];
      const actual = dataBuilder.buildPatientMedications(emptyArray);
      expect(actual).toStrictEqual([]);
    });
  });

  describe('buildPatientMetrics', () => {
    it('returns an empty list if field list is empty', () => {
      expect.assertions(1);
      const emptyArray: FieldList[] = [];
      const actual = dataBuilder.buildPatientMetrics(emptyArray);
      expect(actual).toStrictEqual([]);
    });
  });

  describe('buildPatientNotes', () => {
    it('returns an empty list if field list is empty', () => {
      expect.assertions(1);
      const emptyArray: FieldList[] = [];
      const actual = dataBuilder.buildPatientNotes(emptyArray);
      expect(actual).toStrictEqual([]);
    });
  });

  describe('buildPatientsData', () => {
    it('returns an empty list if field list is empty', () => {
      expect.assertions(1);
      const emptyArray: FieldList[] = [];
      const actual = dataBuilder.buildPatientsData(emptyArray);
      expect(actual).toStrictEqual([]);
    });
  });
});
