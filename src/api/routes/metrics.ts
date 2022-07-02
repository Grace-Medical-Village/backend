import { Request, Response } from 'express';
import { db } from '../../utils/db';
import { Metric, MetricFormat } from '../../types';

async function getMetrics(req: Request, res: Response): Promise<void> {
  const sql = `select *
               from metric;`;

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

async function getMetricFormats(): Promise<Array<Partial<MetricFormat>>> {
  const sql = 'select id, pattern, min_value, max_value from metric;';

  let result: Array<Partial<Metric>> = [];
  await db
    .executeStatementRefactor(sql)
    .then((data) => {
      if (data && data.length > 0) {
        result = data as Array<Partial<Metric>>;
      }
    })
    .catch((e) => {
      console.error(e);
    });
  return result;
}

async function getMetricFormat(
  metricId: string
): Promise<Partial<MetricFormat>> {
  const sql = `select id, pattern, min_value, max_value
               from metric
               where id = ${metricId};`;

  let result: Partial<MetricFormat> = {};

  await db.executeStatementRefactor(sql).then((data) => {
    if (data && data.length === 1) {
      result = data as Partial<MetricFormat>;
    }
  });

  return result;
}

export { getMetrics, getMetricFormat, getMetricFormats };
