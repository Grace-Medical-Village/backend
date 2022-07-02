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

// function validateMinimum(
//   value: string,
//   metricFormat: MetricFormat,
//   result: ValidMetric
// ) {
//   if (metricFormat.pattern === ISO_8601) {
//     const dateValue = new Date(value);
//     const minimumDate = oneYearAgo();
//
//     if (dateValue < minimumDate) {
//       result = {
//         isValid: false,
//         error: `Metric value of ${toIso8601(
//           dateValue
//         )} exceeds minimum threshold of ${toIso8601(minimumDate)}`,
//       };
//     }
//   } else if (isBloodPressureMetric(value, metricFormat)) {
//     const values: Array<string> = value.split('/');
//     values.forEach((v) => {
//       if (!isNumber(v)) {
//         result = {
//           isValid: false,
//           error: `Metric value of ${value} is not a number`,
//         };
//         return result;
//       }
//       if (metricFormat.minValue && Number(v) < metricFormat.minValue) {
//         result = {
//           isValid: false,
//           error: `Metric value ${value} exceeds minimum of ${metricFormat.minValue}`,
//         };
//         return result;
//       }
//     });
//   }
//   return result;
// }

// function validateMaximum(
//   value: string,
//   metricFormat: MetricFormat,
//   result: ValidMetric
// ) {
//   if (metricFormat.pattern === ISO_8601) {
//     const dateValue = new Date(value);
//     const maximumDate = tomorrow();
//
//     if (dateValue > maximumDate) {
//       result = {
//         isValid: false,
//         error: `Metric value of ${toIso8601(
//           dateValue
//         )} exceeds maximum threshold of ${toIso8601(maximumDate)}`
//       };
//     }
//   } else if (isBloodPressureMetric(value, metricFormat)) {
//     const values: Array<string> = value.split("/");
//     values.forEach((v) => {
//       if (!isNumber(v)) {
//         result = {
//           isValid: false,
//           error: `Metric value of ${value} is not a number`
//         };
//         return result;
//       }
//       if (metricFormat.maxValue && Number(v) > metricFormat.maxValue) {
//         result = {
//           isValid: false,
//           error: `Metric value ${value} exceeds maximum of ${metricFormat.maxValue}`
//         };
//         return result;
//       }
//     });
//   } else {
//     if (!isNumber(value)) {
//       result = {
//         isValid: false,
//         error: `Metric value of ${value} is not a number`
//       };
//       return result;
//     }
//     if (metricFormat.maxValue && Number(value) > metricFormat.maxValue) {
//       result = {
//         isValid: false,
//         error: `Metric value ${value} exceeds maximum of ${metricFormat.maxValue}`
//       };
//       return result;
//     }
//   }
//   return result;
// }

const validate = async (
  metricId: number,
  value: string
): Promise<ValidMetric> => {
  const metricFormat: Partial<MetricFormat> | MetricFormat =
    await getMetricFormat(metricId.toString()).then((r) => r);

  const result: ValidMetric = {
    isValid: true, // save faulty data in case getMetricFormat fails
    metric: value,
  };

  if (!isNumber(value)) {
    result.isValid = false;
    result.error = `Metric value of ${value} is not a number`;
    return result;
  }
  if (metricFormat.maxValue && Number(value) > metricFormat.maxValue) {
    result.isValid = false;
    result.error = `Metric value ${value} exceeds maximum of ${metricFormat.maxValue}`;
    return result;
  }
  if (metricFormat.minValue && Number(value) < metricFormat.minValue) {
    result.isValid = false;
    result.error = `Metric value ${value} exceeds minimum of ${metricFormat.minValue}`;
    return result;
  }
  if (
    metricFormat.pattern &&
    !regexTest(metricFormat?.pattern ?? null, value)
  ) {
    result.isValid = false;
    result.error = `Metric provided '${value}' does not match required format`;
    return result;
  }

  return result;
};

export {
  dateToDayId,
  indexOutOfBounds,
  isBloodPressureMetric,
  isLocal,
  isIntegerGreaterThanZero,
  isNumber,
  isTest,
  isProduction,
  oneYearAgo,
  regexTest,
  tomorrow,
  toIso8601,
  validate,
};
