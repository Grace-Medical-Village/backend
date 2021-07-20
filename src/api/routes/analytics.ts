import { Request, Response } from 'express';
import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import { dbRequest, getFieldValue } from '../../utils/db';

async function getPatientCount(req: Request, res: Response): Promise<void> {
  const sql = 'select count(*) from patient';

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
  const sql = `
    select count(distinct patient_id)
    from patient_condition pc
             left join (
        select id
        from condition
        where lower(condition_name) like '%asthma%'
           or lower(condition_name) like '%diabetes%'
           or lower(condition_name) like '%cholesterol%'
           or lower(condition_name) like '%hypertension%'
        order by condition_name
    ) c
                       on pc.condition_id = c.id;`;

  await dbRequest(sql)
    .then((r) => {
      const patientCount = buildCount(r);

      if (patientCount >= 0) {
        res.status(200);
        res.json({
          healthy: true,
          patientCount,
        });
      } else {
        res.status(404);
        res.json({
          healthy: false,
          patientCount,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json({
        healthy: false,
      });
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

export { buildCount, getMapPatientCount, getPatientCount };
