import { app } from '../app';
import { startServer } from '../index';

jest.mock('@vendia/serverless-express');

describe('server', () => {
  it('builds a server for local development', () => {
    expect.assertions(2);

    const spy = jest.spyOn(app, 'listen').mockImplementation();
    const server = startServer().then((r) => r);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(server).not.toBeNull();

    spy.mockRestore();
  });
});
