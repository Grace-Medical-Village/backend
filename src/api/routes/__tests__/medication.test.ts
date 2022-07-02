import request from 'supertest';
import { app } from '../../../app';
import { db } from '../../../utils/db';
import {
  createMedication,
  getMaxSerialValue,
  getRandomMedicationCategoryId,
  getRandomMedicationId,
} from '../../../utils/test-utils';
import { Medication, MedicationCategory } from '../../../types';

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

      const spy = jest.spyOn(db, 'buildData').mockImplementationOnce(() => []);

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
        .spyOn(db, 'buildData')
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

      const id = await getRandomMedicationId().then((r) => r);

      const response = await request(app).get(`/medications/${id}`);

      expect(response.statusCode).toStrictEqual(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body.id).toStrictEqual(id);
    });

    it('returns 404 if no medication is found', async () => {
      expect.assertions(3);

      const id = getMaxSerialValue();
      const response = await request(app).get(`/medications/${id}`);

      expect(response.statusCode).toStrictEqual(404);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toStrictEqual({});
    });

    it('returns 500 if an error occurs', async () => {
      expect.assertions(4);

      const id = await getRandomMedicationId().then((r) => r);

      const spy = jest
        .spyOn(db, 'buildData')
        .mockImplementationOnce(() => undefined as unknown as Medication[]);

      const response = await request(app).get(`/medications/${id}`);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response.statusCode).toStrictEqual(500);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toStrictEqual({});

      spy.mockRestore();
    });
  });

  describe('getMedicationCategories', () => {
    it('retrieves medication categories', async () => {
      expect.assertions(3);

      const response = await request(app)
        .get('/medications/categories')
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('handles db errors', async () => {
      expect.assertions(3);

      const spy = jest
        .spyOn(db, 'buildData')
        .mockImplementationOnce(() => [] as unknown as MedicationCategory[]);

      const response = await request(app)
        .get('/medications/categories')
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(404);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toStrictEqual([]);

      spy.mockRestore();
    });
  });

  describe('postMedication', () => {
    it('saves a medication to the db without strength provided', async () => {
      expect.assertions(3);

      const categoryId = await getRandomMedicationCategoryId().then((r) => r);
      const requestBody = {
        categoryId,
        name: 'TestMedicationPostMedicationName',
      };

      const response = await request(app)
        .post('/medications')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(201);
      expect(response.body.id).not.toBeNull();
      expect(response.body.id).toBeGreaterThan(0);
    });

    it('saves a medication to the db with strength provided', async () => {
      expect.assertions(3);

      const categoryId = await getRandomMedicationCategoryId().then((r) => r);

      const requestBody = {
        categoryId,
        name: 'TestMedicationPostMedicationNameWithStrength',
        strength: '500 mg',
      };

      const response = await request(app)
        .post('/medications/')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(201);
      expect(response.body.id).not.toBeNull();
      expect(response.body.id).toBeGreaterThan(0);
    });

    it('error if categoryId or name is missing', async () => {
      expect.assertions(2);

      const body = {};

      const response = await request(app)
        .post('/medications/')
        .send(body)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toMatch(/categoryId and name required/g);
    });

    it('throws error category id does not exist', async () => {
      expect.assertions(2);

      const body = {
        categoryId: 32767, // max small serial in Postgres
        name: 'TestMedicationPostMedicationNameWithStrength',
        strength: '1000 mg',
      };

      const response = await request(app)
        .post('/medications/')
        .send(body)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('putMedication', () => {
    it('modifies a medication', async () => {
      expect.assertions(2);

      const name = 'PutMedicationTest';
      const categoryId = await getRandomMedicationCategoryId().then((r) => r);
      const id = await createMedication(name, categoryId).then((r) => r);

      const body = {
        id,
        categoryId,
        name,
      };

      const response = await request(app)
        .put('/medications/')
        .send(body)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('deleteMedication', () => {
    it('returns 404 if path param id is not provided', async () => {
      expect.assertions(1);

      const response = await request(app).delete('/medications/');

      expect(response.statusCode).toStrictEqual(404);
    });

    it('fails if id not provided', async () => {
      expect.assertions(2);

      const response = await request(app)
        .delete('/medications/foo')
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toMatch(
        'failed to provide integer id path parameter'
      );
    });

    it('successfully deletes a medication', async () => {
      expect.assertions(2);

      const categoryId = await getRandomMedicationCategoryId().then((r) => r);
      const id = await createMedication(
        'DeleteMedicationTest',
        categoryId
      ).then((r) => r);

      const response = await request(app)
        .delete(`/medications/${id}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body).toStrictEqual({});
    });
  });
});
