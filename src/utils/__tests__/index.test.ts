import {
  dateToDayId,
  indexOutOfBounds,
  isBloodPressureMetric,
  isIntegerGreaterThanZero,
  isDate,
  isLocal,
  isNumber,
  isProduction,
  isTest,
  oneYearAgo,
  regexTest,
  toIso8601,
  tomorrow,
  validateMaximum,
  validateMinimum,
  validateNumber,
  validatePattern,
  validateValuesProvided,
} from '../index';
import { EnvironmentTestObject, MetricFormat } from '../../types';

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
      expect(actual).toMatch(/\d{4}-\d{2}-\d{2}/);
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

      const actual = dayIdTomorrow - dayIdToday;
      const expected = 1;

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('oneYearAgo', () => {
    it('returns the date of one year ago', () => {
      expect.assertions(1);
      const dayIdToday = dateToDayId(new Date());
      const dayIdYearAgo = dateToDayId(oneYearAgo());

      const actual = dayIdToday - dayIdYearAgo;
      const expected = 10000;

      expect(actual).toStrictEqual(expected);
    });
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

  describe('validateValuesProvided', () => {
    it('fails if an empty array is provided', () => {
      expect.assertions(2);

      const actual = validateValuesProvided([]);
      expect(actual.isValid).toStrictEqual(false);
      expect(actual.error).toStrictEqual('No metric values provided');
    });
  });

  describe('validateNumber', () => {
    it('confirms if a value is a number', () => {
      expect.assertions(1);

      const actual = validateNumber(['123', '456']);

      expect(actual).toStrictEqual({});
    });

    it('succeeds if a negative number is provided', () => {
      expect.assertions(1);

      const actual = validateNumber(['-1777.1']);

      expect(actual).toStrictEqual({});
    });

    it('fails if a blood pressure metric is provided', () => {
      expect.assertions(2);

      const actual = validateNumber(['90', '120/100']);

      expect(actual.isValid).toStrictEqual(false);
      expect(actual.error).toStrictEqual(
        'Metric value of 120/100 is not a number'
      );
    });

    it('fails if letters are provided', () => {
      expect.assertions(2);

      const actual = validateNumber(['b120', '80']);

      expect(actual.isValid).toStrictEqual(false);
      expect(actual.error).toStrictEqual(
        'Metric value of b120 is not a number'
      );
    });
  });

  describe('validateMaximum', () => {
    it('succeeds if maxValue is null', () => {
      expect.assertions(1);

      const metricFormat: MetricFormat = {
        id: 1,
        minValue: null,
        maxValue: null,
        pattern: null,
      };

      const actual = validateMaximum([], metricFormat);

      expect(actual).toStrictEqual({});
    });

    it('validates that values are within the maximum allowed value', () => {
      expect.assertions(1);

      const metricFormat: MetricFormat = {
        id: 1,
        minValue: null,
        maxValue: 500,
        pattern: null,
      };

      const actual = validateMaximum(['123', '500', '0'], metricFormat);

      expect(actual).toStrictEqual({});
    });

    it('fails if single value exceeds the maxValue', () => {
      expect.assertions(2);

      const metricFormat: MetricFormat = {
        id: 1,
        minValue: null,
        maxValue: 500,
        pattern: null,
      };

      const actual = validateMaximum(['1000'], metricFormat);

      expect(actual.isValid).toStrictEqual(false);
      expect(actual.error).toMatch(/exceeds maximum/gi);
    });

    it('fails if intermittent exceeds maxValue', () => {
      expect.assertions(2);

      const metricFormat: MetricFormat = {
        id: 1,
        minValue: null,
        maxValue: 120,
        pattern: null,
      };

      const actual = validateMaximum(['100', '121', '80'], metricFormat);

      expect(actual.isValid).toStrictEqual(false);
      expect(actual.error).toMatch(/exceeds maximum/gi);
    });
  });

  describe('validateMinimum', () => {
    it('succeeds if minValue is null', () => {
      expect.assertions(1);

      const metricFormat: MetricFormat = {
        id: 1,
        minValue: null,
        maxValue: null,
        pattern: null,
      };

      const actual = validateMinimum([], metricFormat);

      expect(actual).toStrictEqual({});
    });

    it('validates that values are within the minimum allowed value', () => {
      expect.assertions(1);

      const metricFormat: MetricFormat = {
        id: 1,
        minValue: -100,
        maxValue: null,
        pattern: null,
      };

      const actual = validateMinimum(['-100', '-10', '0', '100'], metricFormat);

      expect(actual).toStrictEqual({});
    });

    it('fails if single value exceeds the maxValue', () => {
      expect.assertions(2);

      const metricFormat: MetricFormat = {
        id: 1,
        minValue: -10,
        maxValue: null,
        pattern: null,
      };

      const actual = validateMinimum(['-10.01'], metricFormat);

      expect(actual.isValid).toStrictEqual(false);
      expect(actual.error).toMatch(/exceeds minimum/gi);
    });

    it('fails if intermittent exceeds maxValue', () => {
      expect.assertions(2);

      const metricFormat: MetricFormat = {
        id: 1,
        minValue: 1000,
        maxValue: null,
        pattern: null,
      };

      const actual = validateMinimum(['1000', '10000', '100'], metricFormat);

      expect(actual.isValid).toStrictEqual(false);
      expect(actual.error).toMatch(/exceeds minimum/gi);
    });
  });

  describe('validatePattern', () => {
    it('succeeds for pattern does not exist on metric format', () => {
      expect.assertions(1);

      const metricFormat: MetricFormat = {
        id: 1,
        minValue: null,
        maxValue: null,
        pattern: null,
      };

      const actual = validatePattern('', metricFormat);

      expect(actual).toStrictEqual({});
    });

    it('succeeds if pattern is matched - blood pressure', () => {
      expect.assertions(1);

      const metricFormat: MetricFormat = {
        id: 1,
        minValue: null,
        maxValue: null,
        pattern: '^([1-9]|[1-9]\\d+)/([1-9]|[1-9]\\d+)$',
      };

      const actual = validatePattern('144/121', metricFormat);

      expect(actual).toStrictEqual({});
    });

    it('succeeds if pattern is matched - pain', () => {
      expect.assertions(1);

      const metricFormat: MetricFormat = {
        id: 1,
        minValue: null,
        maxValue: null,
        pattern: '^\\b([0-9]|10)\\b$',
      };

      const actual = validatePattern('0', metricFormat);

      expect(actual).toStrictEqual({});
    });

    it('fails if pattern is not matched - blood pressure', () => {
      expect.assertions(2);

      const metricFormat: MetricFormat = {
        id: 1,
        minValue: null,
        maxValue: null,
        pattern: '^([1-9]|[1-9]\\d+)/([1-9]|[1-9]\\d+)$',
      };

      const actual = validatePattern('144/', metricFormat);

      expect(actual.isValid).toStrictEqual(false);
      expect(actual.error).toMatch(/does not match required format/gi);
    });
  });

  describe('isDate', () => {
    it('validates an iso8601 date', () => {
      expect.assertions(3);
      expect(isDate('1900-01-15')).toStrictEqual(true);
      expect(isDate('2000-12-31')).toStrictEqual(true);
      expect(isDate('2500-07-03')).toStrictEqual(true);
    });
  });
});
