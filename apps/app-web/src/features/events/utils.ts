import type { Range } from './types';

export type FilterValue = string | number | (string | number)[];
export type Filters = Record<string, FilterValue>;

type Params = {
  selectedCategories: number[]
  selectedRegion: number | undefined,
  dates: [Date, Date?],
  range?: Range,
};

export function getFilters(params: Params): Filters {
  return {
    'categoryIds[]': params.selectedCategories,
    city: params.selectedRegion || '',
    startDate: getDateStr(params.dates[0]),
    endDate: params.dates[1] ? getDateStr(params.dates[1]) : '',
    minPrice: params.range?.min ?? 0,
    maxPrice: params.range?.max ?? 0,
  }
}

function getDateStr(date: Date) {
  const dateText = `${date.getFullYear()}-${getTwoNumber(date.getMonth())}-${getTwoNumber(date.getDay())}`;

  return `${dateText}T00:00:00+03:00`;
}

function getTwoNumber(int: number): string {
  return int < 9 ? `0${int}` : `${int}`;
}