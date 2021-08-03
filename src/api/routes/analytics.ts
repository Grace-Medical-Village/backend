import { Request, Response } from 'express';
import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import { dbRequest, getFieldValue } from '../../utils/db';
import { MapPatient } from '../../types';

async function getPatientCount(req: Request, res: Response): Promise<void> {
  let sql = 'select count(*) from patient;';

  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  if (startDate && endDate) {
    sql = sql.replace(
      ';',
      ` where created_at >= '${startDate}' and created_at <= '${endDate}';`
    );
  }

  await dbRequest(sql)
    .then((r) => {
      const patientCount = buildCount(r);

      if (patientCount >= 0) {
        res.status(200);
        res.json({
          patientCount,
        });
      } else {
        res.status(404);
        res.json({
          patientCount,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json({});
    });
}

async function getMapPatientCount(req: Request, res: Response): Promise<void> {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  if (!startDate) {
    startDate = new Date(0).toISOString();
  }
  if (!endDate) {
    endDate = new Date('2500-01-01').toISOString(); // TODO - refactor
  }

  const sql = `
    select count(distinct p.id)
    from patient p
             left join patient_condition pc on p.id = pc.patient_id
             left join condition c on pc.condition_id = c.id
    where p.created_at >= '${startDate}'
      and p.created_at <= '${endDate}'
      and (lower(condition_name) like '%asthma%'
        or lower(condition_name) like '%diabetes%'
        or lower(condition_name) like '%cholesterol%'
        or lower(condition_name) like '%hypertension%');
  `;

  await dbRequest(sql)
    .then((r) => {
      const patientCount = buildCount(r);

      if (patientCount >= 0) {
        res.status(200);
        res.json({
          patientCount,
        });
      } else {
        res.status(404);
        res.json({
          patientCount,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json({});
    });
}

async function getMapPatients(req: Request, res: Response): Promise<void> {
  const sql = `
    select distinct p.id, p.first_name, p.last_name, p.birthdate, p.created_at
    from patient p
             left join patient_condition pc on p.id = pc.patient_id
             left join condition c on pc.condition_id = c.id
    where lower(c.condition_name) like '%asthma%'
       or lower(c.condition_name) like '%diabetes%'
       or lower(c.condition_name) like '%cholesterol%'
       or lower(c.condition_name) like '%hypertension%';
  `;

  await dbRequest(sql)
    .then((patients) => {
      const data = buildMapPatientsData(patients);
      if (data.length > 0) res.status(200);
      else res.status(404);

      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json([]);
    });
}

function buildCount(records: FieldList[]): number {
  let patientCount = -1;
  if (records.length === 1) {
    const count = getFieldValue(records[0], 0);
    if (count && typeof count === 'number' && count >= 0) {
      patientCount = count;
    }
  }
  return patientCount;
}

function buildMapPatientsData(records: FieldList[]): MapPatient[] {
  return records.map((rec) => {
    const id = getFieldValue(rec, 0) as number;
    const firstName = getFieldValue(rec, 1) as string;
    const lastName = getFieldValue(rec, 2) as string;
    const birthdate = getFieldValue(rec, 3) as string;
    const createdAt = getFieldValue(rec, 4) as string;

    return {
      id,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      birthdate,
      createdAt,
    };
  });
}

export { buildCount, getMapPatients, getMapPatientCount, getPatientCount };
