import request from 'supertest';
import { app } from '../../../app';
import { db } from '../../../utils/db';

describe('conditions', () => {
  describe('getConditions', () => {
    it('retrieves condition data', async () => {
      expect.assertions(5);

      const response = await request(app).get('/conditions/');
      const condition = response.body[0];

      expect(response.statusCode).toStrictEqual(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body.length).toBeGreaterThan(0);
      expect(condition.id).toBeGreaterThan(0);
      expect(condition.conditionName.length).toBeGreaterThan(0);
    });

    it('404 if no conditions found', async () => {
      expect.assertions(4);

      const spy = jest.spyOn(db, 'buildData').mockImplementationOnce(() => []);

      const response = await request(app).get('/conditions/');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toStrictEqual(404);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveLength(0);

      spy.mockRestore();
    });

    it('500 if an error occurs', async () => {
      expect.assertions(4);

      const spy = jest
        .spyOn(db, 'buildData')
        .mockImplementationOnce(() => undefined as unknown as unknown[]);

      const response = await request(app).get('/conditions/');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toStrictEqual(500);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveLength(0);

      spy.mockRestore();
    });
  });
});
