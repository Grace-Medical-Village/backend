import {
  ExecuteStatementResponse,
  Field,
  FieldList,
  Metadata,
  SqlRecords,
} from 'aws-sdk/clients/rdsdataservice';
import { db, getFieldValue, getRdsDataService, sqlParen } from '../db';
import { RDSDataService } from 'aws-sdk';
import { UnknownObject } from '../../types';

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

  describe('buildData', () => {
    it('returns an empty array if no records are found', () => {
      expect.assertions(1);
      const response: ExecuteStatementResponse = {
        columnMetadata: [],
        records: [],
      };
      const expected: FieldList[] = [];
      const actual = db.buildData(response);
      expect(actual).toStrictEqual(expected);
    });

    it('returns an single record from the database', () => {
      expect.assertions(1);
      const columnMetadata: Metadata = [
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: true,
          isCaseSensitive: false,
          isCurrency: false,
          isSigned: true,
          label: 'id',
          name: 'id',
          nullable: 0,
          precision: 10,
          scale: 0,
          schemaName: '',
          tableName: 'medication',
          type: 4,
          typeName: 'serial',
        },
      ];

      const records: SqlRecords = [
        [
          {
            longValue: 1,
          },
        ],
      ];

      const response: ExecuteStatementResponse = {
        columnMetadata,
        numberOfRecordsUpdated: 0,
        records,
      };

      const expected: UnknownObject[] = [
        {
          id: 1,
        },
      ];
      const actual = db.buildData(response);
      expect(actual).toStrictEqual(expected);
    });

    it('returns object with multiple items from the database', () => {
      expect.assertions(1);
      const columnMetadata: Metadata = [
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: true,
          isCaseSensitive: false,
          isCurrency: false,
          isSigned: true,
          label: 'id',
          name: 'id',
          nullable: 0,
          precision: 10,
          scale: 0,
          schemaName: '',
          tableName: 'medication',
          type: 4,
          typeName: 'serial',
        },
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: true,
          isCaseSensitive: false,
          isCurrency: false,
          isSigned: true,
          label: 'category_id',
          name: 'category_id',
          nullable: 0,
          precision: 10,
          scale: 0,
          schemaName: '',
          tableName: 'medication',
          type: 4,
          typeName: 'serial',
        },
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: false,
          isCaseSensitive: true,
          isCurrency: false,
          isSigned: false,
          label: 'name',
          name: 'name',
          nullable: 0,
          precision: 255,
          scale: 0,
          schemaName: '',
          tableName: 'medication',
          type: 12,
          typeName: 'varchar',
        },
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: false,
          isCaseSensitive: true,
          isCurrency: false,
          isSigned: false,
          label: 'strength',
          name: 'strength',
          nullable: 1,
          precision: 50,
          scale: 0,
          schemaName: '',
          tableName: 'medication',
          type: 12,
          typeName: 'varchar',
        },
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: false,
          isCaseSensitive: false,
          isCurrency: false,
          isSigned: false,
          label: 'archived',
          name: 'archived',
          nullable: 0,
          precision: 1,
          scale: 0,
          schemaName: '',
          tableName: 'medication',
          type: -7,
          typeName: 'bool',
        },
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: false,
          isCaseSensitive: false,
          isCurrency: false,
          isSigned: false,
          label: 'created_at',
          name: 'created_at',
          nullable: 0,
          precision: 29,
          scale: 6,
          schemaName: '',
          tableName: 'medication',
          type: 93,
          typeName: 'timestamp',
        },
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: false,
          isCaseSensitive: false,
          isCurrency: false,
          isSigned: false,
          label: 'modified_at',
          name: 'modified_at',
          nullable: 0,
          precision: 29,
          scale: 6,
          schemaName: '',
          tableName: 'medication',
          type: 93,
          typeName: 'timestamp',
        },
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: false,
          isCaseSensitive: true,
          isCurrency: false,
          isSigned: false,
          label: 'category_name',
          name: 'category_name',
          nullable: 0,
          precision: 255,
          scale: 0,
          schemaName: '',
          tableName: 'medication_category',
          type: 12,
          typeName: 'varchar',
        },
      ];

      const records: SqlRecords = [
        [
          {
            longValue: 1,
          },
          {
            longValue: 20,
          },
          {
            stringValue: 'Acetaminophen',
          },
          {
            stringValue: '500 mg',
          },
          {
            booleanValue: false,
          },
          {
            stringValue: '2022-02-27 14:38:49.354051',
          },
          {
            stringValue: '2022-02-28 14:38:49.354051',
          },
          {
            stringValue: 'Pain',
          },
        ],
      ];

      const response: ExecuteStatementResponse = {
        columnMetadata,
        numberOfRecordsUpdated: 0,
        records,
      };

      const expected: UnknownObject[] = [
        {
          id: 1,
          categoryId: 20,
          categoryName: 'Pain',
          name: 'Acetaminophen',
          strength: '500 mg',
          archived: false,
          createdAt: '2022-02-27 14:38:49.354051',
          modifiedAt: '2022-02-28 14:38:49.354051',
        },
      ];
      const actual = db.buildData(response);
      expect(actual).toStrictEqual(expected);
    });

    it('returns multiple objects from the database', () => {
      expect.assertions(1);
      const columnMetadata: Metadata = [
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: true,
          isCaseSensitive: false,
          isCurrency: false,
          isSigned: true,
          label: 'id',
          name: 'id',
          nullable: 0,
          precision: 10,
          scale: 0,
          schemaName: '',
          tableName: 'metric',
          type: 4,
          typeName: 'serial',
        },
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: false,
          isCaseSensitive: true,
          isCurrency: false,
          isSigned: false,
          label: 'metric_name',
          name: 'metric_name',
          nullable: 0,
          precision: 50,
          scale: 0,
          schemaName: '',
          tableName: 'metric',
          type: 12,
          typeName: 'varchar',
        },
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: false,
          isCaseSensitive: false,
          isCurrency: false,
          isSigned: false,
          label: 'map',
          name: 'map',
          nullable: 0,
          precision: 1,
          scale: 0,
          schemaName: '',
          tableName: 'metric',
          type: -7,
          typeName: 'bool',
        },
        // 'value' below isn't 100% accurate as we aren't currently utilizing double
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: false,
          isCaseSensitive: false,
          isCurrency: false,
          isSigned: true,
          label: 'value',
          name: 'value',
          nullable: 1,
          precision: 5,
          scale: 0,
          schemaName: '',
          tableName: 'metric',
          type: 5,
          typeName: 'double',
        },
        {
          arrayBaseColumnType: 0,
          isAutoIncrement: false,
          isCaseSensitive: false,
          isCurrency: false,
          isSigned: false,
          label: 'archived',
          name: 'archived',
          nullable: 0,
          precision: 1,
          scale: 0,
          schemaName: '',
          tableName: 'metric',
          type: -7,
          typeName: 'bool',
        },
      ];

      const records: SqlRecords = [
        [
          {
            longValue: 100,
          },
          {
            stringValue: 'temperature',
          },
          {
            booleanValue: false,
          },
          {
            doubleValue: 98.6,
          },
          {
            isNull: true,
          },
        ],
        [
          {
            longValue: 101,
          },
          {
            stringValue: 'weight',
          },
          {
            booleanValue: true,
          },
          {
            doubleValue: 200.0,
          },
          {
            booleanValue: false,
          },
        ],
      ];

      const response: ExecuteStatementResponse = {
        columnMetadata,
        numberOfRecordsUpdated: 0,
        records,
      };

      const expected: UnknownObject[] = [
        {
          id: 100,
          metricName: 'temperature',
          map: false,
          value: 98.6,
          archived: null,
        },
        {
          id: 101,
          metricName: 'weight',
          map: true,
          value: 200.0,
          archived: false,
        },
      ];

      const actual = db.buildData(response);
      expect(actual).toStrictEqual(expected);
    });
  });
});
