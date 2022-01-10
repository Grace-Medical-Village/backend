import { indexOutOfBounds, isLocal, isProduction, isTest } from '../index';
import { EnvironmentTestObject } from '../../types';

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
    it.todo;
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

  describe('checkPattern', () => {
    it.todo;
  });

  describe('validatePattern', () => {
    it.todo;
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
