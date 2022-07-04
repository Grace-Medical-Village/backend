import { MetricFormat, ValidMetric } from '../types';
import { getMetricFormat } from '../api/routes/metrics';

const indexOutOfBounds = (index: number, list: unknown[]): boolean =>
  index < 0 || index > list.length - 1;

const isLocal = (): boolean => process.env.NODE_ENV === 'local';
const isTest = (): boolean => process.env.NODE_ENV === 'test';
const isProduction = (): boolean => process.env.NODE_ENV === 'production';
const toIso8601 = (date: Date): string => date.toISOString().split('T')[0];
const isNumber = (value: string): boolean => !isNaN(Number(value));
const isIntegerGreaterThanZero = (value: string): boolean =>
  /^[1-9][0-9]*$/.test(value);

const tomorrow = (): Date => {
  const today = new Date();
  const result = new Date(today);
  result.setDate(result.getDate() + 1);
  return result;
};

const dateToDayId = (date: Date): number => {
  return Number(date.toISOString().substring(0, 10).replaceAll('-', ''));
};

const oneYearAgo = (): Date => {
  const today = new Date();
  const result = new Date(today);
  result.setDate(result.getDate() - 365);
  return result;
};

const isBloodPressureMetric = (
  value: string,
  metricFormat: MetricFormat
): boolean => {
  return <boolean>(
    (value.indexOf('/') > 0 &&
      metricFormat.pattern &&
      metricFormat.pattern?.indexOf('/') > 0)
  );
};

const regexTest = (pattern: string | null, value: string): boolean => {
  if (!pattern) return false;

  const re = new RegExp(pattern);
  return re.test(value);
};

const validate = async (
  metricId: number,
  value: string
): Promise<ValidMetric> => {
  let result: ValidMetric = {
    isValid: true,
    metric: value.trim(),
  };

  const values: Array<string> = value.trim().split('/');

  const metricFormat: Partial<MetricFormat> | null = await getMetricFormat(
    metricId.toString()
  )
    .then((r) => r)
    .catch((e) => {
      console.error(e);
      return null;
    });

  if (isDate(value)) {
    return result;
  }

  const valuesProvidedResult = validateValuesProvided(values);
  result = {
    ...result,
    ...valuesProvidedResult,
  };

  const numberValidationResult = validateNumber(values);
  result = {
    ...result,
    ...numberValidationResult,
  };

  if (!result.isValid) return result;

  // save faulty data in case getMetricFormat fails
  if (!metricFormat) return result;

  const maxValidationResult = validateMaximum(values, metricFormat);
  result = {
    ...result,
    ...maxValidationResult,
  };
  if (!result.isValid) return result;

  const minValidationResult = validateMinimum(values, metricFormat);
  result = {
    ...result,
    ...minValidationResult,
  };
  if (!result.isValid) return result;

  const patternValidationResult = validatePattern(value, metricFormat);
  result = {
    ...result,
    ...patternValidationResult,
  };

  return result;
};

const validateValuesProvided = (
  values: Array<string>
): Partial<ValidMetric> => {
  const result: Partial<ValidMetric> = {};

  if (values.length === 0) {
    result.isValid = false;
    result.error = 'No metric values provided';
  }

  return result;
};

const validateNumber = (values: Array<string>): Partial<ValidMetric> => {
  const result: Partial<ValidMetric> = {};

  values.forEach((value) => {
    if (!isNumber(value)) {
      result.isValid = false;
      result.error = `Metric value of ${value} is not a number`;
    }
  });

  return result;
};

const validateMaximum = (
  values: Array<string>,
  metricFormat: Partial<MetricFormat>
): Partial<ValidMetric> => {
  const result: Partial<ValidMetric> = {};

  values.forEach((value) => {
    if (metricFormat.maxValue && Number(value) > metricFormat.maxValue) {
      result.isValid = false;
      result.error = `Metric value ${value} exceeds maximum of ${metricFormat.maxValue}`;
    }
  });

  return result;
};

const validateMinimum = (
  values: Array<string>,
  metricFormat: Partial<MetricFormat>
): Partial<ValidMetric> => {
  const result: Partial<ValidMetric> = {};

  values.forEach((value) => {
    if (metricFormat.minValue && Number(value) < metricFormat.minValue) {
      result.isValid = false;
      result.error = `Metric value ${value} exceeds minimum of ${metricFormat.minValue}`;
    }
  });

  return result;
};

const validatePattern = (
  value: string,
  metricFormat: Partial<MetricFormat>
): Partial<ValidMetric> => {
  const result: Partial<ValidMetric> = {};

  if (metricFormat.pattern && !regexTest(metricFormat.pattern, value)) {
    result.isValid = false;
    result.error = `Metric provided '${value}' does not match required format`;
  }

  return result;
};

const isDate = (value: string): boolean => {
  let result = false;

  const datePatterns = {
    iso8601: /(\d{4})-(\d{2})-(\d{2})/,
  };

  for (const datePattern of Object.values(datePatterns)) {
    if (datePattern.test(value)) result = true;
  }
  return result;
};

export {
  dateToDayId,
  indexOutOfBounds,
  isBloodPressureMetric,
  isLocal,
  isIntegerGreaterThanZero,
  isDate,
  isNumber,
  isTest,
  isProduction,
  oneYearAgo,
  regexTest,
  tomorrow,
  toIso8601,
  validate,
  validateMaximum,
  validateMinimum,
  validateNumber,
  validatePattern,
  validateValuesProvided,
};
