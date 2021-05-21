import { Request, Response } from 'express';
// import { dbRequest, getFieldValue } from '../../utils/db';
// import { FieldList } from 'aws-sdk/clients/rdsdataservice';
// import { Condition, Con } from '../../types';

// async function getConditions(req: Request, res: Response): Promise<void> {
function getConditions(req: Request, res: Response): void {
  const sql = 'select id, condition_name from condition;';

  res.status(200);
  res.json({ sql });

  // const records = await dbRequest(sql)
  //   .then((r) => r)
  //   .catch((err) => console.error(err));

  // if (records && records.length > 0) {
  //   const data = buildConditionData(records);
  //   res.status(200);
  //   res.json(data);
  // } else {
  //   res.status(404);
  //   res.json([]);
  // }
}

// function buildConditionData(records: FieldList[]): Condition[] {
//   return records?.map((c: FieldList) => {
//     const id = getFieldValue(c, Con.ID) as number;
//     const conditionName = getFieldValue(c, Con.CONDITION_NAME) as string;
//
//     const condition: Condition = {
//       id,
//       conditionName,
//     };
//
//     return condition;
//   });
// }

export { getConditions };
