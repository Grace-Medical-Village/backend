import { CachedMetric, Metric, MetricFormat, ValidMetric } from '../types';
import { getMetricFormats } from '../api/routes/metrics';

const indexOutOfBounds = (index: number, list: unknown[]): boolean =>
  index < 0 || index > list.length - 1;

const isLocal = (): boolean => process.env.NODE_ENV === 'local';
const isProduction = (): boolean => process.env.NODE_ENV === 'production';

const buildCachedMetrics = (metrics: Array<Partial<Metric>>): void => {
  metrics.forEach((metric: Partial<Metric>) => {
    if (metric.id) {
      cachedMetrics[metric.id] = {
        pattern: metric?.pattern ?? '',
        maxValue: metric?.maxValue ?? -1,
        minValue: metric?.minValue ?? -1,
      };
    }
  });
};

const cachedMetrics: CachedMetric = {};

const getMetricFormat = async (
  metricId: number
): Promise<MetricFormat | null> => {
  let result: MetricFormat | null = null;
  if (cachedMetrics[metricId]) {
    result = cachedMetrics[metricId];
  } else {
    await getMetricFormats()
      .then((r) => {
        buildCachedMetrics(r);
        result = cachedMetrics[metricId];
      })
      .catch((err) => console.error(err));
  }
  return result;
};

const metricValueCleaner = (values: Array<string>): Array<string> => {
  return values.map((value) => value.replace(/[^\d.]/gi, ''));
};

const validateNumericValues = (
  values: Array<string>,
  minValue: number,
  maxValue: number
): ValidMetric => {
  const metricFormat: ValidMetric = {
    isValid: true,
  };

  values.forEach((value) => {
    if (Number(value)) {
      const isWithinMinAndMax =
        Number(value) >= minValue && Number(value) <= maxValue;
      if (!isWithinMinAndMax) {
        metricFormat.isValid = false;
        metricFormat.error = `Metric must be within range of ${minValue} - ${maxValue}`;
        return;
      }
      // TODO check for integer
    } else {
      metricFormat.isValid = false;
      metricFormat.error = 'Must provide numeric values';
      return;
    }
  });
  if (metricFormat.isValid && values.length === 2) {
    metricFormat.metric = `${values[0]}/${values[1]}`;
  } else if (metricFormat.isValid && values.length === 1) {
    metricFormat.metric = `${values[0]}`;
  }
  return metricFormat;
};

const checkPattern = (pattern: string, value: string): boolean => {
  const regexMatchArray: RegExpMatchArray | null = value.match(pattern);
  return !!regexMatchArray && regexMatchArray?.length > 0;
};

const validateMetric = async (
  metricId: number,
  value: string
): Promise<ValidMetric> => {
  const metricFormat: MetricFormat | null = await getMetricFormat(metricId);
  let validMetric: ValidMetric = {
    isValid: true, // better to save faulty data in case getMetricFormat fails
  };
  if (metricFormat) {
    const patternMatched = metricFormat.pattern
      ? checkPattern(metricFormat.pattern, value)
      : true;

    if (!patternMatched) {
      validMetric.isValid = false;
      validMetric.error = 'Failure to match metric pattern (see example)';
      return validMetric;
    }

    const values: Array<string> =
      value.indexOf('/') > 0 ? value.toString().split('/') : [value.toString()];

    const cleanedValues: Array<string> = metricValueCleaner(values);
    validMetric = validateNumericValues(
      cleanedValues,
      metricFormat.minValue,
      metricFormat.maxValue
    );
  }
  return validMetric;
};

export { indexOutOfBounds, isLocal, isProduction, validateMetric };
