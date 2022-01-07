import { Request, Response } from 'express';
import { dbRequest, sqlParen } from '../../utils/db';
import { dataBuilder } from '../../utils/data-builder';

async function getMedication(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  const sql = `
   select m.*, mc.name category_name from medication m 
   join medication_category mc on m.category_id = mc.id 
   where m.id = ${id};
  `;

  await dbRequest(sql)
    .then((r) => {
      const data = dataBuilder.buildMedicationData(r);
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
      const data = dataBuilder.buildMedicationData(r);
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
      const data = dataBuilder.buildMedicationCategoryData(r);
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
    values.push(sqlParen(strength));
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

export {
  getMedication,
  getMedications,
  getMedicationCategories,
  postMedication,
  putMedication,
  deleteMedication,
};
