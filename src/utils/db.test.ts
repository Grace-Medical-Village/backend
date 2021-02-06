import { clientBuilder } from './db';

describe('db utils are built', () => {
  it('builds the Postgres Client', () => {
    expect.assertions(1);
    expect(clientBuilder).toHaveBeenCalledTimes(1);
  });
});
