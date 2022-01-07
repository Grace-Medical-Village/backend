import request from 'supertest';
import { app } from '../../../app';

describe('getHealthCheck', () => {
  it('returns true if the app is running', async (): Promise<void> => {
    expect.assertions(3);

    const response = await request(app).get('/health');

    expect(response.statusCode).toStrictEqual(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body.healthy).toStrictEqual(true);
  });
});
