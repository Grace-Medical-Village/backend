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

  await dbRequest(sql)
    .then((r) => {
      const data = buildMedicationData(r);
      if (data.length === 1) {
        res.status(200);
        res.json(data[0]);
      } else {
        res.status(404);
        res.json({});
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json({});
    });
}

async function getMedications(req: Request, res: Response): Promise<void> {
  const sql = `
    select m.*, mc.name category_name 
    from medication m 
    join medication_category mc on m.category_id = mc.id
    order by category_name, m.name, m.strength;
  `;

  await dbRequest(sql)
    .then((r) => {
      const data = buildMedicationData(r);
      if (data.length > 0) res.status(200);
      else res.status(404);
      res.json(data);
    })
    .catch((err) => {
      res.status(500);
      res.json([]);
      console.error(err);
    });
}

async function getMedicationCategories(
  req: Request,
  res: Response
): Promise<void> {
  const sql = 'select * from medication_category';

  await dbRequest(sql)
    .then((r) => {
      const data = buildMedicationCategoryData(r);
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

async function postMedication(req: Request, res: Response): Promise<void> {
  const categoryId = req.body.categoryId;
  const name = sqlParen(req.body.name);
  const strength = req.body.strength;

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
      res.status(500);
    });

  res.json({});
}

async function putMedication(req: Request, res: Response): Promise<void> {
  const id = req.body.id;
  const categoryId = req.body.categoryId;
  const archived = req.body.archived;
  const name = sqlParen(req.body.name);
  const strength = sqlParen(req.body.strength);

  const sql = `
    update medication 
    set category_id = ${categoryId}, 
      name = ${name}, 
      strength = ${strength},
      archived = ${archived} 
    where id = ${id};`;

  await dbRequest(sql)
    .then((_) => {
      res.status(200);
    })
    .catch((e) => {
      res.status(500);
      console.error(e);
    });

  res.json({});
}

async function deleteMedication(req: Request, res: Response): Promise<void> {
  const id = req?.params?.id;

  if (id) {
    const sql = `delete from medication where id = ${id}`;

    await dbRequest(sql)
      .then((_) => {
        res.status(200);
      })
      .catch((e) => {
        console.error(e);
        res.status(500);
      });
    res.json({});
  } else {
    res.status(400);
    res.json({ message: `Failed to provide 'id' query parameter` });
  }
}

function buildMedicationData(records: FieldList[]): Medication[] {
  return records?.map((med: FieldList) => {
    const id = getFieldValue(med, Med.ID) as number;
    const name = getFieldValue(med, Med.NAME) as string;
    const strength = getFieldValue(med, Med.STRENGTH) as string;
    const categoryId = getFieldValue(med, Med.CATEGORY_ID) as number;
    const categoryName = getFieldValue(med, Med.CATEGORY_NAME) as string;
    const archived = getFieldValue(med, Med.ARCHIVED) as boolean;
    const createdAt = getFieldValue(med, Med.CREATED_AT) as string;
    const modifiedAt = getFieldValue(med, Med.MODIFIED_AT) as string;

    const medication: Medication = {
      id,
      name,
      strength,
      categoryId,
      categoryName,
      archived,
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
