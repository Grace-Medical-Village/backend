import { CachedMetric, MetricFormat, MetricType, ValidMetric } from '../types';
import { getMetricFormats } from '../api/routes/metrics';

const indexOutOfBounds = (index: number, list: unknown[]): boolean =>
  index < 0 || index > list.length - 1;

const isLocal = (): boolean => process.env.NODE_ENV === 'local';
const isProduction = (): boolean => process.env.NODE_ENV === 'production';

const toIso8601 = (date: Date): string => date.toISOString().split('T')[0];

const cachedMetrics: CachedMetric = {};

const buildCachedMetrics = (metrics: Array<Partial<MetricFormat>>): void => {
  metrics.forEach((metric: Partial<MetricFormat>) => {
    if (metric.id) {
      cachedMetrics[metric.id] = {
        id: metric.id,
        maxValue: metric?.maxValue ?? null,
        minValue: metric?.minValue ?? null,
        pattern: metric?.pattern ?? '',
        metricType: metric?.metricType ?? null,
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

// function isZero(value: string | number) {
//   return Number(value) === 0;
// }

// const metricValueCleaner = (values: Array<string>): Array<string> => {
//   return values.map((value) => value.replace(/[^\d.]/gi, ''));
// };
//
// const validateNumericValues = (
//   values: Array<string>,
//   minValue: number | null,
//   maxValue: number | null
// ): ValidMetric => {
//   const metricFormat: ValidMetric = {
//     isValid: true,
//   };
//
//   if (minValue && maxValue) {
//     values.forEach((value) => {
//       if (Number(value) || isZero(value)) {
//         const isWithinMinAndMax =
//           Number(value) >= minValue && Number(value) <= maxValue;
//
//         if (!isWithinMinAndMax) {
//           metricFormat.isValid = false;
//           metricFormat.error = `Metric must be within range of ${minValue} - ${maxValue}`;
//           return;
//         }
//         // TODO check for integer
//       } else {
//         metricFormat.isValid = false;
//         metricFormat.error = 'Must provide numeric values';
//         return;
//       }
//     });
//   }
//
//   if (metricFormat.isValid && values.length === 2) {
//     metricFormat.metric = `${values[0]}/${values[1]}`;
//   } else if (metricFormat.isValid && values.length === 1) {
//     metricFormat.metric = `${values[0]}`;
//   }
//   return metricFormat;
// };

const checkPattern = (pattern: string, value: string): boolean => {
  const regexMatchArray: RegExpMatchArray | null = value.match(pattern);
  return !!regexMatchArray && regexMatchArray?.length > 0;
};

function processDateMetric(
  value: string,
  metricFormat: MetricFormat
): ValidMetric {
  let result: ValidMetric = {
    isValid: true,
    metric: value.trim(),
  };

  const patternMatched = metricFormat.pattern
    ? checkPattern(metricFormat.pattern, value)
    : true;

  if (!patternMatched) {
    result = {
      isValid: false,
      error: `Date provided, ${value}, does not match required date format`,
    };
    return result;
  }

  const dateValue = new Date(value);
  const minDate = new Date(metricFormat?.minValue ?? 0);
  if (dateValue < minDate) {
    result = {
      isValid: false,
      error: `Date ${value} exceeds minimum date threshold of ${toIso8601(
        minDate
      )}`,
    };

    return result;
  }

  const maxDate = new Date(metricFormat?.maxValue ?? 4102448461000); // 2100 A.D.
  if (dateValue > maxDate) {
    result = {
      isValid: false,
      error: `Date ${value} exceeds maximum date threshold of ${toIso8601(
        maxDate
      )}`,
    };
    return result;
  }

  return result;
}

function processIntegerMetric(
  value: string,
  metricFormat: MetricFormat
): ValidMetric {
  // TODO -> how do you want to process blood pressure?
  // const values: Array<string> =
  //   value.indexOf('/') > 0 ? value.toString().split('/') : [value.toString()];
  //
  // const cleanedValues: Array<string> = metricValueCleaner(values);
  //
  // validMetric = validateNumericValues(
  //   cleanedValues,
  //   metricFormat?.minValue ?? null,
  //   metricFormat?.maxValue ?? null
  // );
  let result: ValidMetric = {
    isValid: true,
    metric: value.trim(),
  };

  const patternMatched = metricFormat.pattern
    ? checkPattern(metricFormat.pattern, value)
    : true;

  if (!patternMatched) {
    result = {
      isValid: false,
      error: `Date provided, ${value}, does not match required date format`,
    };
    return result;
  }

  const dateValue = new Date(value);
  const minDate = new Date(metricFormat?.minValue ?? 0);
  if (dateValue < minDate) {
    result = {
      isValid: false,
      error: `Date ${value} exceeds minimum date threshold of ${toIso8601(
        minDate
      )}`,
    };

    return result;
  }

  const maxDate = new Date(metricFormat?.maxValue ?? 4102448461000); // 2100 A.D.
  if (dateValue > maxDate) {
    result = {
      isValid: false,
      error: `Date ${value} exceeds maximum date threshold of ${toIso8601(
        maxDate
      )}`,
    };
    return result;
  }

  return result;
}

function processMetric(value: string, metricFormat: MetricFormat): ValidMetric {
  let validMetric: ValidMetric = {
    isValid: true,
  };

  if (!value || value.length === 0) {
    validMetric = {
      isValid: false,
      error: 'No metric value provided',
    };
    return validMetric;
  }

  switch (metricFormat.metricType) {
    case MetricType.BOOLEAN:
      // unimplemented
      break;
    case MetricType.DATE:
      validMetric = processDateMetric(value, metricFormat);
      break;
    case MetricType.DECIMAL:
      // TODO
      // validMetric = processDecimalMetric(value);
      break;
    case MetricType.INTEGER:
      // TODO -> START_HERE
      validMetric = processIntegerMetric(value, metricFormat);
      break;
    case MetricType.NUMBER:
      // TODO
      // validMetric = processNumericMetric(value);
      break;
    default:
      validMetric = {
        ...validMetric,
        metric: value.trim(),
      };
  }
  return validMetric;
}

const validateMetric = async (
  metricId: number,
  value: string
): Promise<ValidMetric> => {
  const metricFormat: MetricFormat | null = await getMetricFormat(metricId);

  let validMetric: ValidMetric = {
    isValid: true, // save faulty data in case getMetricFormat fails
  };
  if (!metricFormat) {
    validMetric.error = 'Server Error';
    validMetric.isValid = false;
    return validMetric;
  } else if (!metricFormat.metricType) {
    // save data
  } else {
    validMetric = processMetric(value, metricFormat);
  }
  return validMetric;
};
export { indexOutOfBounds, isLocal, isProduction, validateMetric };
