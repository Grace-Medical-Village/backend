import { Request, Response } from 'express';
import { dbRequest, getFieldValue } from '../../utils/db';
import { FieldList } from 'aws-sdk/clients/rdsdataservice';
import { Met, Metric } from '../../types';

async function getMetrics(req: Request, res: Response): Promise<void> {
  const sql = 'select * from metric;';

  const records = await dbRequest(sql)
    .then((r) => r)
    .catch((err) => console.error(err)); // todo clearer messages

  if (records && records.length > 0) {
    const data = buildMetricData(records);
    res.status(200);
    res.json(data);
  } else {
    res.status(404);
    res.json([]);
  }
}

function buildMetricData(records: FieldList[]): Metric[] {
  return records?.map((m: FieldList) => {
    const id = getFieldValue(m, Met.ID) as number;
    const metricName = getFieldValue(m, Met.METRIC_NAME) as string;
    const unitOfMeasure = getFieldValue(m, Met.UNIT_OF_MEASURE) as string;
    const uom = getFieldValue(m, Met.UOM) as string;
    const map = getFieldValue(m, Met.MAP) as boolean;
    const defaultValue = getFieldValue(m, Met.DEFAULT_VALUE) as number | null;
    const minValue = getFieldValue(m, Met.MAX_VALUE) as number | null;
    const maxValue = getFieldValue(m, Met.MIN_VALUE) as number | null;
    const createdAt = getFieldValue(m, Met.CREATED_AT) as string;
    const modifiedAt = getFieldValue(m, Met.MODIFIED_AT) as string;

    const metric: Metric = {
      id,
      metricName,
      unitOfMeasure,
      uom,
      map,
      defaultValue,
      minValue,
      maxValue,
      createdAt,
      modifiedAt,
    };

    return metric;
  });
}

export { getMetrics };
