import { APIGatewayProxyHandler } from 'aws-lambda';
import { clientBuilder } from './utils/db';
import { getParameter } from './utils/request';
import { responseBase } from './utils/response';
import { PatientData, Query, Response, ResponseBody } from './utils/types';

export const main: APIGatewayProxyHandler = async (event) => {
  const client = clientBuilder();
  await client.connect();

  const id = getParameter(event, 'id', true);
  const conditions = !!getParameter(event, 'conditions', false);
  const medications = !!getParameter(event, 'medications', false);
  const metrics = !!getParameter(event, 'metrics', false);
  const notes = !!getParameter(event, 'notes', false);
  const patient = !!getParameter(event, 'patient', false);

  const patientData: PatientData = {};

  if (patient) {
    const getPatientQuery: Query = {
      name: 'get-patient',
      text: `select id,
           first_name,
           last_name,
           first_name || ' ' || last_name full_name,
           birthdate,
           gender,
           email,
           height,
           mobile,
           map,
           country,
           native_language,
           native_literacy,
           smoker
    from patient
    where id = $1;`,
      values: [id],
    };

    const { rows } = await client.query(getPatientQuery);
    if (rows.length > 0) patientData.patient = rows[0];
  }

  if (conditions === true) {
    const getPatientConditionsQuery: Query = {
      name: 'get-patient-conditions',
      text: 'select * from patient_condition where patient_id = $1;',
      values: [id],
    };

    const { rows } = await client.query(getPatientConditionsQuery);
    patientData.conditions = rows;
  }

  if (medications === true) {
    const getPatientMedicationsQuery: Query = {
      name: 'get-patient-medication',
      text: 'select * from patient_medication where patient_id = $1;',
      values: [id],
    };

    const { rows } = await client.query(getPatientMedicationsQuery);
    patientData.medications = rows;
  }

  if (metrics === true) {
    const getPatientMetricsQuery: Query = {
      name: 'get-patient-metrics',
      text: 'select * from patient_metric where patient_id = $1;',
      values: [id],
    };

    const { rows } = await client.query(getPatientMetricsQuery);
    patientData.metrics = rows;
  }

  if (notes === true) {
    const getPatientNotesQuery: Query = {
      name: 'get-patient-notes',
      text: 'select * from patient_note where patient_id = $1;',
      values: [id],
    };

    const { rows } = await client.query(getPatientNotesQuery);
    patientData.notes = rows;
  }

  await client.end();

  const body: ResponseBody = {
    data: patientData,
  };

  const response: Response = {
    ...responseBase,
    body: JSON.stringify(body),
  };

  return response;
};
