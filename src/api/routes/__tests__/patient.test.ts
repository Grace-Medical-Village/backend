import request from 'supertest';
import { app } from '../../../app';
import {
  buildPatient,
  createPatient,
  getRandomConditionId,
  getRandomMedicationId,
} from '../../../utils/test-utils';

describe('patient', () => {
  describe('getPatient', () => {
    it('successfully retrieves a patient', async () => {
      expect.assertions(8);
      const patientId = await createPatient().then((r) => r);

      const response = await request(app)
        .get(`/patients/${patientId}`)
        .set('Accept', 'application/json');

      expect(patientId).toBeGreaterThan(0);
      expect(response.statusCode).toStrictEqual(200);
      expect(response.body.allergies).toStrictEqual({});
      expect(response.body.conditions.length).toBeGreaterThanOrEqual(0);
      expect(response.body.medications.length).toBeGreaterThanOrEqual(0);
      expect(response.body.metrics.length).toBeGreaterThanOrEqual(0);
      expect(response.body.notes.length).toBeGreaterThanOrEqual(0);
      expect(response.body.patient.id).toStrictEqual(patientId);
    });

    it('fails to retrieve patient if it does not exist', async () => {
      expect.assertions(2);
      const response = await request(app)
        .get('/patients/100000')
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(404);
      expect(response.body).toStrictEqual({});
    });

    it('throws an error if patient ID is not greater than 0', async () => {
      expect.assertions(2);

      const response = await request(app)
        .get('/patients/0')
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        'patient ID provided must be an integer and greater than 0'
      );
    });
  });

  describe('getPatientAllergies', () => {
    it.todo;
  });

  describe('getPatientConditions', () => {
    it.todo;
  });

  describe('getPatientMedications', () => {
    it.todo;
  });

  describe('getPatientMetrics', () => {
    it.todo;
  });

  describe('getPatientNotes', () => {
    it.todo;
  });

  describe('getPatients', () => {
    it.todo;
  });

  describe('postPatient', () => {
    it('creates a patient', async () => {
      expect.assertions(2);

      const requestBody = buildPatient();

      const response = await request(app)
        .post('/patients')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(201);
      expect(response.body.id).toBeGreaterThan(0);
    });
  });

  describe('postPatientAllergies', () => {
    it('saves patient allergies', async () => {
      expect.assertions(3);

      const patientId = await createPatient().then((r) => r);
      const allergies = 'Bees, Gluten';

      const requestBody = {
        patientId,
        allergies,
      };

      const response = await request(app)
        .post('/patients/allergy')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(201);
      expect(response.body.id).not.toBeNull();
      expect(response.body.id).toBeGreaterThan(0);
    });
  });

  describe('postPatientCondition', () => {
    it("saves a patient's condition", async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);
      const conditionId = await getRandomConditionId().then((r) => r);

      const requestBody = {
        patientId,
        conditionId,
      };

      const response = await request(app)
        .post('/patients/condition')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(201);
      expect(response.body.id).toBeGreaterThan(0);
    });

    it('fails if request body missing patientId', async () => {
      expect.assertions(2);

      const conditionId = await getRandomConditionId().then((r) => r);

      const requestBody = {
        conditionId,
      };

      const response = await request(app)
        .post('/patients/condition')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body).toStrictEqual({});
    });

    it('fails if request body missing conditionId', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);

      const requestBody = {
        patientId,
      };

      const response = await request(app)
        .post('/patients/condition')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('postPatientMedication', () => {
    it('saves a medication for a patient', async () => {
      expect.assertions(4);

      const patientId = await createPatient().then((r) => r);
      const medicationId = await getRandomMedicationId().then((r) => r);

      const requestBody = {
        patientId,
        medicationId,
      };

      const response = await request(app)
        .post('/patients/medication')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(201);
      expect(response.body.id).toBeGreaterThan(0);
      expect(response.body.createdAt.length).toBeGreaterThan(0);
      expect(response.body.modifiedAt.length).toBeGreaterThan(0);
    });

    it('fails to save medication if request body missing patientId', async () => {
      expect.assertions(2);

      const medicationId = await getRandomMedicationId().then((r) => r);

      const requestBody = {
        medicationId,
      };

      const response = await request(app)
        .post('/patients/medication')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body).toStrictEqual({});
    });

    it('fails to save medication if request body missing medicationId', async () => {
      expect.assertions(2);

      const medicationId = await getRandomMedicationId().then((r) => r);

      const requestBody = {
        medicationId,
      };
      const response = await request(app)
        .post('/patients/condition')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('postPatientMetric', () => {
    it.todo;
    // eslint-disable-next-line jest/no-commented-out-tests
    // it('saves a metric for a patient', async () => {
    //   expect.assertions(4);
    //
    //   const patientId = await createPatient().then((r) => r);
    //   const metricId = await getRandomMetricId().then((r) => r);
    //
    //   const requestBody = {
    //     patientId,
    //     metricId,
    //     value: '100', // TODO - potential error
    //   };
    //
    //   const response = await request(app)
    //     .post('/patients/metric')
    //     .send(requestBody)
    //     .set('Accept', 'application/json');
    //
    //   expect(response.statusCode).toStrictEqual(201);
    //   expect(response.body.id).toBeGreaterThan(0);
    //   expect(response.body.createdAt.length).toBeGreaterThan(0);
    //   expect(response.body.modifiedAt.length).toBeGreaterThan(0);
    // });
  });

  describe('postPatientNote', () => {
    it('creates a note', async () => {
      expect.assertions(8);
      const note = 'Lorem ipsum dolor ';
      const patientId = 1;
      const requestBody = {
        note,
        patientId,
      };
      const response = await request(app)
        .post('/patients/note')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(201);
      expect(response.body.id).not.toBeNull();
      expect(response.body.id).toBeGreaterThan(0);
      expect(response.body.note).toStrictEqual(note.trim());
      expect(response.body.createdAt).not.toBeNull();
      expect(response.body.modifiedAt).not.toBeNull();
      expect(response.body.createdAt.length).toBeGreaterThan(0);
      expect(response.body.modifiedAt.length).toBeGreaterThan(0);
    });

    it('fails to save a note if patientId is missing', async () => {
      expect.assertions(2);
      const note = 'This is a note about a patient!';
      const requestBody = {
        note,
      };

      const response = await request(app)
        .post('/patients/note')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toMatch(
        'patientId and note required in request body to save patient note'
      );
    });

    it('fails to save a note if note is missing', async () => {
      expect.assertions(2);
      const patientId = 1;
      const requestBody = {
        patientId,
      };

      const response = await request(app)
        .post('/patients/note')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toMatch(
        'patientId and note required in request body to save patient note'
      );
    });

    it.todo('modifies an existing patient note');
    it.todo('fails if path param for note id is missing');
    it.todo('fails if note is not provided in request body');
    it.todo('returns the note value and modified value');
    it.todo('handles a failed update to the database');
    it.todo('fieldlist is empty');
    it.todo('internal error');
  });

  describe('putPatient', () => {
    it.todo;
  });

  describe('putPatientAllergies', () => {
    it('successfully updates patient allergies', async () => {
      expect.assertions(2);
      const patientId = await createPatient().then((r) => r);

      const requestBody = {
        patientId,
        allergies: 'Peanuts, Shrimp',
      };
      const response = await request(app)
        .put(`/patients/allergy/${patientId}`)
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body).toStrictEqual({});
    });

    it('fails if path param of patient id is not provided', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);

      const requestBody = {
        patientId,
      };
      const response = await request(app)
        .put(`/patients/allergy/${patientId}`)
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        "'allergies' required in request body"
      );
    });
    it.todo('fails if request body of allergies is not provided');
    it.todo('handles a failed update to the database');
  });

  describe('putPatientArchive', () => {
    it('successfully archives patient', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);
      const requestBody = {
        archive: true,
      };
      const response = await request(app)
        .put(`/patients/archive/${patientId}`)
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body.archive).toStrictEqual(true);
    });

    it('successfully removes patient from archive', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);
      const requestBody = {
        archive: false,
      };
      const response = await request(app)
        .put(`/patients/archive/${patientId}`)
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body.archive).toStrictEqual(false);
    });

    it('returns 400 if patient id not provided', async () => {
      expect.assertions(2);

      const response = await request(app)
        .put('/patients/archive/0')
        .send({ archive: true })
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        'patient ID provided must be an integer and greater than 0'
      );
    });

    it('returns 400 if archive missing from request body', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);

      const response = await request(app)
        .put(`/patients/archive/${patientId}`)
        .send({ foo: 'bar' })
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        "'archive' not provided in request body"
      );
    });
  });

  describe('putPatientMetric', () => {
    it.todo;
  });

  describe('putPatientNote', () => {
    it.todo;
  });

  describe('deletePatient', () => {
    it.todo;
  });
  describe('deletePatientAllergy', () => {
    it.todo;
  });
  describe('deletePatientCondition', () => {
    it.todo;
  });
  describe('deletePatientMedication', () => {
    it.todo;
  });
  describe('deletePatientMetric', () => {
    it.todo;
  });
  describe('deletePatientNote', () => {
    it.todo;
  });
});
