import { isLocal, isProduction } from '../index';
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
];

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
          process.env.NODE_ENV = f;
          expect(obj.function()).toStrictEqual(false);
        });
      });
    });
  });
});
