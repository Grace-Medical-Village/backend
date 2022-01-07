import request from 'supertest';
import { app } from '../../../app';
import { Medication } from '../../../types';
import { dataBuilder } from '../../../utils/data-builder';

describe('medications', () => {
  describe('getMedications', () => {
    it('retrieves medication data', async () => {
      expect.assertions(3);

      const response = await request(app).get('/medications/');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('returns 404 if no medications found', async () => {
      expect.assertions(4);

      const spy = jest
        .spyOn(dataBuilder, 'buildMedicationData')
        .mockImplementationOnce(() => []);

      const response = await request(app).get('/medications/');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toStrictEqual(404);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveLength(0);

      spy.mockRestore();
    });

    it('returns 500 if an error occurs', async () => {
      expect.assertions(4);

      const spy = jest
        .spyOn(dataBuilder, 'buildMedicationData')
        .mockImplementationOnce(() => undefined as unknown as Medication[]);

      const response = await request(app).get('/medications/');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toStrictEqual(500);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveLength(0);

      spy.mockRestore();
    });
  });

  describe('getMedication', () => {
    it('retrieves a single medication', async () => {
      expect.assertions(3);

      const medicationData = await request(app)
        .get('/medications/')
        .then((response) => response.body);

      const { id = -1 } = medicationData[0];

      const response = await request(app).get(`/medications/${id}`);

      expect(response.statusCode).toStrictEqual(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body.id).toStrictEqual(id);
    });

    it('returns 404 if no medication is found', async () => {
      expect.assertions(3);

      const id = 1000000;
      const response = await request(app).get(`/medications/${id}`);

      expect(response.statusCode).toStrictEqual(404);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toStrictEqual({});
    });

    it('returns 500 if an error occurs', async () => {
      expect.assertions(4);

      const spy = jest
        .spyOn(dataBuilder, 'buildMedicationData')
        .mockImplementationOnce(() => undefined as unknown as Medication[]);

      const response = await request(app).get('/medications/');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toStrictEqual(500);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toStrictEqual([]);

      spy.mockRestore();
    });
  });
});
