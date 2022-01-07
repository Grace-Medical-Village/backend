import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import { dataBuilder } from '../data-builder';
import { Medication, MedicationCategory } from '../../types';

describe('data-builder', () => {
  // TODO - buildConditionData
  // TODO - buildMetricData
  // TODO - buildMetricFormatData
  describe('buildMedicationData', () => {
    it('returns an empty list if field list is empty', () => {
      expect.assertions(1);
      const emptyArray: FieldList[] = [];
      const actual = dataBuilder.buildMedicationData(emptyArray);
      expect(actual).toStrictEqual(emptyArray);
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
});
