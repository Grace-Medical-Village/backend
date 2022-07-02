import request from 'supertest';
import { app } from '../../../app';
import { db } from '../../../utils/db';
import { createPatient } from '../../../utils/test-utils';

describe('analytics', () => {
  describe('getPatientCount', () => {
    it('returns a patient count', async () => {
      expect.assertions(3);

      await createPatient().then((r) => r);

      const response = await request(app).get('/analytics/patients/count');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body.patientCount).toBeGreaterThan(0);
    });

    it('returns 0 if no patients found', async () => {
      expect.assertions(4);

      const spy = jest.spyOn(db, 'buildData').mockImplementationOnce(() => {
        return [
          {
            count: 0,
          },
        ];
      });

      const response = await request(app).get('/analytics/patients/count');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toStrictEqual(404);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body.patientCount).toStrictEqual(0);

      spy.mockRestore();
    });

    it('returns patient count if start and end date range provided', async () => {
      expect.assertions(3);

      const startDate = '2021-01-31';
      const endDate = '2100-12-31';
      const response = await request(app).get(
        `/analytics/patients/count?startDate=${startDate}&endDate=${endDate}`
      );

      expect(response.statusCode).toStrictEqual(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body.patientCount).toBeGreaterThan(0);
    });

    it('fails if the end date is prior to the start date', async () => {
      expect.assertions(3);

      const startDate = '2021-12-31';
      const endDate = '2021-01-31';
      const response = await request(app).get(
        `/analytics/patients/count?startDate=${startDate}&endDate=${endDate}`
      );

      expect(response.statusCode).toStrictEqual(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('getMapPatientCount', () => {
    it('returns a map patient count', async () => {
      expect.assertions(3);

      const response = await request(app).get('/analytics/patients/map/count');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body.patientCount).toBeGreaterThan(0);
    });

    it('returns 0 if no patients found', async () => {
      expect.assertions(4);

      const spy = jest.spyOn(db, 'buildData').mockImplementationOnce(() => []);

      const response = await request(app).get('/analytics/patients/map/count');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toStrictEqual(404);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body.patientCount).toStrictEqual(0);

      spy.mockRestore();
    });

    it('returns 500 if an error occurs', async () => {
      expect.assertions(4);

      const spy = jest
        .spyOn(db, 'buildData')
        .mockImplementationOnce(() => undefined as unknown as unknown[]);

      const response = await request(app).get('/analytics/patients/map/count');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toStrictEqual(500);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toStrictEqual({});

      spy.mockRestore();
    });

    it('fails if the end date is prior to the start date', async () => {
      expect.assertions(3);

      const startDate = '2021-12-31';
      const endDate = '2021-12-30';
      const response = await request(app).get(
        `/analytics/patients/map/count?startDate=${startDate}&endDate=${endDate}`
      );

      expect(response.statusCode).toStrictEqual(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('getMapPatients', () => {
    it('returns a list of patients', async () => {
      expect.assertions(3);

      const response = await request(app).get('/analytics/patients/map');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('returns 0 if no patients found', async () => {
      expect.assertions(4);

      const spy = jest.spyOn(db, 'buildData').mockImplementationOnce(() => []);

      const response = await request(app).get('/analytics/patients/map');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toStrictEqual(404);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveLength(0);

      spy.mockRestore();
    });

    it('returns 500 if an error occurs', async () => {
      expect.assertions(4);

      const spy = jest
        .spyOn(db, 'buildData')
        .mockImplementationOnce(() => undefined as unknown as unknown[]);

      const response = await request(app).get('/analytics/patients/map');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toStrictEqual(500);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toStrictEqual([]);

      spy.mockRestore();
    });

    it('fails if the end date is prior to the start date', async () => {
      expect.assertions(3);

      const startDate = '2021-12-31';
      const endDate = '2021-12-30';
      const response = await request(app).get(
        `/analytics/patients/map?startDate=${startDate}&endDate=${endDate}`
      );

      expect(response.statusCode).toStrictEqual(400);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toStrictEqual([]);
    });
  });
});
