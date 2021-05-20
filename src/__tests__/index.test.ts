import serverlessExpress from '@vendia/serverless-express';
import { app } from '../app';
import { startServer, main } from '../index';

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

describe('main', () => {
  it('builds a serverless-express app', () => {
    expect.assertions(2);

    main();

    expect(serverlessExpress).toHaveBeenCalledTimes(1);
    expect(serverlessExpress).toHaveBeenCalledWith({ app });
  });
});
