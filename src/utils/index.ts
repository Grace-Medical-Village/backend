import { CachedMetric, MetricFormat, ValidMetric } from '../types';
import { getMetricFormats } from '../api/routes/metrics';

const indexOutOfBounds = (index: number, list: unknown[]): boolean =>
  index < 0 || index > list.length - 1;

const isLocal = (): boolean => process.env.NODE_ENV === 'local';
const isProduction = (): boolean => process.env.NODE_ENV === 'production';
const toIso8601 = (date: Date): string => date.toISOString().split('T')[0];
const isNumber = (value: string) => !isNaN(Number(value));

const ISO_8601 = '(\\d{4})-(\\d{2})-(\\d{2})';

const tomorrow = () => {
  const today = new Date();
  const result = new Date(today);
  result.setDate(result.getDate() + 1);
  return result;
};
const oneYearAgo = () => {
  const today = new Date();
  const result = new Date(today);
  result.setDate(result.getDate() - 365);
  return result;
};
const cachedMetrics: CachedMetric = {};

const buildCachedMetrics = (metrics: Array<Partial<MetricFormat>>): void => {
  metrics.forEach((metric: Partial<MetricFormat>) => {
    if (metric.id) {
      cachedMetrics[metric.id] = {
        id: metric.id,
        maxValue: metric?.maxValue ?? null,
        minValue: metric?.minValue ?? null,
        pattern: metric?.pattern ?? '',
      };
    }
  });
};

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
      .catch((err) => {
        console.error(err);
      });
  }
  return result;
};

const isBloodPressureMetric = (value: string, metricFormat: MetricFormat) => {
  return (
    value.indexOf('/') > 0 &&
    metricFormat.pattern &&
    metricFormat.pattern?.indexOf('/') > 0
  );
};

const checkPattern = (pattern: string, value: string): boolean => {
  const re = new RegExp(pattern);
  return re.test(value);
};

function validatePattern(
  value: string,
  metricFormat: MetricFormat,
  result: ValidMetric
) {
  const patternMatched = metricFormat.pattern
    ? checkPattern(metricFormat.pattern, value)
    : true;

  if (!patternMatched) {
    result = {
      isValid: false,
      error: `Metric provided '${value}' does not match required format`,
    };
    return result;
  }

  return result;
}

function validateMinimum(
  value: string,
  metricFormat: MetricFormat,
  result: ValidMetric
) {
  if (metricFormat.pattern === ISO_8601) {
    const dateValue = new Date(value);
    const minimumDate = oneYearAgo();

    if (dateValue < minimumDate) {
      result = {
        isValid: false,
        error: `Metric value of ${toIso8601(
          dateValue
        )} exceeds minimum threshold of ${toIso8601(minimumDate)}`,
      };
    }
  } else if (isBloodPressureMetric(value, metricFormat)) {
    const values: Array<string> = value.split('/');
    values.forEach((v) => {
      if (!isNumber(v)) {
        result = {
          isValid: false,
          error: `Metric value of ${value} is not a number`,
        };
        return result;
      }
      if (metricFormat.minValue && Number(v) < metricFormat.minValue) {
        result = {
          isValid: false,
          error: `Metric value ${value} exceeds minimum of ${metricFormat.minValue}`,
        };
        return result;
      }
    });
  } else {
    if (!isNumber(value)) {
      result = {
        isValid: false,
        error: `Metric value of ${value} is not a number`,
      };
      return result;
    }
    if (metricFormat.minValue && Number(value) < metricFormat.minValue) {
      result = {
        isValid: false,
        error: `Metric value ${value} exceeds minimum of ${metricFormat.minValue}`,
      };
      return result;
    }
  }
  return result;
}

function validateMaximum(
  value: string,
  metricFormat: MetricFormat,
  result: ValidMetric
) {
  if (metricFormat.pattern === ISO_8601) {
    const dateValue = new Date(value);
    const maximumDate = tomorrow();

    if (dateValue > maximumDate) {
      result = {
        isValid: false,
        error: `Metric value of ${toIso8601(
          dateValue
        )} exceeds maximum threshold of ${toIso8601(maximumDate)}`,
      };
    }
  } else if (isBloodPressureMetric(value, metricFormat)) {
    const values: Array<string> = value.split('/');
    values.forEach((v) => {
      if (!isNumber(v)) {
        result = {
          isValid: false,
          error: `Metric value of ${value} is not a number`,
        };
        return result;
      }
      if (metricFormat.maxValue && Number(v) > metricFormat.maxValue) {
        result = {
          isValid: false,
          error: `Metric value ${value} exceeds maximum of ${metricFormat.maxValue}`,
        };
        return result;
      }
    });
  } else {
    if (!isNumber(value)) {
      result = {
        isValid: false,
        error: `Metric value of ${value} is not a number`,
      };
      return result;
    }
    if (metricFormat.maxValue && Number(value) > metricFormat.maxValue) {
      result = {
        isValid: false,
        error: `Metric value ${value} exceeds maximum of ${metricFormat.maxValue}`,
      };
      return result;
    }
  }
  return result;
}

const validateMetric = async (
  metricId: number,
  value: string
): Promise<ValidMetric> => {
  const metricFormat: MetricFormat | null = await getMetricFormat(metricId);

  let result: ValidMetric = {
    isValid: true, // save faulty data in case getMetricFormat fails
    metric: value,
  };

  if (!metricFormat) {
    console.log('Unable to save metric due to missing metric format');
    return result;
  } else if (!value) {
    result = {
      error: 'No metric value provided',
      isValid: false,
    };
    return result;
  } else if (value.length === 0) {
    result = {
      error: 'Metric is empty',
      isValid: false,
    };
    return result;
  } else {
    result = validatePattern(value, metricFormat, result);
    if (result.error) return result;

    result = validateMinimum(value, metricFormat, result);
    if (result.error) return result;

    result = validateMaximum(value, metricFormat, result);
    if (result.error) return result;

    return result;
  }
};

export { indexOutOfBounds, isLocal, isProduction, validateMetric };
