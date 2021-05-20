import { Request, Response } from 'express';
import { dbRequest, getFieldValue, sqlParen } from '../../utils/db';
import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import {
  Pat,
  Patient,
  PatientCondition,
  PatientListRecord,
  PatientMedication,
  PatientMetric,
  PatientNote,
  Pats,
  PC,
  PMed,
  PMet,
  PNote,
} from '../../types';

async function getPatient(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  const sql = `select * from patient where id = ${id}`;

  const records = await dbRequest(sql)
    .then((r) => r)
    .catch((err) => console.error(err)); // todo clearer messages

  if (records && records.length === 1) {
    const conditions = await getPatientConditions(id)
      .then((c) => c)
      .catch((err) => console.error(err));
    const medications = await getPatientMedications(id)
      .then((c) => c)
      .catch((err) => console.error(err));
    const metrics = await getPatientMetrics(id)
      .then((c) => c)
      .catch((err) => console.error(err));
    const notes = await getPatientNotes(id)
      .then((c) => c)
      .catch((err) => console.error(err));
    const patient = buildPatientData(records[0]);

    res.status(200);
    res.json({
      conditions,
      medications,
      metrics,
      notes,
      patient,
    });
  } else {
    res.status(404);
    res.json({});
  }
}

async function getPatientConditions(
  id: string
): Promise<ArrayLike<PatientCondition>> {
  let conditions: ArrayLike<PatientCondition> = [];
  const sql = `select pc.*, c.condition_name
    from patient_condition pc
    inner join condition c on pc.condition_id = c.id
    where patient_id = ${id};
  `;
  const records = await dbRequest(sql)
    .then((r) => r)
    .catch((err) => console.error(err));

  if (records && records.length > 0) {
    conditions = buildPatientConditions(records);
  }
  return conditions;
}

async function getPatientMedications(
  id: string
): Promise<ArrayLike<PatientMedication>> {
  let medications: ArrayLike<PatientMedication> = [];
  const sql = `select * from patient_medication where patient_id = ${id};`;

  const records = await dbRequest(sql)
    .then((r) => r)
    .catch((err) => console.error(err));

  if (records && records.length > 0) {
    medications = buildPatientMedications(records);
  }

  return medications;
}

async function getPatientMetrics(
  id: string
): Promise<ArrayLike<PatientMetric>> {
  let metrics: ArrayLike<PatientMetric> = [];
  const sql = `select * from patient_metric where patient_id = ${id};`;

  const records = await dbRequest(sql)
    .then((r) => r)
    .catch((err) => console.error(err));

  if (records && records.length > 0) {
    metrics = buildPatientMetrics(records);
  }

  return metrics;
}

async function getPatientNotes(id: string): Promise<ArrayLike<PatientNote>> {
  let notes: ArrayLike<PatientNote> = [];
  const sql = `select * from patient_note where patient_id = ${id};`;

  const records = await dbRequest(sql)
    .then((r) => r)
    .catch((err) => console.error(err));

  if (records && records.length > 0) {
    notes = buildPatientNotes(records);
  }

  return notes;
}

async function getPatients(req: Request, res: Response): Promise<void> {
  const sql =
    'select id, first_name, last_name, birthdate, gender from patient';

  const patients = await dbRequest(sql)
    .then((r) => r)
    .catch((err) => console.error(err)); // todo clearer messages

  if (patients && patients.length > 0) {
    const data = buildPatientsData(patients);
    res.status(200);
    res.json(data);
  } else {
    res.status(404);
    res.json([]);
  }
}

async function postPatient(req: Request, res: Response): Promise<void> {
  const firstName = sqlParen(req.body.firstName);
  const lastName = sqlParen(req.body.lastName);
  const birthdate = sqlParen(req.body.birthdate);
  const gender = sqlParen(req.body.gender);
  const email = sqlParen(req.body.email) ?? null;
  const height = req.body.height ?? null;
  const country = sqlParen(req.body.country);
  const { mobile, nativeLanguage, nativeLiteracy, smoker, zipCode5 } = req.body;

  let columns = `first_name, last_name, birthdate, gender, email, height, country`;
  const values: Array<string | number | boolean> = [
    firstName,
    lastName,
    birthdate,
    gender,
    email,
    height,
    country,
  ];

  if (smoker) {
    columns += ', smoker';
    values.push(smoker);
  }

  if (mobile) {
    columns += ', mobile';
    values.push(sqlParen(mobile));
  }

  if (nativeLanguage) {
    columns += ', native_language';
    values.push(sqlParen(nativeLanguage));
  }

  if (nativeLiteracy) {
    columns += ', native_literacy';
    values.push(sqlParen(nativeLiteracy));
  }

  if (zipCode5) {
    columns += ', zip_code_5';
    values.push(sqlParen(zipCode5));
  }

  const sql = `insert into patient (${columns}) values (${values}) returning id`;

  const records = await dbRequest(sql)
    .then((r) => r)
    .catch((e) => {
      console.error(e);
      res.status(400);
      res.json({});
    });

  if (records && records[0] && records[0][0]) {
    const id = records[0][0].longValue;
    res.status(201);
    res.json({ id });
  } else {
    res.status(400);
    res.json({});
  }
}

