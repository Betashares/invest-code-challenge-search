import {
  FACET_FIELDS,
  FacetField,
  RANGE_FACET_BUCKETS,
  isBooleanField,
  isFacetField,
  isRangeField,
} from '../models/search-fields.config';
import {
  FacetKeysByKind,
  FacetResult,
  InstrumentSearchQuery,
} from '../models/search-query.model';
import { InstrumentsRepository } from '../repositories/instruments-json.repository';
import { SearchService } from './search.service';

export class FacetsService {
  constructor(
    private repository: InstrumentsRepository,
    private searchService: SearchService,
  ) {}

  /**
   * All facet keys.
   */
  getKeys(): string[] {
    return [...FACET_FIELDS];
  }

  /**
   * Facet keys grouped by instrument kind. A kind lists a key when at least one instrument
   * of that kind has a value for it.
   */
  async getKeysByKind(): Promise<FacetKeysByKind> {
    const documents = await this.repository.getAll();
    const keysByKind: FacetKeysByKind = { all: this.getKeys() };

    for (const kind of new Set(documents.map((document) => document.kind))) {
      keysByKind[kind] = FACET_FIELDS.filter((key) =>
        documents.some(
          (document) => document.kind === kind && document[key] !== null,
        ),
      );
    }

    return keysByKind;
  }

  /**
   * Counts for each value of a facet: how many instruments the search query matches when the
   * facet key is set to that value. Unknown keys return an empty list.
   */
  async getCounts(
    key: string,
    query: InstrumentSearchQuery,
    omitEmptyCounts: boolean,
  ): Promise<FacetResult[]> {
    if (!isFacetField(key)) {
      return [];
    }

    const values = await this.getFacetValues(key);

    const facets = await Promise.all(
      values.map(async (value) => {
        const { count } = await this.searchService.search(
          withFacetValue(query, key, value),
        );
        return { value, count };
      }),
    );

    return omitEmptyCounts ? facets.filter(({ count }) => count > 0) : facets;
  }

  /**
   * Every value a facet can take across all instruments, regardless of the search query.
   */
  private async getFacetValues(key: FacetField): Promise<string[]> {
    if (isRangeField(key)) {
      const buckets = RANGE_FACET_BUCKETS[key];
      return buckets.slice(1).map((max, index) => `${buckets[index]},${max}`);
    }

    const documents = await this.repository.getAll();
    const values = new Set(
      documents
        .map((document) => document[key])
        .filter((value) => value !== null)
        .map(String),
    );

    if (isBooleanField(key)) {
      return ['true', 'false'].filter((value) => values.has(value));
    }

    return [...values].sort();
  }
}

/**
 * Replaces the facet key in the search query with a single facet value.
 */
function withFacetValue(
  query: InstrumentSearchQuery,
  key: FacetField,
  value: string,
): InstrumentSearchQuery {
  if (isRangeField(key)) {
    const [min, max] = value.split(',');
    return { ...query, [key]: { min, max } };
  }

  if (isBooleanField(key)) {
    return { ...query, [key]: { value: value === 'true' } };
  }

  return { ...query, [key]: [value] };
}
