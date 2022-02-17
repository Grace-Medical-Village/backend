import { Request, Response } from 'express';
import { dbRequest, sqlParen } from '../../utils/db';
import {
  PatientAllergies,
  PatientCondition,
  PatientMedication,
  PatientMetric,
  PatientNote,
} from '../../types';
import { isIntegerGreaterThanZero, validate } from '../../utils';
import { dataBuilder } from '../../utils/data-builder';

async function getPatient(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  if (!id || !isIntegerGreaterThanZero(id)) {
    res.status(400);
    res.json({
      error: 'patient ID provided must be an integer and greater than 0',
    });
    return;
  }

  const sql = `select *
               from patient
               where id = ${id}`;

  const records = await dbRequest(sql).then((r) => r);

  if (records && records.length === 1) {
    const allergies = await getPatientAllergies(id).then((r) => r);
    const conditions = await getPatientConditions(id).then((r) => r);
    const medications = await getPatientMedications(id).then((r) => r);
    const metrics = await getPatientMetrics(id).then((r) => r);
    const notes = await getPatientNotes(id).then((r) => r);
    const patient = dataBuilder.buildPatientData(records[0]);

    res.status(200);
    res.json({
      allergies,
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

async function getPatientAllergies(
  id: string
): Promise<Partial<PatientAllergies>> {
  let allergies: Partial<PatientAllergies> = {};
  const sql = `select pa.*
               from patient_allergy pa
               where patient_id = ${id} limit 1;
  `;

  await dbRequest(sql).then((r) => {
    if (r.length === 1) {
      allergies = dataBuilder.buildPatientAllergies(r[0]);
    }
  });

  return allergies;
}

async function getPatientConditions(
  patientId: string
): Promise<ArrayLike<PatientCondition>> {
  let conditions: ArrayLike<PatientCondition> = [];

  if (!patientId) return conditions;

  const sql = `select pc.*, c.condition_name
               from patient_condition pc
                        inner join condition c on pc.condition_id = c.id
               where patient_id = ${patientId};
  `;
  await dbRequest(sql).then((r) => {
    conditions = dataBuilder.buildPatientConditions(r);
  });

  return conditions;
}

async function getPatientMedications(
  patientId: string
): Promise<ArrayLike<PatientMedication>> {
  let medications: ArrayLike<PatientMedication> = [];

  if (!patientId) return medications;

  const sql = `select *
               from patient_medication
               where patient_id = ${patientId}
               order by created_at desc;`;

  await dbRequest(sql).then((r) => {
    medications = dataBuilder.buildPatientMedications(r);
  });

  return medications;
}

async function getPatientMetrics(
  patientId: string
): Promise<ArrayLike<PatientMetric>> {
  let metrics: ArrayLike<PatientMetric> = [];

  if (!patientId) return metrics;

  const sql = `select *
               from patient_metric
               where patient_id = ${patientId}
               order by created_at desc;`;

  await dbRequest(sql).then((r) => {
    metrics = dataBuilder.buildPatientMetrics(r);
  });

  return metrics;
}

async function getPatientNotes(
  patientId: string
): Promise<ArrayLike<PatientNote>> {
  let notes: ArrayLike<PatientNote> = [];

  if (!patientId) return notes;

  const sql = `select *
               from patient_note
               where patient_id = ${patientId}
               order by created_at desc;`;

  await dbRequest(sql).then((r) => {
    notes = dataBuilder.buildPatientNotes(r);
  });

  return notes;
}

async function getPatients(req: Request, res: Response): Promise<void> {
  let sql = `
      with p as (
          select id,
                 first_name,
                 last_name,
                 first_name || ' ' || last_name as "full_name",
                 birthdate,
                 gender
          from patient
          where archive = false
      )
      select *
      from p
  `;

  if (req?.query?.name) {
    const { name } = req.query;
    const nameSearch = `lower('%${name}%')`;
    sql += ` where lower(full_name) like ${nameSearch}`;
  } else if (req?.query?.birthdate) {
    const { birthdate } = req.query;
    if (typeof birthdate === 'string') {
      sql += ` where birthdate = '${birthdate}'`;
    }
  } else {
    // todo -> error message
    res.status(400);
    res.json([]);
    return;
  }

  await dbRequest(sql).then((patients) => {
    const data = dataBuilder.buildPatientsData(patients);
    if (data.length > 0) res.status(200);
    else res.status(404);

    res.json(data);
  });
  // todo
  // .catch((e) => {
  //   res.status(e?.statusCode ?? 500);
  //   res.json([]);
  //   console.error(e);
  // });
}

async function postPatient(req: Request, res: Response): Promise<void> {
  const firstName = sqlParen(req.body.firstName);
  const lastName = sqlParen(req.body.lastName);
  const birthdate = sqlParen(req.body.birthdate);
  const gender = sqlParen(req.body.gender);
  const country = sqlParen(req.body.country);
  const { mobile, nativeLanguage, nativeLiteracy, smoker, zipCode5 } = req.body;

  let columns = `first_name, last_name, birthdate, gender, country`;
  const values: Array<string | number | boolean> = [
    firstName,
    lastName,
    birthdate,
    gender,
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

  const sql = `insert into patient (${columns})
               values (${values}) returning id`;

  await dbRequest(sql)
    .then((r) => {
      if (r && r[0]) {
        const id = r[0][0].longValue;
        res.status(201);
        res.json({ id });
      } else {
        res.status(400);
        res.json({});
      }
    })
    .catch((e) => {
      if (e.message.match(/already exists/i)) res.status(409);
      else res.status(500);
      res.json({});
      console.error(e);
    });
}

async function postPatientAllergies(
  req: Request,
  res: Response
): Promise<void> {
  const patientId = req.body?.patientId ?? null;
  const allergies = req.body.allergies ? req.body.allergies.trim() : null;

  if (!patientId) {
    res.status(400);
    res.json({ error: "'patientId' required in request body" });
    return;
  }

  if (!allergies) {
    res.status(400);
    res.json({ error: "'allergies' required in request body" });
    return;
  }

  const sql = `
      insert into patient_allergy (patient_id, allergy)
      values (${patientId}, '${allergies}') returning id;
  `;

  await dbRequest(sql)
    .then((r) => {
      const id = r[0][0].longValue;
      res.status(201);
      res.json({ id });
    })
    .catch((e) => {
      console.error(e);
      res.status(500);
      res.json({});
    });
}

async function postPatientCondition(
  req: Request,
  res: Response
): Promise<void> {
  const patientId = req.body.patientId;
  const conditionId = req.body.conditionId;

  if (!patientId || !conditionId) {
    res.status(400);
    res.json({});
    return;
  }

  const sql = `
      insert into patient_condition (patient_id, condition_id)
      values (${patientId}, ${conditionId}) returning id;
  `;

  await dbRequest(sql).then((r) => {
    if (r[0]) {
      const id = r[0][0].longValue;
      res.status(201);
      res.json({ id });
    } else {
      res.status(400);
      res.json({});
    }
  });
  // todo
  // .catch((e) => {
  //   console.error(e);
  // });
}

async function postPatientMedication(
  req: Request,
  res: Response
): Promise<void> {
  const patientId = req.body.patientId;
  const medicationId = req.body.medicationId;

  if (!patientId || !medicationId) {
    res.status(400);
    res.json({});
    return;
  }

  const sql = `
      insert into patient_medication (patient_id, medication_id)
      values (${patientId}, ${medicationId}) returning id, created_at, modified_at;
  `;

  await dbRequest(sql)
    .then((r) => {
      if (r[0]) {
        const id = r[0][0].longValue;
        const createdAt = r[0][1].stringValue;
        const modifiedAt = r[0][2].stringValue;
        res.status(201);
        res.json({ id, createdAt, modifiedAt });
      } else {
        res.status(400);
        res.json({});
      }
    })
    .catch((e) => {
      res.status(500);
      res.json({});
      console.error(e);
    });
}

async function postPatientMetric(req: Request, res: Response): Promise<void> {
  const patientId = req.body.patientId;
  const metricId = req.body.metricId;
  const value = req.body.value ? req.body.value.trim() : ''; // todo what if not string?
  const comment = req.body.comment ? req.body.comment.trim() : '';

  const validMetric = await validate(metricId, value);

  if (validMetric.isValid && validMetric.metric) {
    const sql = `
        insert into patient_metric (patient_id, metric_id, value, comment)
        values (${patientId}, ${metricId}, '${validMetric.metric}', '${comment}') returning id, created_at, modified_at;
    `;

    await dbRequest(sql)
      .then((r) => {
        if (r[0]) {
          const id = r[0][0].longValue;
          const createdAt = r[0][1].stringValue;
          const modifiedAt = r[0][2].stringValue;
          res.status(201);
          res.json({ id, createdAt, modifiedAt });
        } else {
          res.status(400);
          res.json({});
        }
      })
      .catch((e) => {
        res.status(400);
        res.json({});
        console.error(e);
      });
  } else {
    res.status(400);
    res.json({
      error: `${validMetric?.error ?? 'Metric provided is invalid'}`,
    });
  }
}

async function postPatientNote(req: Request, res: Response): Promise<void> {
  const patientId = req.body?.patientId ?? null;
  const note = req.body.note ? req.body.note.trim() : '';

  if (!patientId || !note) {
    res.status(400);
    res.json({
      error: 'patientId and note required in request body to save patient note',
    });
    return;
  }

  const sql = `
      insert into patient_note (patient_id, note)
      values (${patientId}, '${note}') returning id, note, created_at, modified_at;
  `;

  await dbRequest(sql)
    .then((r) => {
      if (r[0]) {
        const id = r[0][0].longValue;
        const createdAt = r[0][1].stringValue;
        const modifiedAt = r[0][2].stringValue;
        res.status(201);
        res.json({ id, note, createdAt, modifiedAt });
      } else {
        res.status(400);
        res.json({});
      }
    })
    .catch((e) => {
      res.status(e?.statusCode ?? 500);
      // todo -> error message
      console.error(e);
    });
}

async function putPatient(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  const zipCode5 = req.body.zipCode5 ? req.body.zipCode5 : '';

  const updates = `
    first_name = '${req.body.firstName}',
    last_name = '${req.body.lastName}',
    birthdate = '${req.body.birthdate}',
    gender = '${req.body.gender}',
    country = '${req.body.country}',
    mobile = '${req.body.mobile}',
    native_language = '${req.body.nativeLanguage}',
    native_literacy = ${req.body.nativeLiteracy},
    zip_code_5 = '${zipCode5}',
    smoker = '${req.body.smoker}'
  `;

  const sql = `update patient
               set ${updates}
               where id = ${id};`;

  // TODO 409 if patient already exists
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

async function putPatientAllergies(req: Request, res: Response): Promise<void> {
  const id = req.params?.id ?? null;
  const allergies = req.body?.allergies ?? null;

  if (!id) {
    res.status(400);
    res.json({ error: "'id' path parameter required" });
    return;
  }

  if (!allergies) {
    res.status(400);
    res.json({ error: "'allergies' required in request body" });
    return;
  }

  const sql = `
      update patient_allergy
      set allergy = '${allergies}'
      where id = ${id};
  `;

  await dbRequest(sql)
    .then((_) => {
      res.status(200);
      res.json({});
    })
    .catch((e) => {
      res.status(e?.statusCode ?? 500);
      res.json({});
      console.error(e);
    });
}

async function putPatientArchive(req: Request, res: Response): Promise<void> {
  const id = req.params?.id ?? null;
  const archive = req.body?.archive ?? null;

  if (!id || !isIntegerGreaterThanZero(id)) {
    res.status(400);
    res.json({
      error: 'patient ID provided must be an integer and greater than 0',
    });
    return;
  }

  if (archive === null) {
    res.status(400);
    res.json({
      error: "'archive' not provided in request body",
    });
    return;
  }

  const sql = `update patient
               set archive = ${archive}
               where id = ${id};`;

  await dbRequest(sql).then((_) => {
    res.status(200);
    res.json({ archive });
  });
  // TODO test catch
  // .catch((e) => {
  //   res.status(500);
  //   res.json({});
  //   console.error(e);
  // });
}

// async function putPatientMetric(req: Request, res: Response): Promise<void> {
//   const metricId = req.params.id;
//   const value = req.body.value;
//
//   const sql = `update patient_metric
//                set value = ${value}
//                where id = ${metricId};`;
//
//   await dbRequest(sql)
//     .then((_) => {
//       res.status(200);
//     })
//     .catch((e) => {
//       res.status(400);
//       console.error(e);
//     });
//
//   res.json({});
// }

async function putPatientNote(req: Request, res: Response): Promise<void> {
  const noteId = req.params.noteId;
  const note = req.body.note ? req.body.note.trim() : null;

  if (!noteId || !isIntegerGreaterThanZero(noteId)) {
    res.status(400);
    res.json({ error: '"noteId" path parameter required' });
    return;
  }

  if (!note) {
    res.status(400);
    res.json({
      error:
        '"note" must be provided in the request body and it cannot be empty',
    });
    return;
  }

  const sql = `update patient_note
               set note = '${note}'
               where id = ${noteId};`;

  await dbRequest(sql).then((_) => {
    res.status(200);
    res.json({});
    // TODO return the updated note + trim
  });
  // TODO test catch
  // .catch((e) => {
  //   res.status(e?.statusCode ?? 500);
  //   res.json({});
  //   console.error(e);
  // });
}

// TODO
// async function mergePatients(req: Request, res: Response): Promise<void> {
//   const patientId: string | null = req.params?.patientId ?? null;
//   const patientIdToArchive: string | null =
//     req.params?.patientIdToArchive ?? null;
//
//   if (!patientId || !patientIdToArchive) {
//     res.status(400);
//     res.json({
//       error: `patientId provided was ${patientId} and patientIdToArchive was ${patientIdToArchive}`,
//     });
//   }
//
//   const re = new RegExp(/^\d+$/);
//   if (!re.test(patientId) || !re.test(patientIdToArchive)) {
//     res.status(400);
//     res.json({
//       error: 'patientId or patientIdToArchive provided are not numbers',
//     });
//   }
//
//   const transactionId = await beginTransaction().then((id) => id);
//
//   if (transactionId) {
//     const tables = [
//       'patient_allergy',
//       'patient_condition',
//       'patient_medication',
//       'patient_metric',
//       'patient_note',
//     ];
//
//     const patientTableUpdateSql = `
//     update table patient
//       set archived = true
//       where id = ${patientIdToArchive};
//   `;
//
//     const requests = [patientTableUpdateSql];
//     for (const table of tables) {
//       const sql = `
//       update table ${table}
//         set patient_id = ${patientId}
//         where patient_id = ${patientIdToArchive};
//       `;
//       requests.push(sql);
//     }
//
//     for (const request of requests) {
//       await dbRequest(request, transactionId);
//     }
//
//     await commitTransaction(transactionId)
//       .then((r) => {
//         if (r && r.transactionStatus) {
//           res.status(200);
//           res.json({});
//         }
//       })
//       .catch((e) => {
//         console.error(e);
//         res.status(500);
//         res.json({});
//       });
//   } else {
//     res.status(500);
//     res.json({});
//   }
// }

async function deletePatient(req: Request, res: Response): Promise<void> {
  const patientId = req.params.patientId;

  if (!patientId || !isIntegerGreaterThanZero(patientId)) {
    res.status(400);
    res.json({
      error: '"patientId" is a required path parameter',
    });
    return;
  }

  const sql = `delete
               from patient
               where id = ${patientId};
               `;

  // todo -> return id? archive only?
  await dbRequest(sql).then((_) => {
    res.status(200);
    res.json({});
  });
  // TODO test catch
  // .catch((e) => {
  //   res.status(500);
  //   res.json({});
  //   console.error(e);
  // });
}

async function deletePatientAllergy(
  req: Request,
  res: Response
): Promise<void> {
  const patientAllergyId = req.params.patientAllergyId;

  if (!patientAllergyId || !isIntegerGreaterThanZero(patientAllergyId)) {
    res.status(400);
    res.json({
      error: '"patientAllergyId" is a required path parameter',
    });
    return;
  }

  const sql = `delete
               from patient_allergy
               where id = ${patientAllergyId}`;

  await dbRequest(sql).then((_) => {
    res.status(200);
    res.json({});
  });
  // TODO test catch
  // .catch((e) => {
  //   res.status(500);
  //   res.json({});
  //   console.error(e);
  // });
}

async function deletePatientCondition(
  req: Request,
  res: Response
): Promise<void> {
  const patientConditionId = req.params.patientConditionId;

  if (!patientConditionId || !isIntegerGreaterThanZero(patientConditionId)) {
    res.status(400);
    res.json({
      error: '"patientConditionId" is a required path parameter',
    });
    return;
  }

  const sql = `delete
               from patient_condition
               where id = ${patientConditionId}`;

  await dbRequest(sql).then((_) => {
    res.status(200);
    res.json({});
    console.log(sql);
  });
  // TODO test catch
  // .catch((e) => {
  //   res.status(400);
  //   res.json({});
  //   console.error(e);
  // });
}

async function deletePatientMedication(
  req: Request,
  res: Response
): Promise<void> {
  const patientMedicationId = req.params.patientMedicationId;

  if (!patientMedicationId || !isIntegerGreaterThanZero(patientMedicationId)) {
    res.status(400);
    res.json({
      error: '"patientMedicationId" is a required path parameter',
    });
    return;
  }

  const sql = `delete
               from patient_medication
               where id = ${patientMedicationId}`;

  await dbRequest(sql).then((_) => {
    res.status(200);
    res.json({});
  });
  // TODO test catch
  // .catch((e) => {
  //   console.error(e);
  //   res.status(400);
  //   res.json({});
  // });
}

async function deletePatientMetric(req: Request, res: Response): Promise<void> {
  const patientMetricId = req.params.patientMetricId;

  if (!patientMetricId || !isIntegerGreaterThanZero(patientMetricId)) {
    res.status(400);
    res.json({
      error: '"patientMetricId" is a required path parameter',
    });
    return;
  }

  const sql = `delete
               from patient_metric
               where id = ${patientMetricId}`;

  await dbRequest(sql).then((_) => {
    res.status(200);
    res.json({});
  });
  // TODO test catch
  // .catch((e) => {
  //   res.status(400);
  //   res.json({});
  //   console.error(e);
  // });
}

async function deletePatientNote(req: Request, res: Response): Promise<void> {
  const patientNoteId = req.params.patientNoteId;

  if (!patientNoteId || !isIntegerGreaterThanZero(patientNoteId)) {
    res.status(400);
    res.json({
      error: '"patientNoteId" is a required path parameter',
    });
    return;
  }

  const sql = `delete
               from patient_note
               where id = ${patientNoteId}`;

  await dbRequest(sql).then((_) => {
    res.status(200);
    res.json({});
  });
  // TODO test catch
  // .catch((e) => {
  //   res.status(400);
  //   res.json({});
  //   console.error(e);
  // });
}

export {
  deletePatient,
  deletePatientAllergy,
  deletePatientCondition,
  deletePatientMedication,
  deletePatientMetric,
  deletePatientNote,
  getPatient,
  getPatients,
  getPatientAllergies,
  getPatientConditions,
  getPatientMedications,
  getPatientMetrics,
  getPatientNotes,
  postPatient,
  postPatientAllergies,
  postPatientCondition,
  postPatientMedication,
  postPatientMetric,
  postPatientNote,
  putPatient,
  putPatientAllergies,
  putPatientArchive,
  putPatientNote,
};
