import { Request, Response } from 'express';
import { Con, Condition } from '../../types';
import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import { dbRequest, getFieldValue } from '../../utils/db';

async function getConditions(req: Request, res: Response): Promise<void> {
  const sql = 'select id, condition_name from condition;';

  await dbRequest(sql)
    .then((r) => {
      const data = buildConditionData(r);
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

function buildConditionData(records: FieldList[]): Condition[] {
  return records?.map((c: FieldList) => {
    const id = getFieldValue(c, Con.ID) as number;
    const conditionName = getFieldValue(c, Con.CONDITION_NAME) as string;

    const condition: Condition = {
      id,
      conditionName,
    };

    return condition;
  });
}

export { getConditions };
