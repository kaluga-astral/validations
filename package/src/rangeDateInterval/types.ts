export type RangeDateValue = { start?: Date; end?: Date };

export type DateUnit = 'day' | 'month' | 'year';

export type DefaultMessage = (limit: number, unit: DateUnit) => string;
