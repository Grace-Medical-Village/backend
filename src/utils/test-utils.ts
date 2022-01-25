import request from 'supertest';
import { sample } from 'lodash';
import * as faker from 'faker';
import { app } from '../app';
import { toIso8601 } from './index';
import { Patient } from '../types';

async function createPatient(): Promise<number> {
  let result = -1;
  try {
    const requestBody = buildPatient();

    // TODO
    // if (zeroOrOne()) requestBody.mobile = faker.phone.phoneNumber(); if (zeroOrOne()) requestBody.email =
    // faker.internet.email();
    // if (zeroOrOne()) requestBody.zipCode5 = faker.address.zipCode();
    // if (zeroOrOne()) {
    //   // max native literacy: 5; min native literacy: 1
    //   requestBody.nativeLiteracy = Math.floor(
    //     Math.random() * (5 - 1 + 1) + 1
    //   ).toString();
    // }
    // if (zeroOrOne()) {
    //   // max height 84"; min height 12"
    //   requestBody.height = Math.floor(
    //     Math.random() * (84 - 12 + 1) + 12
    //   ).toString();
    // }

    const response = await request(app)
      .post('/patients')
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

const zeroOrOne = () => Math.round(Math.random());

export {
  buildPatient,
  createPatient,
  getRandomConditionId,
  getRandomMedicationCategoryId,
  getRandomMedicationId,
  getRandomMetricId,
  zeroOrOne,
};
