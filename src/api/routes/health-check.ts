import { Request, Response } from 'express';
import { dbRequest } from '../../utils/db';
import { buildCount } from './analytics';

async function getHealthCheck(req: Request, res: Response): Promise<void> {
  const sql = 'select count(*) from patient';

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

export { getHealthCheck };
