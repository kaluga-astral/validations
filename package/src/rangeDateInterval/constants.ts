import {
  type ErrorInfo,
  createErrorCode,
  declensionDay,
  declensionMonth,
  declensionYear,
} from '../core';

import type { DateUnit } from './types';

const selectDeclensionUnitStrategy = (unit: DateUnit) => {
  const strategy = {
    day: declensionDay,
    month: declensionMonth,
    year: declensionYear,
  };

  return strategy[unit];
};

export const RANGE_DATE_INTERVAL_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('rangedate-interval'),
  message: (limit: number, unit: DateUnit) =>
    `Период не может превышать ${limit} ${selectDeclensionUnitStrategy(unit)(limit)}`,
};
