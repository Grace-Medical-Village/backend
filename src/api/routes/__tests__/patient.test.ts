import request from 'supertest';
import { app } from '../../../app';
import {
  getPatientAllergies,
  getPatientConditions,
  getPatientMedications,
  getPatientMetrics,
  getPatientNotes,
} from '../patient';
import {
  buildPatient,
  createPatient,
  getMaxSerialValue,
  getRandomConditionId,
  getRandomMedicationId,
  getRandomMetricId,
  getSampleMetricValue,
  savePatientAllergies,
  savePatientConditions,
  savePatientMedication,
  savePatientMetric,
  savePatientNote,
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
    it('retrieves empty patient allergies object', async () => {
      expect.assertions(1);

      const patientId = await createPatient().then((r) => r.toString());

      const actual = await getPatientAllergies(patientId).then((r) => r);
      expect(actual).toStrictEqual({});
    });

    it('retrieves patient allergies object', async () => {
      expect.assertions(5);

      const patientId = await createPatient().then((r) => r);
      const allergies = 'Dihydrogen Monoxide';

      await savePatientAllergies(patientId.toString(), allergies).then(
        (r) => r
      );

      const actual = await getPatientAllergies(patientId.toString()).then(
        (r) => r
      );
      expect(actual.patientId).toStrictEqual(patientId);
      expect(actual.allergies).toStrictEqual(allergies);
      expect(actual.id).toBeGreaterThan(0);
      expect(actual.createdAt).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
      expect(actual.modifiedAt).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
    });
  });

  describe('getPatientConditions', () => {
    it('returns an empty array if patientId is not provided', async () => {
      expect.assertions(2);

      const actual = await getPatientConditions('').then((r) => r);

      expect(actual).toHaveLength(0);
      expect(actual).toStrictEqual([]);
    });

    it('returns a list of patient conditions', async () => {
      expect.assertions(7);

      const patientId = await createPatient().then((r) => r);
      const conditionId0 = await getRandomConditionId().then((r) => r);
      const conditionId1 = await getRandomConditionId().then((r) => r);
      const conditionIds = [conditionId0, conditionId1];
      await savePatientConditions(patientId.toString(), conditionIds).then(
        (r) => r
      );
      const actual = await getPatientConditions(patientId.toString()).then(
        (r) => r
      );

      // [{ id, patientId, allergies, createdAt, modifiedAt}]
      expect(actual.length).toBeGreaterThan(0);
      expect(actual).toHaveLength(2);
      expect(actual[0].patientId).toStrictEqual(patientId);
      expect(actual[0].id).toBeGreaterThan(0);
      expect(conditionIds).toContain(actual[0].conditionId);
      expect(actual[0].createdAt).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
      expect(actual[0].modifiedAt).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
    });
  });

  describe('getPatientMedications', () => {
    it('retrieves patient medications', async () => {
      expect.assertions(11);

      const patientId = await createPatient().then((r) => r);
      const medicationId0 = await getRandomMedicationId().then((r) => r);
      const medicationId1 = await getRandomMedicationId().then((r) => r);
      await savePatientMedication(
        patientId.toString(),
        medicationId0.toString()
      );
      await savePatientMedication(
        patientId.toString(),
        medicationId1.toString()
      );

      const patientMedications = await getPatientMedications(
        patientId.toString()
      );

      expect(patientMedications).toHaveLength(2);
      expect(patientMedications[0].patientId).toStrictEqual(patientId);
      expect(patientMedications[1].patientId).toStrictEqual(patientId);
      // ordered by created_at
      expect(patientMedications[0].medicationId).toStrictEqual(medicationId1);
      expect(patientMedications[1].medicationId).toStrictEqual(medicationId0);
      expect(patientMedications[0].id).toBeGreaterThan(0);
      expect(patientMedications[1].id).toBeGreaterThan(0);
      expect(patientMedications[0].createdAt).toMatch(
        /[0-9]{4}-[0-9]{2}-[0-9]{2}/
      );
      expect(patientMedications[0].modifiedAt).toMatch(
        /[0-9]{4}-[0-9]{2}-[0-9]{2}/
      );
      expect(patientMedications[1].createdAt).toMatch(
        /[0-9]{4}-[0-9]{2}-[0-9]{2}/
      );
      expect(patientMedications[1].modifiedAt).toMatch(
        /[0-9]{4}-[0-9]{2}-[0-9]{2}/
      );
    });

    it('returns empty array if patientId is not provided', async () => {
      expect.assertions(2);

      const patientMedications = await getPatientMedications('');

      expect(patientMedications).toHaveLength(0);
      expect(patientMedications).toStrictEqual([]);
    });
  });

  describe('getPatientMetrics', () => {
    it.todo('retrieves patient metric data', async () => {
      expect.assertions(13);
      const patientId = await createPatient().then((r) => r);
      const metricId0 = await getRandomMetricId().then((r) => r);
      const metricValue0 = await getSampleMetricValue(
        metricId0.toString()
      ).then((r) => r);
      const metricId1 = await getRandomMetricId().then((r) => r);
      const metricValue1 = await getSampleMetricValue(
        metricId1.toString()
      ).then((r) => r);

      await savePatientMetric(
        patientId.toString(),
        metricId0.toString(),
        metricValue0
      );

      await savePatientMetric(
        patientId.toString(),
        metricId1.toString(),
        metricValue1
      );

      const patientMetrics = await getPatientMetrics(patientId.toString()).then(
        (r) => r
      );

      expect(patientMetrics).toHaveLength(2);
      expect(patientMetrics[0].id).toBeGreaterThan(0);
      expect(patientMetrics[1].id).toBeGreaterThan(0);
      expect(patientMetrics[0].patientId).toStrictEqual(patientId);
      expect(patientMetrics[1].patientId).toStrictEqual(patientId);
      // ordered descending
      expect(patientMetrics[1].metricId).toStrictEqual(metricId0);
      expect(patientMetrics[0].metricId).toStrictEqual(metricId1);
      expect(patientMetrics[1].value).toStrictEqual(metricValue0.toString());
      expect(patientMetrics[0].value).toStrictEqual(metricValue1.toString());
      expect(patientMetrics[0].createdAt).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
      expect(patientMetrics[0].modifiedAt).toMatch(
        /[0-9]{4}-[0-9]{2}-[0-9]{2}/
      );
      expect(patientMetrics[1].createdAt).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
      expect(patientMetrics[1].modifiedAt).toMatch(
        /[0-9]{4}-[0-9]{2}-[0-9]{2}/
      );
    });

    it('returns empty array if patientId is not provided', async () => {
      expect.assertions(2);

      const patientMetrics = await getPatientMetrics('');

      expect(patientMetrics).toHaveLength(0);
      expect(patientMetrics).toStrictEqual([]);
    });
  });

  describe('getPatientNotes', () => {
    it('returns an array of notes', async () => {
      expect.assertions(11);

      const patientId = await createPatient().then((r) => r);
      const note0 = 'The patient has a headache';
      const note1 = 'Their weight is 42';
      await savePatientNote(patientId.toString(), note0);
      await savePatientNote(patientId.toString(), note1);

      const patientNotes = await getPatientNotes(patientId.toString());

      expect(patientNotes).toHaveLength(2);
      expect(patientNotes[0].id).toBeGreaterThan(0);
      expect(patientNotes[1].id).toBeGreaterThan(0);
      expect(patientNotes[0].patientId).toStrictEqual(patientId);
      expect(patientNotes[1].patientId).toStrictEqual(patientId);
      expect(patientNotes[0].note).toStrictEqual(note1);
      expect(patientNotes[1].note).toStrictEqual(note0);
      expect(patientNotes[0].createdAt).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
      expect(patientNotes[0].modifiedAt).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
      expect(patientNotes[1].createdAt).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
      expect(patientNotes[1].modifiedAt).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
    });

    it('returns empty notes array if patientId is not provided', async () => {
      expect.assertions(2);

      const patientNotes = await getPatientNotes('');

      expect(patientNotes).toHaveLength(0);
      expect(patientNotes).toStrictEqual([]);
    });
  });

  describe('getPatients', () => {
    it('returns a 404 if birthdate matches no patients', async () => {
      expect.assertions(2);

      const response = await request(app)
        .get('/patients?birthdate=2100-01-01')
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(404);
      expect(response.body).toStrictEqual([]);
    });

    it('returns a 404 if name matches no patients', async () => {
      expect.assertions(2);

      const response = await request(app)
        .get('/patients?name=xxxyyyzzz')
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(404);
      expect(response.body).toStrictEqual([]);
    });

    it('returns an error response if no query params provided', async () => {
      expect.assertions(2);

      const response = await request(app)
        .get('/patients')
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body).toStrictEqual([]);
    });
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

    it('returns an error if patientId is not provided', async () => {
      expect.assertions(2);

      const requestBody = {
        allergies: 'some allergies',
      };

      const response = await request(app)
        .post('/patients/allergy')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        "'patientId' required in request body"
      );
    });

    it('returns an error if allergies is not provided', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);

      const requestBody = {
        patientId,
      };

      const response = await request(app)
        .post('/patients/allergy')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        "'allergies' required in request body"
      );
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

    it('returns an error if patient does not exist', async () => {
      expect.assertions(2);

      const conditionId = await getRandomConditionId().then((r) => r);

      const requestBody = {
        patientId: getMaxSerialValue(),
        conditionId,
      };

      const response = await request(app)
        .post('/patients/condition')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body).toStrictEqual({});
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

    it('returns an error if the patient does not exist', async () => {
      expect.assertions(2);

      const medicationId = await getRandomMedicationId().then((r) => r);

      const requestBody = {
        patientId: getMaxSerialValue(),
        medicationId,
      };

      const response = await request(app)
        .post('/patients/medication')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body).toStrictEqual({});
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
    it.todo('saves a metric for a patient', async () => {
      expect.assertions(4);

      const patientId = await createPatient().then((r) => r);
      const metricId = await getRandomMetricId().then((r) => r);
      const value = await getSampleMetricValue(metricId.toString()).then(
        (r) => r
      );

      const requestBody = {
        patientId,
        metricId,
        value,
      };

      const response = await request(app)
        .post('/patients/metric')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(201);
      expect(response.body.id).toBeGreaterThan(0);
      expect(response.body.createdAt.length).toBeGreaterThan(0);
      expect(response.body.modifiedAt.length).toBeGreaterThan(0);
    });
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
  });

  // TODO
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

  describe('putPatientNote', () => {
    it('returns an error if noteId is not provided', async () => {
      expect.assertions(2);

      const requestBody = {
        note: ' This is a test note. ',
      };
      const response = await request(app)
        .put(`/patients/note/xyz`)
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        '"noteId" path parameter required'
      );
    });

    it('returns an error if a note is not provided', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);
      let note = 'This is the first note';
      const noteId = await savePatientNote(patientId.toString(), note).then(
        (r) => r
      );

      note = '';
      const response = await request(app)
        .put(`/patients/note/${noteId}`)
        .send({ note })
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        '"note" must be provided in the request body and it cannot be empty'
      );
    });

    it('updates a note', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);
      let note = 'This is the first note';
      const noteId = await savePatientNote(patientId.toString(), note).then(
        (r) => r
      );

      note = 'This is the second note ';
      const response = await request(app)
        .put(`/patients/note/${noteId}`)
        .send({ note })
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('deletePatient', () => {
    it('returns an error if the patientId path parameter is invalid', async () => {
      expect.assertions(2);

      const patientId = '1.1';
      const response = await request(app)
        .delete(`/patients/${patientId}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        '"patientId" is a required path parameter'
      );
    });

    it('deletes a patient', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);
      const response = await request(app)
        .delete(`/patients/${patientId}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('deletePatientAllergy', () => {
    it('returns an error if patientAllergyId path parameter is not provided', async () => {
      expect.assertions(2);

      const patientAllergyId = '-1';
      const response = await request(app)
        .delete(`/patients/allergy/${patientAllergyId}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        '"patientAllergyId" is a required path parameter'
      );
    });

    it('successfully deletes a patient allergy', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);
      const patientAllergyId = await savePatientAllergies(
        patientId.toString(),
        'Peanuts'
      );

      const response = await request(app)
        .delete(`/patients/allergy/${patientAllergyId}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('deletePatientCondition', () => {
    it('returns an error if the condition path parameter is not provided', async () => {
      expect.assertions(2);

      const patientConditionId = '-';
      const response = await request(app)
        .delete(`/patients/condition/${patientConditionId}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        '"patientConditionId" is a required path parameter'
      );
    });

    it('successfully deletes a patient condition', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);
      const conditionId = await getRandomConditionId().then((r) => r);
      await savePatientConditions(patientId.toString(), [conditionId]).then(
        (r) => r
      );

      const response = await request(app)
        .delete(`/patients/condition/${conditionId}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('deletePatientMedication', () => {
    it('returns an error if the medication path parameter is not provided', async () => {
      expect.assertions(2);

      const patientMedicationId = 'x';
      const response = await request(app)
        .delete(`/patients/medication/${patientMedicationId}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        '"patientMedicationId" is a required path parameter'
      );
    });

    it('successfully deletes a patient medication', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);
      const medicationId = await getRandomMedicationId().then((r) => r);
      const patientMedicationId = await savePatientMedication(
        patientId.toString(),
        medicationId.toString()
      ).then((r) => r);

      const response = await request(app)
        .delete(`/patients/medication/${patientMedicationId}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('deletePatientMetric', () => {
    it('returns an error if the metric path parameter is not provided', async () => {
      expect.assertions(2);

      const patientMetricId = 'x';
      const response = await request(app)
        .delete(`/patients/metric/${patientMetricId}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        '"patientMetricId" is a required path parameter'
      );
    });

    it.todo('successfully deletes a patient metric', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);
      const metricId = await getRandomMetricId().then((r) => r);
      // TODO -> get valid test value
      const value = 100;
      const patientMetricId = await savePatientMetric(
        patientId.toString(),
        metricId.toString(),
        value.toString()
      ).then((r) => r);

      const response = await request(app)
        .delete(`/patients/metric/${patientMetricId}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('deletePatientNote', () => {
    it('returns an error if the note path parameter is not provided', async () => {
      expect.assertions(2);

      const patientNoteId = 'x';
      const response = await request(app)
        .delete(`/patients/note/${patientNoteId}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.error).toStrictEqual(
        '"patientNoteId" is a required path parameter'
      );
    });

    it('successfully deletes a patient note', async () => {
      expect.assertions(2);

      const patientId = await createPatient().then((r) => r);
      const patientNoteId = await savePatientNote(
        patientId.toString(),
        'Lorem ipsum dolor'
      ).then((r) => r);

      const response = await request(app)
        .delete(`/patients/note/${patientNoteId}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body).toStrictEqual({});
    });
  });
});
