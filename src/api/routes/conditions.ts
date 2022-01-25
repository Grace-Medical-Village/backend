import { Request, Response } from 'express';
import { dbRequest } from '../../utils/db';
import { dataBuilder } from '../../utils/data-builder';

async function getConditions(req: Request, res: Response): Promise<void> {
  const sql =
    'select id, condition_name from condition order by condition_name;';

  await dbRequest(sql)
    .then((r) => {
      const data = dataBuilder.buildConditionData(r);
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
