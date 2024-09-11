import { declensionDay, declensionMonth, declensionYear } from '@astral/utils';

import { type ErrorInfo, createErrorCode } from '../core';

import type { DateUnit, DefaultMessage } from './types';

type DynamicErrorInfo = Pick<ErrorInfo, 'code'> & {
  message: DefaultMessage;
};

const selectDeclensionUnitStrategy = (unit: DateUnit) => {
  const strategy = {
    day: declensionDay,
    month: declensionMonth,
    year: declensionYear,
  };

  return strategy[unit];
};

export const RANGE_DATE_INTERVAL_ERROR_INFO: DynamicErrorInfo = {
  code: createErrorCode('rangedate-interval'),
  message: (limit: number, unit: DateUnit) =>
    `Период не может превышать ${limit} ${selectDeclensionUnitStrategy(unit)(limit)}`,
};
