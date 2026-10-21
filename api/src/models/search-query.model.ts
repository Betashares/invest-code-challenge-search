import { InstrumentDocument } from './instrument.model';
import {
  BooleanField,
  MultiSelectField,
  RangeField,
} from './search-fields.config';

export interface BooleanFilter {
  value?: boolean | null;
}

export interface RangeFilter {
  min?: string | null;
  max?: string | null;
}

/**
 * Body of POST /search and POST /facets/:key. Every key is optional and unknown keys are ignored.
 * The filter keys come from the lists in search-fields.config.ts.
 */
export type InstrumentSearchQuery = {
  search_text?: string;
  // "field", "field.asc" or "field.desc" (defaults to desc).
  order_by?: string;
  // Page number, starting at 1.
  from?: number;
  // Page size.
  size?: number;
} & Partial<Record<MultiSelectField, string[]>> &
  Partial<Record<BooleanField, BooleanFilter>> &
  Partial<Record<RangeField, RangeFilter>>;

export interface SearchResults {
  results: InstrumentDocument[];
  // Total matches before pagination.
  count: number;
  indexed_at: number;
}

export interface SearchResponse extends Omit<SearchResults, 'results'> {
  results: Partial<InstrumentDocument>[];
}

export interface FacetResult {
  value: string;
  count: number;
}

export type FacetKeysByKind = Record<string, string[]>;
