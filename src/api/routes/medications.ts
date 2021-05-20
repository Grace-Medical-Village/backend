import { Request, Response } from 'express';
import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import { Med, MedCat, Medication, MedicationCategory } from '../../types';
import { dbRequest, getFieldValue, sqlParen } from '../../utils/db';

async function getMedication(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  const sql = `
   select m.*, mc.name category_name from medication m 
   join medication_category mc on m.category_id = mc.id 
   where m.id = ${id};
  `;

  const records = await dbRequest(sql)
    .then((r) => r)
    .catch((err) => console.error(err));

  if (records && records.length === 1) {
    const data = buildMedicationData(records);
    res.status(200);
    res.json(data[0]);
  } else {
    res.status(404);
    res.json({});
  }
}

async function getMedications(req: Request, res: Response): Promise<void> {
  const sql =
    'select m.*, mc.name category_name from medication m join medication_category mc on m.category_id = mc.id;';

  const records = await dbRequest(sql)
    .then((r) => r)
    .catch((err) => {
      res.status(400);
      console.error(err);
    });

  if (records && records.length > 0) {
    const data = buildMedicationData(records);
    res.status(200);
    res.json(data);
  } else {
    res.status(404);
    res.json([]);
  }
}

async function getMedicationCategories(
  req: Request,
  res: Response
): Promise<void> {
  const sql = 'select * from medication_category';

  const records = await dbRequest(sql)
    .then((r) => r)
    .catch((err) => console.error(err));

  if (records && records.length > 0) {
    const data = buildMedicationCategoryData(records);
    res.status(200);
    res.json(data);
  } else {
    res.status(404);
    res.json([]);
  }
}

async function postMedication(req: Request, res: Response): Promise<void> {
  const categoryId = req.body.categoryId; // todo validate
  const name = sqlParen(req.body.name); // todo validate
  const strength = req.body.strength; // todo validate

  let categories = 'category_id, name';
  const values: number | string[] = [categoryId, name];

  if (strength) {
    categories += ', strength';
    values.push(strength);
  }

  const sql = `insert into medication (${categories}) values (${values});`;

  await dbRequest(sql)
    .then((_) => {
      res.status(201);
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
    });

  res.json({});
}

async function putMedication(req: Request, res: Response): Promise<void> {
  const id = req.body.id; // todo validate
  const categoryId = req.body.categoryId; // todo validate
  const name = sqlParen(req.body.name); // todo validate
  const strength = sqlParen(req.body.strength); // todo validate

  const sql = `update medication set category_id = ${categoryId}, name = ${name}, strength = ${strength} where id = ${id};`;

  await dbRequest(sql)
    .then((_) => {
      res.status(200);
    })
    .catch((e) => {
      res.status(400);
      console.error(e);
    });

  res.json({});
}

async function deleteMedication(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  const sql = `delete from medication where id = ${id}`;

  await dbRequest(sql)
    .then((_) => {
      res.status(200);
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
    });
  res.json({});
}

function buildMedicationData(records: FieldList[]): Medication[] {
  return records?.map((med: FieldList) => {
    const id = getFieldValue(med, Med.ID) as number;
    const name = getFieldValue(med, Med.NAME) as string;
    const strength = getFieldValue(med, Med.STRENGTH) as string;
    const categoryId = getFieldValue(med, Med.CATEGORY_ID) as number;
    const categoryName = getFieldValue(med, Med.CATEGORY_NAME) as string;
    const createdAt = getFieldValue(med, Med.CREATED_AT) as string;
    const modifiedAt = getFieldValue(med, Med.MODIFIED_AT) as string;

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

function buildMedicationCategoryData(
  records: FieldList[]
): MedicationCategory[] {
  return records?.map((med: FieldList) => {
    const id = getFieldValue(med, MedCat.ID) as number;
    const name = getFieldValue(med, MedCat.NAME) as string;
    const createdAt = getFieldValue(med, MedCat.CREATED_AT) as string;
    const modifiedAt = getFieldValue(med, MedCat.MODIFIED_AT) as string;

    const medicationCategory: MedicationCategory = {
      id,
      name,
      createdAt,
      modifiedAt,
    };

    return medicationCategory;
  });
}

export {
  buildMedicationData,
  getMedication,
  getMedications,
  getMedicationCategories,
  postMedication,
  putMedication,
  deleteMedication,
};
