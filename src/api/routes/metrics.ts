import { Request, Response } from 'express';
import { db } from '../../utils/db';
import { Metric, MetricFormat } from '../../types';
import { dataBuilder } from '../../utils/data-builder';

async function getMetrics(req: Request, res: Response): Promise<void> {
  const sql = `
    select id,
           id,
           metric_name,
           unit_of_measure,
           uom,
           map,
           min_value,
           max_value,
           format,
           pattern,
           archived,
           created_at,
           modified_at
    from metric;
  `;

  await db
    .executeStatement(sql)
    .then((r) => {
      const data = dataBuilder.buildMetricData(r);
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
    .executeStatement(sql)
    .then((r) => {
      if (r && r.length > 0) {
        result = dataBuilder.buildMetricFormatData(r);
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
  const sql = `select id, pattern, min_value, max_value from metric
               where id = ${metricId};`;

  let result: Partial<MetricFormat> = {};

  await db.executeStatement(sql).then((r) => {
    if (r && r.length === 1) {
      result = dataBuilder.buildMetricFormatData(r)[0];
    }
  });

  return result;
}

export { getMetrics, getMetricFormat, getMetricFormats };
