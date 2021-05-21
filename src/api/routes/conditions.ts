import { Request, Response } from 'express';
import { dbRequest, getFieldValue } from '../../utils/db';
import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import { Condition, Con } from '../../types';

async function getConditions(req: Request, res: Response): Promise<void> {
  const sql = 'select id, condition_name from condition;';
  console.log(8);

  const records = await dbRequest(sql)
    .then((r) => r)
    .catch((err) => console.error(err)); // todo clearer messages

  console.log(14);
  if (records && records.length > 0) {
    const data = buildConditionData(records);
    console.log(17);
    console.log(19);
    res.status(200);
    res.json(JSON.stringify(data));
  } else {
    console.log(23);
    res.status(404);
    res.json(JSON.stringify([]));
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
