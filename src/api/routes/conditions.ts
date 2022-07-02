import { Request, Response } from 'express';
import { db } from '../../utils/db';

async function getConditions(req: Request, res: Response): Promise<void> {
  const sql =
    'select id, condition_name from condition order by condition_name;';

  await db
    .executeStatementRefactor(sql)
    .then((data) => {
      if (data.length > 0) res.status(200);
      else res.status(404);
      res.json(data);
    })
    .catch((e) => {
      res.status(e?.statusCode ?? 500);
      res.json([]);
      console.error(e);
    });
}

export { getConditions };
