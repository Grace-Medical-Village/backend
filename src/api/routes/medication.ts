import { Request, Response } from 'express';
import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import { Med, Medication } from '../../types';
import { getData, getFieldNumber, getFieldString } from '../../utils/db';

async function getMedications(req: Request, res: Response): Promise<void> {
  const sql =
    'select m.*, mc.name category_name from medication m join medication_category mc on m.category_id = mc.id;';

  const records = await getData(sql)
    .then((r) => r)
    .catch((err) => console.error(err));

  if (records && records.length > 0) {
    const data = buildMedicationData(records);
    res.status(200);
    res.json(data);
  } else {
    res.status(404);
    res.json([]);
  }
}

function buildMedicationData(records: FieldList[]): Medication[] {
  return records?.map((med: FieldList) => {
    const id = getFieldNumber(med, Med.ID);
    const name = getFieldString(med, Med.NAME);
    const strength = getFieldString(med, Med.STRENGTH);
    const categoryId = getFieldNumber(med, Med.ID);
    const categoryName = getFieldString(med, Med.CATEGORY_NAME);
    const createdAt = getFieldString(med, Med.CREATED_AT);
    const modifiedAt = getFieldString(med, Med.MODIFIED_AT);

    const medication: Medication = {
      id,
      name,
      strength,
      categoryId,
      categoryName,
      createdAt,
      modifiedAt,
    };

    return medication;
  });
}

export { buildMedicationData, getMedications };
