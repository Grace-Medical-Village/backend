import { app } from '../app';
import { startServer } from '../index';

jest.mock('@vendia/serverless-express');

function buildMockApp(): void {
  jest.spyOn(app, 'listen').mockImplementation();
  jest.spyOn(app, 'use').mockImplementation();
}

describe('server', () => {
  it('builds a Express app for local development', () => {
    expect.assertions(1);

    buildMockApp();
    startServer();

    expect(app.listen).toHaveBeenCalledTimes(1);
  });
});
