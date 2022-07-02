import { Request, Response } from 'express';
import { db, sqlParen } from '../../utils/db';
import { isNumber } from '../../utils';
import { Id } from '../../types';

async function getMedication(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  const sql = `
      select m.*, mc.name category_name
      from medication m
               join medication_category mc on m.category_id = mc.id
      where m.id = ${id};
  `;

  await db
    .executeStatementRefactor(sql)
    .then((data) => {
      if (data.length === 1) {
        res.status(200);
        res.json(data[0]);
      } else {
        res.status(404);
        res.json({});
      }
    })
    .catch((e) => {
      res.status(e?.statusCode ?? 500);
      res.json({});
      console.error(e);
    });
}

async function getMedications(req: Request, res: Response): Promise<void> {
  const sql = `
      select m.*, mc.name category_name
      from medication m
               join medication_category mc on m.category_id = mc.id
      order by category_name, m.name, m.strength;
  `;

  await db
    .executeStatementRefactor(sql)
    .then((data) => {
      if (data.length > 0) {
        res.status(200);
        res.json(data);
      } else {
        res.status(404);
        res.json([]);
      }
    })
    .catch((e) => {
      res.status(e?.statusCode ?? 500);
      res.json([]);
      console.error(e);
    });
}

async function getMedicationCategories(
  req: Request,
  res: Response
): Promise<void> {
  const sql = 'select * from medication_category';

  await db.executeStatementRefactor(sql).then((data) => {
    if (data.length > 0) res.status(200);
    else res.status(404);
    res.json(data);
  });
}

async function postMedication(req: Request, res: Response): Promise<void> {
  const categoryId = req.body.categoryId;
  const name = sqlParen(req.body.name);
  const strength = req.body.strength;

  if (!categoryId || !name) {
    res.status(400);
    res.json({ error: 'categoryId and name required in request body' });
    return;
  }

  let columns = 'category_id, name';
  const values: number | string[] = [categoryId, name];

  if (strength) {
    columns += ', strength';
    values.push(sqlParen(strength));
  }

  const sql = `
      insert into medication (${columns})
      values (${values})
      returning id;
  `;

  await db.executeStatementRefactor(sql).then((data) => {
    if (data && data.length === 1) {
      const { id } = data[0] as Id;
      res.status(201);
      res.json({ id });
    } else {
      res.status(400);
      res.json({});
    }
  });
}

async function putMedication(req: Request, res: Response): Promise<void> {
  const id = req.body.id;
  const categoryId = req.body.categoryId;
  const archived = req.body.archived;
  const name = sqlParen(req.body.name);
  const strength = sqlParen(req.body.strength);

  if (!id || !categoryId || !name) {
    res.status(400);
    res.json({
      error:
        'putMedication requires id, categoryId, and name in request body; archived and strength are optional',
    });
  }

  const sql = [
    'update medication',
    `set category_id = ${categoryId},`,
    `name = ${name},`,
  ];

  if (strength && archived) {
    const clause = `
    strength = ${strength},
    archived = ${archived}
      `;
    sql.push(clause);
  } else if (strength) {
    const clause = `
    strength = ${strength}
      `;
    sql.push(clause);
  } else if (archived) {
    const clause = `
    archived = ${archived}
      `;
    sql.push(clause);
  }

  const whereClause = `where id = ${id};`;
  sql.push(whereClause);

  await db.executeStatementRefactor(sql.join(' ')).then((_) => {
    res.status(200);
    res.json({});
  });
}

async function deleteMedication(req: Request, res: Response): Promise<void> {
  const id = req?.params?.id ?? null;

  if (id && !isNumber(id)) {
    res.status(400);
    res.json({ error: 'failed to provide integer id path parameter' });
    return;
  }

  const sql = `;
  delete
    from;
  medication;
  where;
  id = ${id};
  `;

  await db.executeStatementRefactor(sql).then((_) => {
    res.status(200);
    res.json({});
  });
}

export {
  getMedication,
  getMedications,
  getMedicationCategories,
  postMedication,
  putMedication,
  deleteMedication,
};
