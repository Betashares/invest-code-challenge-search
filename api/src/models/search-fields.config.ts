import { InstrumentField } from './instrument.model';

/**
 * Declares what each document field can be used for. Add a field to a list to make it searchable,
 * filterable or a facet; the search query type and request validation follow these lists.
 */

// Fields matched by search_text.
export const TEXT_SEARCH_FIELDS = [
  'symbol',
  'symbol_openfigi',
  'display_name',
  'issuer',
] as const satisfies readonly InstrumentField[];

// Filters sent as string arrays, e.g. { "kind": ["etf"] }.
export const MULTI_SELECT_FIELDS = [
  'symbol_openfigi',
  'kind',
  'issuer',
] as const satisfies readonly InstrumentField[];

// Filters sent as { "value": true | false }.
export const BOOLEAN_FIELDS = [
  'is_betashares',
  'is_flagship_fund',
  'is_portfolio_excluded',
  'is_auto_invest_included',
] as const satisfies readonly InstrumentField[];

// Filters sent as { "min": "0", "max": "100" } on numeric string fields.
export const RANGE_FIELDS = [
  'units_circulating',
] as const satisfies readonly InstrumentField[];

// Facets served by /facets/:key. Each facet must also be one of the filters above.
export const FACET_FIELDS = [
  'kind',
  'issuer',
  'is_betashares',
  'is_flagship_fund',
  'is_portfolio_excluded',
  'is_auto_invest_included',
  'units_circulating',
] as const satisfies readonly InstrumentField[];

// Bucket edges for range facets, returned as "min,max" values.
export const RANGE_FACET_BUCKETS: Record<RangeField, number[]> = {
  units_circulating: [
    0, 100_000_000, 500_000_000, 1_000_000_000, 5_000_000_000,
    1_000_000_000_000,
  ],
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 15;

export type TextSearchField = (typeof TEXT_SEARCH_FIELDS)[number];
export type MultiSelectField = (typeof MULTI_SELECT_FIELDS)[number];
export type BooleanField = (typeof BOOLEAN_FIELDS)[number];
export type RangeField = (typeof RANGE_FIELDS)[number];
export type FacetField = (typeof FACET_FIELDS)[number];

export function isBooleanField(field: string): field is BooleanField {
  return (BOOLEAN_FIELDS as readonly string[]).includes(field);
}

export function isRangeField(field: string): field is RangeField {
  return (RANGE_FIELDS as readonly string[]).includes(field);
}

export function isFacetField(field: string): field is FacetField {
  return (FACET_FIELDS as readonly string[]).includes(field);
}
