import {
  indexOutOfBounds,
  isLocal,
  isNumber,
  isProduction,
  isTest,
  regexTest,
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

  describe('toIso8601', () => {
    it.todo;
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
    it.todo;
  });

  describe('oneYearAgo', () => {
    it.todo;
  });

  describe('buildCachedMetrics', () => {
    it.todo;
  });

  describe('getMetricFormat', () => {
    it.todo;
  });

  describe('isBloodPressureMetric', () => {
    it.todo;
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
    it.todo('will mark a metric as valid', () => {
      expect.assertions(1);
      const value = 'foo';
      const validMetric: ValidMetric = {
        isValid: true,
        metric: '',
        error: '',
      };
      const metricFormat: MetricFormat = {
        id: 1,
        minValue: null,
        maxValue: null,
        pattern: null,
      };
      const actual = validatePattern(value, metricFormat, validMetric);
      const expected = null;
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('validateMinimum', () => {
    it.todo;
  });

  describe('validateMaximum', () => {
    it.todo;
  });

  describe('validateMetric', () => {
    it.todo;
  });
});