async function postPatientCondition(
  req: Request,
  res: Response
): Promise<void> {
  const patientId = req.body.patientId; // todo validate
  const conditionId = req.body.conditionId; // todo validate

  const sql = `insert into patient_condition (patient_id, condition_id) values (${patientId}, ${conditionId});`;

  await dbRequest(sql)
    .then((_) => {
      res.status(201);
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
    });

  res.json({});
}

async function postPatientMedication(
  req: Request,
  res: Response
): Promise<void> {
  const patientId = req.body.patientId; // todo validate
  const medicationId = req.body.medicationId; // todo validate

  const sql = `insert into patient_medication (patient_id, medicationId) values (${patientId}, ${medicationId});`;

  await dbRequest(sql)
    .then((_) => {
      res.status(201);
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
    });

  res.json({});
}

async function postPatientMetric(req: Request, res: Response): Promise<void> {
  const patientId = req.body.patientId; // todo validate
  const metricId = req.body.metricId; // todo validate
  const value = req.body.value; // todo validate

  const sql = `insert into patient_metric (patient_id, metricId, value) values (${patientId}, ${metricId}, ${value});`;

  await dbRequest(sql)
    .then((_) => {
      res.status(201);
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
    });

  res.json({});
}

async function postPatientNote(req: Request, res: Response): Promise<void> {
  const patientId = req.body.patientId; // todo validate
  const note = sqlParen(req.body.note).trim(); // todo validate

  const sql = `insert into patient_note (patient_id, note) values (${patientId}, ${note});`;

  await dbRequest(sql)
    .then((_) => {
      res.status(201);
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
    });

  res.json({});
}

async function putPatientMetric(req: Request, res: Response): Promise<void> {
  const id = req.body.id; // todo validate
  const value = req.body.value; // todo validate

  const sql = `update patient_metric set value = ${value} where id = ${id};`;

  await dbRequest(sql)
    .then((_) => {
      res.status(200);
    })
    .catch((e) => {
      res.status(400);
      console.error(e);
    });

  res.json({});
}

async function putPatientNote(req: Request, res: Response): Promise<void> {
  const id = req.body.id; // todo validate
  const note = sqlParen(req.body.categoryId).trim(); // todo validate

  const sql = `update patient_note set note = ${note} where id = ${id};`;

  await dbRequest(sql)
    .then((_) => {
      res.status(200);
    })
    .catch((e) => {
      res.status(400);
      console.error(e);
    });

  res.json({});
}

async function deletePatient(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  const sql = `delete from patient where id = ${id}`;

  await dbRequest(sql)
    .then((_) => {
      res.status(200);
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
    });
  res.json({});
}

async function deletePatientCondition(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id;
  const sql = `delete from patient_condition where id = ${id}`;

  await dbRequest(sql)
    .then((_) => {
      res.status(200);
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
    });
  res.json({});
}

async function deletePatientMedication(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id;
  const sql = `delete from patient_medication where id = ${id}`;

  await dbRequest(sql)
    .then((_) => {
      res.status(200);
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
    });
  res.json({});
}

async function deletePatientMetric(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  const sql = `delete from patient_metric where id = ${id}`;

  await dbRequest(sql)
    .then((_) => {
      res.status(200);
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
    });
  res.json({});
}

async function deletePatientNote(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  const sql = `delete from patient_note where id = ${id}`;

  await dbRequest(sql)
    .then((_) => {
      res.status(200);
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
    });
  res.json({});
}

function buildPatientConditions(
  records: FieldList[]
): ArrayLike<PatientCondition> {
  return records?.map((pc: FieldList) => {
    const id = getFieldValue(pc, PC.ID) as number;
    const conditionId = getFieldValue(pc, PC.CONDITION_ID) as number;
    const patientId = getFieldValue(pc, PC.PATIENT_ID) as number;
    const createdAt = getFieldValue(pc, PC.CREATED_AT) as string;
    const modifiedAt = getFieldValue(pc, PC.MODIFIED_AT) as string;

    const patientCondition: PatientCondition = {
      id,
      conditionId,
      patientId,
      createdAt,
      modifiedAt,
    };
    return patientCondition;
  });
}

