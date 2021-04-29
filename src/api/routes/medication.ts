import { Request, Response } from 'express';
import {
  ExecuteStatementResponse,
  FieldList,
} from 'aws-sdk/clients/rdsdataservice';
import { Med, Medication, T } from '../../types';
import { getData } from '../../utils/db';

async function getMedications(req: Request, res: Response): Promise<void> {
  console.log('medication.10');
  const sql =
    'select m.*, mc.name category_name from medication m join medication_category mc on m.category_id = mc.id;';

  const result = await getData(sql);
  console.log('medication.15');

  const data = buildMedicationData(result);
  console.log('medication.18');

  res.status(200);
  res.json(data);
  console.log('medication.23');
}

function buildMedicationData(
  queryResult: ExecuteStatementResponse
): Medication[] {
  return queryResult.records?.map((med: FieldList) => {
    console.log(med);
    const id = med[Med.ID][T.NUMBER];
    const name = med[Med.NAME][T.STRING];
    const strength = med[Med.STRENGTH][T.STRING];
    const categoryId = med[Med.ID][T.NUMBER];
    const categoryName = med[Med.CATEGORY_NAME][T.STRING];
    const createdAt = med[Med.CREATED_AT][T.STRING];
    const modifiedAt = med[Med.MODIFIED_AT][T.STRING];

    const medication: Medication = {
      id,
      name,
      strength,
      categoryId,
      categoryName,
      createdAt,
      modifiedAt,
    };

    console.log('medication.48');
    return medication;
  });
}

export { buildMedicationData, getMedications };
