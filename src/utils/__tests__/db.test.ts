import { Field } from 'aws-sdk/clients/rdsdataservice';
import { getFieldValue, getRdsDataService, sqlParen } from '../db';
import { RDSDataService } from 'aws-sdk';

describe('db', () => {
  describe('sqlParen test', () => {
    it('surrounds a string with apostrophes', () => {
      expect.assertions(2);
      let actual = sqlParen('abc');
      let expected = "'abc'";
      expect(actual).toStrictEqual(expected);

      actual = sqlParen("'abc'");
      expected = "''abc''";
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('getFieldValue', () => {
    it('returns a number', () => {
      expect.assertions(1);
      const fieldList: Field[] = [
        { longValue: 7000 },
        {
          stringValue: 'TestName',
        },
        {
          booleanValue: false,
        },
        {
          isNull: true,
        },
      ];
      const index = 0;
      const actual = getFieldValue(fieldList, index);
      const expected = 7000;
      expect(actual).toStrictEqual(expected);
    });

    it('returns a string', () => {
      expect.assertions(1);
      const fieldList: Field[] = [
        { longValue: 7000 },
        {
          stringValue: 'TestName',
        },
        {
          booleanValue: false,
        },
        {
          isNull: true,
        },
      ];
      const index = 1;
      const actual = getFieldValue(fieldList, index);
      const expected = 'TestName';
      expect(actual).toStrictEqual(expected);
    });

    it('returns a boolean', () => {
      expect.assertions(1);
      const fieldList: Field[] = [
        { longValue: 7000 },
        {
          stringValue: 'TestName',
        },
        {
          booleanValue: false,
        },
        {
          isNull: true,
        },
      ];
      const index = 2;
      const actual = getFieldValue(fieldList, index);
      const expected = false;
      expect(actual).toStrictEqual(expected);
    });

    it('returns a null value', () => {
      expect.assertions(1);
      const fieldList: Field[] = [
        { longValue: 7000 },
        {
          stringValue: 'TestName',
        },
        {
          booleanValue: false,
        },
        {
          isNull: true,
        },
      ];
      const index = 3;
      const actual = getFieldValue(fieldList, index);
      expect(actual).toBeNull();
    });

    it('returns null if the index is out of range', () => {
      expect.assertions(1);
      const fieldList: Field[] = [];
      const index = 0;
      const actual = getFieldValue(fieldList, index);
      expect(actual).toBeNull();
    });
  });

  describe('getRdsDataService', () => {
    it('builds the service', () => {
      expect.assertions(1);
      const actual = getRdsDataService();
      expect(actual).toBeInstanceOf(RDSDataService);
    });

    it('builds the service with a custom endpoint', () => {
      expect.assertions(1);
      const actual = getRdsDataService()?.endpoint?.port ?? -1;
      expect(actual).toStrictEqual(8080);
    });
  });
});
