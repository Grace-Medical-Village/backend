import { Request, Response } from 'express';
import { Con, Condition } from '../../types';
import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import { dbRequest, getFieldValue } from '../../utils/db';

async function getConditions(req: Request, res: Response): Promise<void> {
  const sql = 'select id, condition_name from condition;';

  const records = await dbRequest(sql)
    .then((r) => r)
    .catch((err) => console.error(err));
  if (records && records.length > 0) {
    const data = buildConditionData(records);
    res.status(200);
    res.json(data);
  } else {
    res.status(404);
    res.json([]);
  }
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