function buildPatientMedications(
  records: FieldList[]
): ArrayLike<PatientMedication> {
  return records?.map((pm: FieldList) => {
    const id = getFieldValue(pm, PMed.ID) as number;
    const medicationId = getFieldValue(pm, PMed.MEDICATION_ID) as number;
    const patientId = getFieldValue(pm, PMed.PATIENT_ID) as number;
    const createdAt = getFieldValue(pm, PMed.CREATED_AT) as string;
    const modifiedAt = getFieldValue(pm, PMed.MODIFIED_AT) as string;

    const patientMedication: PatientMedication = {
      id,
      medicationId,
      patientId,
      createdAt,
      modifiedAt,
    };
    return patientMedication;
  });
}

function buildPatientMetrics(records: FieldList[]): ArrayLike<PatientMetric> {
  return records?.map((pm: FieldList) => {
    const id = getFieldValue(pm, PMet.ID) as number;
    const metricId = getFieldValue(pm, PMet.METRIC_ID) as number;
    const value = getFieldValue(pm, PMet.VALUE) as string;
    const patientId = getFieldValue(pm, PMet.PATIENT_ID) as number;
    const createdAt = getFieldValue(pm, PMet.CREATED_AT) as string;
    const modifiedAt = getFieldValue(pm, PMet.MODIFIED_AT) as string;

    const patientMetric: PatientMetric = {
      id,
      metricId,
      patientId,
      value,
      createdAt,
      modifiedAt,
    };
    return patientMetric;
  });
}

function buildPatientNotes(records: FieldList[]): ArrayLike<PatientNote> {
  return records?.map((pm: FieldList) => {
    const id = getFieldValue(pm, PNote.ID) as number;
    const note = getFieldValue(pm, PNote.NOTE) as string;
    const patientId = getFieldValue(pm, PNote.PATIENT_ID) as number;
    const createdAt = getFieldValue(pm, PNote.CREATED_AT) as string;
    const modifiedAt = getFieldValue(pm, PNote.MODIFIED_AT) as string;

    const patientNote: PatientNote = {
      id,
      note,
      patientId,
      createdAt,
      modifiedAt,
    };
    return patientNote;
  });
}

function buildPatientData(p: FieldList): Patient {
  const id = getFieldValue(p, Pat.ID) as number;
  const firstName = getFieldValue(p, Pat.FIRST_NAME) as string;
  const lastName = getFieldValue(p, Pat.LAST_NAME) as string;
  const birthdate = getFieldValue(p, Pat.BIRTHDATE) as string;
  const gender = getFieldValue(p, Pat.GENDER) as string;
  const email = getFieldValue(p, Pat.EMAIL) as string;
  const height = getFieldValue(p, Pat.HEIGHT) as string;
  const mobile = getFieldValue(p, Pat.MOBILE) as string;
  const map = getFieldValue(p, Pat.MAP) as boolean;
  const country = getFieldValue(p, Pat.COUNTRY) as string;
  const nativeLanguage = getFieldValue(p, Pat.NATIVE_LANGUAGE) as string;
  const nativeLiteracy = getFieldValue(p, Pat.NATIVE_LITERACY) as string;
  const smoker = getFieldValue(p, Pat.SMOKER) as boolean;

  return {
    id,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    birthdate,
    gender,
    email,
    height,
    mobile,
    map,
    country,
    nativeLanguage,
    nativeLiteracy,
    smoker,
  };
}

function buildPatientsData(records: FieldList[]): ArrayLike<PatientListRecord> {
  return records?.map((p: FieldList) => {
    const id = getFieldValue(p, Pats.ID) as number;
    const firstName = getFieldValue(p, Pats.FIRST_NAME) as string;
    const lastName = getFieldValue(p, Pats.LAST_NAME) as string;
    const birthdate = getFieldValue(p, Pats.BIRTHDATE) as string;
    const gender = getFieldValue(p, Pats.GENDER) as string;

    const patientListRecord: PatientListRecord = {
      id,
      firstName,
      lastName,
      birthdate,
      gender,
    };

    return patientListRecord;
  });
}

export {
  deletePatient,
  deletePatientCondition,
  deletePatientMedication,
  deletePatientMetric,
  deletePatientNote,
  getPatient,
  getPatients,
  postPatient,
  postPatientCondition,
  postPatientMedication,
  postPatientMetric,
  postPatientNote,
  putPatientMetric,
  putPatientNote,
};
