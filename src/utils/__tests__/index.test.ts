import {
  dateToDayId,
  indexOutOfBounds,
  isBloodPressureMetric,
  isIntegerGreaterThanZero,
  isLocal,
  isNumber,
  isProduction,
  isTest,
  oneYearAgo,
  regexTest,
  toIso8601,
  tomorrow,
  validatePattern,
} from '../index';
import { EnvironmentTestObject, MetricFormat, ValidMetric } from '../../types';

const environmentTests: EnvironmentTestObject[] = [
  {
    environment: 'local',
    false: [undefined, null, '', 'test', 'dev', 'production'],
    function: isLocal,
    true: ['local'],
    name: 'isLocal',
  },
  {
    environment: 'production',
    false: [undefined, null, '', 'test', 'dev', 'local'],
    function: isProduction,
    true: ['production'],
    name: 'isProduction',
  },
  {
    environment: 'test',
    false: [undefined, null, '', 'local', 'dev', 'production'],
    function: isTest,
    true: ['test'],
    name: 'isTest',
  },
];

describe('utils', () => {
  describe('indexOutOfBounds', () => {
    const list = [false, 1, '4'];
    it('returns false if index is in bounds', () => {
      expect.assertions(3);
      expect(indexOutOfBounds(0, list)).toStrictEqual(false);
      expect(indexOutOfBounds(1, list)).toStrictEqual(false);
      expect(indexOutOfBounds(2, list)).toStrictEqual(false);
    });

    it('returns true if index is out of bounds', () => {
      expect.assertions(3);
      expect(indexOutOfBounds(-1, list)).toStrictEqual(true);
      expect(indexOutOfBounds(3, list)).toStrictEqual(true);
      expect(indexOutOfBounds(100, list)).toStrictEqual(true);
    });
  });

  describe('environment tests', () => {
    environmentTests.map((obj) => {
      describe(`${obj.name}`, () => {
        it(`returns true for ${obj.environment} environment`, () => {
          expect.hasAssertions();
          expect.assertions(obj.true.length);

          obj.true.forEach((t) => {
            process.env.NODE_ENV = t;
            expect(obj.function()).toStrictEqual(true);
          });
        });

        it(`returns false for non-${obj.environment}`, () => {
          expect.hasAssertions();
          expect.assertions(obj.false.length);
          process.env.NODE_ENV = obj.environment;

          obj.false.forEach((f) => {
            process.env.NODE_ENV = String(f);
            expect(obj.function()).toStrictEqual(false);
          });
        });
      });
    });
  });

  describe('isIntegerGreaterThanZero', () => {
    it('returns false for a decimal', () => {
      expect.assertions(3);

      let input = '3.14';
      let actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(false);

      input = '1.0';
      actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(false);

      input = '1.1';
      actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(false);
    });

    it('returns false for a char', () => {
      expect.assertions(2);

      let input = 'a';
      let actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(false);

      input = 'X';
      actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(false);
    });

    it('returns false for a string', () => {
      expect.assertions(2);

      let input = '100abc7';
      let actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(false);

      input = 'Once upon a time 007';
      actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(false);
    });

    it('returns false for zero', () => {
      expect.assertions(1);
      const input = '0';
      const actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(false);
    });

    it('returns false for a negative number', () => {
      expect.assertions(3);
      let input = '-1';
      let actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(false);

      input = '-1000';
      actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(false);

      input = '-7.1';
      actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(false);
    });

    it('returns true for integers greater than zero', () => {
      expect.assertions(3);
      let input = '1';
      let actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(true);

      input = '1000';
      actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(true);

      input = Number.MAX_SAFE_INTEGER.toString();
      actual = isIntegerGreaterThanZero(input);
      expect(actual).toStrictEqual(true);
    });
  });

  describe('toIso8601', () => {
    it('builds an ISO-8601 date', () => {
      expect.assertions(2);

      const actual = toIso8601(new Date());

      expect(actual).toHaveLength(10);
      expect(actual).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
    });
  });

  describe('isNumber', () => {
    it('returns false for non-numeric values', () => {
      expect.assertions(4);
      expect(isNumber('test')).toStrictEqual(false);
      expect(isNumber('false')).toStrictEqual(false);
      expect(isNumber('true')).toStrictEqual(false);
      expect(isNumber('NaN')).toStrictEqual(false);
    });

    it('returns true for numeric values', () => {
      expect.assertions(4);
      expect(isNumber('1000')).toStrictEqual(true);
      expect(isNumber(Number.MAX_VALUE.toString())).toStrictEqual(true);
      expect(isNumber(Number.MIN_VALUE.toString())).toStrictEqual(true);
      expect(isNumber('3.1450139')).toStrictEqual(true);
    });
  });

  describe('tomorrow', () => {
    it('returns the date for tomorrow', () => {
      expect.assertions(1);
      const dayIdToday = dateToDayId(new Date());
      const dayIdTomorrow = dateToDayId(tomorrow());

      const result = dayIdTomorrow - dayIdToday;
      const expected = 1;

      expect(result).toStrictEqual(expected);
    });
  });

  describe('oneYearAgo', () => {
    it('returns the date of one year ago', () => {
      expect.assertions(1);
      const dayIdToday = dateToDayId(new Date());
      const dayIdYearAgo = dateToDayId(oneYearAgo());

      const result = dayIdToday - dayIdYearAgo;
      const expected = 10000;

      expect(result).toStrictEqual(expected);
    });
  });

  describe('buildCachedMetrics', () => {
    it('finds cached metrics', () => {
      expect.assertions(0);
    });
  });

  describe('getMetricFormat', () => {
    it.todo;
  });

  describe('isBloodPressureMetric', () => {
    it('returns false if metric pattern is missing', () => {
      expect.assertions(1);
      const value = '';
      const metricFormat: MetricFormat = {
        id: 0,
      };
      const actual = isBloodPressureMetric(value, metricFormat);
      expect(actual).toStrictEqual(false);
    });

    it('returns true if metric pattern is provided and has paren', () => {
      expect.assertions(1);
      const value = '120/80';
      const metricFormat: MetricFormat = {
        id: 0,
        pattern: '/',
      };
      const actual = isBloodPressureMetric(value, metricFormat);
      expect(actual).toStrictEqual(false);
    });
  });

  describe('regexTest', () => {
    it('returns false if a pattern is not provided', () => {
      expect.assertions(1);
      const actual = regexTest(null, '');
      expect(actual).toStrictEqual(false);
    });

    it('returns true if a pattern is matched', () => {
      expect.assertions(1);
      const actual = regexTest(
        '^([1-9]|[1-9]\\d+)/([1-9]|[1-9]\\d+)$',
        '120/80'
      );
      expect(actual).toStrictEqual(true);
    });
  });

  describe('validatePattern', () => {
    it('will mark a metric as valid', () => {
      expect.assertions(1);
      const value = '60';
      const validMetric: ValidMetric = {
        isValid: true,
        metric: '',
        error: '',
      };
      const metricFormat: MetricFormat = {
        id: 1,
        minValue: 10,
        maxValue: 1000,
        pattern: '[0-9]+',
      };
      const actual = validatePattern(value, metricFormat, validMetric);
      const expected: ValidMetric = {
        isValid: true,
        metric: '',
        error: '',
      };
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('validateMinimum', () => {
    // if the pattern is ISO_8601
    //   - if the date value < minimumDate
    // else if -> it's a blood pressure metric
    //   - split the blood pressure metric
    //   - check if each is a number
    //   - check if each number is within range
    // else
    //   - if -> it's not a number...
    //   - if -> we have a min value and that the number is less than the min value
    it.todo;
  });

  describe('validateMaximum', () => {
    it.todo;
  });

  describe('validateMetric', () => {
    it.todo;
  });
});
