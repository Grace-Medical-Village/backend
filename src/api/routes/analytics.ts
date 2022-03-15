import { Request, Response } from 'express';
import { db } from '../../utils/db';
import { AnalyticsCount } from '../../types';

async function getPatientCount(req: Request, res: Response): Promise<void> {
  const { startDate, endDate } = getStartAndEndDate(req);

  if (startDate > endDate) {
    res.status(400);
    res.json({});
    return;
  }

  let sql = 'select count(*) from patient;';

  if (startDate && endDate) {
    sql = sql.replace(
      ';',
      ` where created_at >= '${startDate}' and created_at <= '${endDate}';`
    );
  }

  await db
    .executeStatementRefactor(sql)
    .then((queryResult) => {
      const data = queryResult as AnalyticsCount[];
      let patientCount = 0;
      if (data.length === 1 && data[0].count) {
        patientCount = data[0].count;
      }

      if (patientCount > 0) res.status(200);
      else res.status(404);
      res.json({
        patientCount,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json({});
    });
}

async function getMapPatientCount(req: Request, res: Response): Promise<void> {
  const { startDate, endDate } = getStartAndEndDate(req);

  if (startDate > endDate) {
    res.status(400);
    res.json({});
    return;
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

  await db
    .executeStatementRefactor(sql)
    .then((queryResult) => {
      const data = queryResult as AnalyticsCount[];

      if (data.length > 0) {
        res.status(200);
        res.json({
          patientCount: data[0].count,
        });
      } else {
        res.status(404);
        res.json({ patientCount: 0 });
      }
    })
    .catch((err) => {
      res.status(500);
      res.json({});
      console.error(err);
    });
}

async function getMapPatients(req: Request, res: Response): Promise<void> {
  const { startDate, endDate } = getStartAndEndDate(req);

  if (startDate > endDate) {
    res.status(400);
    res.json([]);
    return;
  }

  let sql = `
    select distinct p.id, p.first_name, p.last_name, p.birthdate, p.created_at
    from patient p
             left join patient_condition pc on p.id = pc.patient_id
             left join condition c on pc.condition_id = c.id
    where lower(c.condition_name) like '%asthma%'
       or lower(c.condition_name) like '%diabetes%'
       or lower(c.condition_name) like '%cholesterol%'
       or lower(c.condition_name) like '%hypertension%';
  `;

  if (startDate && endDate) {
    sql = `
      select distinct p.id, p.first_name, p.last_name, p.birthdate, p.created_at
        from patient p
                 left join patient_condition pc on p.id = pc.patient_id
                 left join condition c on pc.condition_id = c.id
      where (lower(c.condition_name) like '%asthma%'
          or lower(c.condition_name) like '%diabetes%'
          or lower(c.condition_name) like '%cholesterol%'
          or lower(c.condition_name) like '%hypertension%')
        and (p.created_at >= '${startDate}' and p.created_at <= '${endDate}');
    `;
  }

  await db
    .executeStatementRefactor(sql)
    .then((data) => {
      if (data.length > 0) res.status(200);
      else res.status(404);
      res.json(data);
    })
    .catch((err) => {
      res.status(500);
      res.json([]);
      console.error(err);
    });
}

function getStartAndEndDate(req: Request) {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;

  if (!startDate) {
    startDate = new Date(0).toISOString();
  }
  if (!endDate) {
    endDate = new Date('2500-01-01').toISOString();
  }

  return { startDate, endDate };
}

export { getMapPatientCount, getMapPatients, getPatientCount };
