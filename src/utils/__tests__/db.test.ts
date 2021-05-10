import { getField, getFieldNumber, getFieldString } from '../db';
import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import { T } from '../../types';

describe('getField', () => {
  it('throws if field does not exist', () => {
    expect.assertions(2);
    let fieldList: FieldList = [];
    let index = 0;
    const type = T.NUMBER;

    expect(() => getField(fieldList, index, type)).toThrow(/Error/);

    fieldList = [{ stringValue: '1' }, { isNull: false }, { longValue: 1000 }];
    index = 3;
    expect(() => getField(fieldList, index, type)).toThrow(/Error/);
  });

  it('throws if type does not match Field key', () => {
    expect.assertions(2);
    const fieldList = [
      { stringValue: '1' },
      { isNull: false },
      { longValue: 1000 },
    ];
    let index = 0;
    let type = T.NUMBER;
    expect(() => getField(fieldList, index, type)).toThrow(/Error/);

    index = 2;
    type = T.STRING;
    expect(() => getField(fieldList, index, type)).toThrow(/Error/);
  });

  it('returns value if index and type match', () => {
    expect.assertions(2);
    const fieldList = [
      { stringValue: '1' },
      { isNull: false },
      { longValue: 1000 },
    ];
    let index = 0;
    let type = T.STRING;
    let res = getField(fieldList, index, type);
    expect(res).toStrictEqual('1');

    index = 2;
    type = T.NUMBER;
    res = getField(fieldList, index, type);
    expect(res).toStrictEqual(1000);
  });
});

describe('getFieldString', () => {
  it('returns a stringValue', () => {
    expect.assertions(2);
    const fieldList = [
      { stringValue: '1' },
      { longValue: 1000 },
      { stringValue: 'TEST' },
    ];
    let index = 0;
    let res = getFieldString(fieldList, index);
    expect(res).toStrictEqual('1');
    index = 2;
    res = getFieldString(fieldList, index);
    expect(res).toStrictEqual('TEST');
  });
});

describe('getFieldNumber', () => {
  it('returns a longValue', () => {
    expect.assertions(2);
    const fieldList = [
      { stringValue: '1' },
      { longValue: 1000 },
      { stringValue: 'TEST' },
      { longValue: -1 },
    ];
    let index = 1;
    let res = getFieldNumber(fieldList, index);
    expect(res).toStrictEqual(1000);
    index = 3;
    res = getFieldNumber(fieldList, index);
    expect(res).toStrictEqual(-1);
  });
});
