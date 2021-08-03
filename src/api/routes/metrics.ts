import { Request, Response } from 'express';
import { dbRequest, getFieldValue } from '../../utils/db';
import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import {
  Metric,
  MetricDataIndex,
  MetricFormat,
  MetricFormatDataIndex,
  MetricType,
} from '../../types';

async function getMetrics(req: Request, res: Response): Promise<void> {
  const sql = 'select * from metric;';

  await dbRequest(sql)
    .then((r) => {
      if (r && r.length > 0) {
        const data = buildMetricData(r);
        res.status(200);
        res.json(data);
      } else {
        res.status(404);
        res.json([]);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json([]);
    });
}

async function getMetricFormats(): Promise<Array<Partial<MetricFormat>>> {
  const sql =
    'select id, pattern, min_value, max_value, metric_type from metric;';

  let result: Array<Partial<Metric>> = [];
  await dbRequest(sql)
    .then((r) => {
      if (r && r.length > 0) {
        result = buildMetricFormatData(r);
      }
    })
    .catch((err) => {
      console.error(err);
    });
  return result;
}

function buildMetricData(records: FieldList[]): Metric[] {
  return records?.map((m: FieldList) => {
    const id = getFieldValue(m, MetricDataIndex.ID) as number;
    const metricName = getFieldValue(m, MetricDataIndex.METRIC_NAME) as string;
    const unitOfMeasure = getFieldValue(
      m,
      MetricDataIndex.UNIT_OF_MEASURE
    ) as string;
    const uom = getFieldValue(m, MetricDataIndex.UOM) as string;
    const map = getFieldValue(m, MetricDataIndex.MAP) as boolean;
    const format = getFieldValue(m, MetricDataIndex.FORMAT) as string;
    const pattern = getFieldValue(m, MetricDataIndex.PATTERN) as string;
    const minValue = getFieldValue(m, MetricDataIndex.MIN_VALUE) as number;
    const maxValue = getFieldValue(m, MetricDataIndex.MAX_VALUE) as number;
    const createdAt = getFieldValue(m, MetricDataIndex.CREATED_AT) as string;
    const modifiedAt = getFieldValue(m, MetricDataIndex.MODIFIED_AT) as string;

    const metric: Metric = {
      id,
      metricName,
      unitOfMeasure,
      uom,
      map,
      format,
      pattern,
      minValue,
      maxValue,
      createdAt,
      modifiedAt,
    };

    return metric;
  });
}

function buildMetricFormatData(records: FieldList[]): Array<Partial<Metric>> {
  return records?.map((m: FieldList) => {
    const id = getFieldValue(m, MetricFormatDataIndex.ID) as number;
    const pattern = getFieldValue(m, MetricFormatDataIndex.PATTERN) as string;
    const minValue = getFieldValue(
      m,
      MetricFormatDataIndex.MIN_VALUE
    ) as number;
    const maxValue = getFieldValue(
      m,
      MetricFormatDataIndex.MAX_VALUE
    ) as number;
    const metricType = getFieldValue(
      m,
      MetricFormatDataIndex.METRIC_TYPE
    ) as MetricType;

    const metricFormatData: Partial<Metric> = {
      id,
      pattern,
      minValue,
      maxValue,
      metricType,
    };

    return metricFormatData;
  });
}
export { getMetrics, getMetricFormats };
