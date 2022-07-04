import request from 'supertest';
import { sample } from 'lodash';
import * as faker from 'faker';
import { app } from '../app';
import { toIso8601 } from './index';
import {
  CreateMedicationRequestBody,
  Metric,
  Patient,
  TestMetric,
} from '../types';

const resetEnv = (): void => {
  process.env.NODE_ENV = 'test';
};

async function createMedication(
  name: string,
  categoryId: number,
  strength: string | null = null
): Promise<number> {
  let result = -1;

  const requestBody: CreateMedicationRequestBody = {
    categoryId,
    name,
  };

  if (strength) requestBody.strength = strength;

  try {
    const response = await request(app)
      .post('/medications')
      .send(requestBody)
      .set('Accept', 'application/json');

    result = response?.body?.id ?? -1;
  } catch (e) {
    console.error(e);
  }

  return result;
}

async function createPatient(): Promise<number> {
  let result = -1;
  try {
    const requestBody = buildPatient();

    const response = await request(app)
      .post('/patients')
      .send(requestBody)
      .set('Accept', 'application/json');

    result = response?.body?.id ?? -1;
    if (result === -1) return result;
  } catch (e) {
    console.error(e);
  }
  return result;
}

async function savePatientAllergies(
  patientId: string,
  allergies: string
): Promise<number> {
  let result = -1;
  const requestBody = {
    patientId,
    allergies,
  };

  try {
    const response = await request(app)
      .post('/patients/allergy')
      .send(requestBody)
      .set('Accept', 'application/json');

    result = response?.body?.id ?? -1;
  } catch (e) {
    console.error(e);
  }
  return result;
}

async function savePatientConditions(
  patientId: string,
  conditionIds: number[]
): Promise<void> {
  try {
    for (const conditionId of conditionIds) {
      const requestBody = {
        patientId,
        conditionId,
      };

      await request(app)
        .post('/patients/condition')
        .send(requestBody)
        .set('Accept', 'application/json');
    }
  } catch (e) {
    console.error(e);
  }
}

async function savePatientMedication(
  patientId: string,
  medicationId: string
): Promise<number> {
  let result = -1;
  try {
    const requestBody = {
      patientId,
      medicationId,
    };

    const response = await request(app)
      .post('/patients/medication')
      .send(requestBody)
      .set('Accept', 'application/json');

    result = response?.body?.id ?? -1;
  } catch (e) {
    console.error(e);
  }
  return result;
}

async function savePatientMetric(
  patientId: string,
  metricId: string,
  value: string,
  comment = ''
): Promise<number> {
  let result = -1;
  try {
    const requestBody = {
      patientId,
      metricId,
      value,
      comment,
    };

    const response = await request(app)
      .post('/patients/metric')
      .send(requestBody)
      .set('Accept', 'application/json');

    result = response?.body?.id ?? -1;
  } catch (e) {
    console.error(e);
  }
  return result;
}

async function savePatientNote(
  patientId: string,
  note: string
): Promise<number> {
  let result = -1;

  try {
    const requestBody = {
      patientId,
      note,
    };

    const response = await request(app)
      .post('/patients/note')
      .send(requestBody)
      .set('Accept', 'application/json');

    result = response?.body?.id ?? -1;
  } catch (e) {
    console.error(e);
  }

  return result;
}

function buildPatient(): Partial<Patient> {
  const randomAge = Math.floor(Math.random() * 100); // max age 100 years
  const birthdate = toIso8601(faker.date.past(randomAge));
  const gender = zeroOrOne();

  return {
    firstName: faker.name.firstName(gender),
    lastName: faker.name.lastName(),
    gender: gender ? 'female' : 'male',
    birthdate,
    country: faker.address.country(),
    mobile: '212-314-7745',
    nativeLanguage: 'English',
    nativeLiteracy: Math.floor(Math.random() * 5).toString(),
    zipCode5: faker.address.zipCode().substring(0, 5),
    smoker: Boolean(zeroOrOne()),
  };
}

async function getRandomConditionId(): Promise<number> {
  let result = -1;

  try {
    const response = await request(app)
      .get('/conditions')
      .set('Accept', 'application/json');

    if (response.body.length > 0) {
      const { id } = sample(response.body);
      result = id;
    }
  } catch (e) {
    console.error(e);
  }

  return result;
}

async function getRandomMedicationCategoryId(): Promise<number> {
  let result = -1;

  try {
    const response = await request(app)
      .get('/medications/categories')
      .set('Accept', 'application/json');

    if (response.body.length > 0) {
      const { id } = sample(response.body);
      result = id;
    }
  } catch (e) {
    console.error(e);
  }

  return result;
}

async function getRandomMedicationId(): Promise<number> {
  let result = -1;

  try {
    const response = await request(app)
      .get('/medications')
      .set('Accept', 'application/json');

    if (response.body.length > 0) {
      const { id } = sample(response.body);
      result = id;
    }
  } catch (e) {
    console.error(e);
  }

  return result;
}

async function getRandomMetricId(): Promise<number> {
  let result = -1;

  try {
    const response = await request(app)
      .get('/metrics')
      .set('Accept', 'application/json');

    if (response.body.length > 0) {
      const { id } = sample(response.body);
      result = id;
    }
  } catch (e) {
    console.error(e);
  }

  return result;
}

async function getSampleMetricValue(metricId: string): Promise<string> {
  let result = '';

  try {
    const response = await request(app)
      .get('/metrics')
      .set('Accept', 'application/json');

    if (response.body.length > 0) {
      const metrics: Metric[] = response.body;
      const metric: Metric = metrics.filter(
        (metric) => metric.id.toString() === metricId
      )[0];
      result = metric?.format ?? '';
    }
  } catch (e) {
    console.error(e);
  }

  return result;
}

async function getTestMetrics(): Promise<Array<TestMetric>> {
  const result: Array<TestMetric> = [];

  try {
    const response = await request(app)
      .get('/metrics')
      .set('Accept', 'application/json');

    if (response.body.length > 0) {
      const metrics: Array<unknown> = response.body;
      for (const metric of metrics as Metric[]) {
        const testMetric: TestMetric = {
          id: metric.id,
          format: metric?.format ?? '',
        };
        result.push(testMetric);
      }
    }
  } catch (e) {
    console.error(e);
  }

  return result;
}

// max serial value - https://www.postgresql.org/docs/9.1/datatype-numeric.html
const getMaxSerialValue = (): number => 2147483647;

const zeroOrOne = (): number => Math.round(Math.random());

export {
  buildPatient,
  createMedication,
  createPatient,
  getMaxSerialValue,
  getRandomConditionId,
  getRandomMedicationCategoryId,
  getRandomMedicationId,
  getRandomMetricId,
  getSampleMetricValue,
  getTestMetrics,
  resetEnv,
  savePatientAllergies,
  savePatientConditions,
  savePatientMedication,
  savePatientMetric,
  savePatientNote,
  zeroOrOne,
};
