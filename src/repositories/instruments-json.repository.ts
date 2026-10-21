import { readFileSync, statSync } from 'fs';

import { InstrumentDocument, RawInstrument } from '../models/instrument.model';

export interface InstrumentsRepository {
  // All instruments, in data source order.
  getAll(): Promise<InstrumentDocument[]>;

  // When the data was last updated, as epoch milliseconds.
  getIndexedAt(): Promise<number>;
}

/**
 * Repository serving instruments from a local JSON file of the raw instruments feed.
 *
 * The file is read and mapped once on construction, so a missing or invalid file fails at startup.
 */
export class JsonInstrumentsRepository implements InstrumentsRepository {
  private readonly documents: InstrumentDocument[];
  private readonly indexedAt: number;

  constructor(filePath: string) {
    const records: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));

    if (!Array.isArray(records)) {
      throw new Error(`Expected a JSON array of instruments in ${filePath}`);
    }

    this.documents = (records as RawInstrument[]).map(mapInstrumentDocument);
    this.indexedAt = Math.round(statSync(filePath).mtimeMs);

    console.log(`Loaded ${this.documents.length} instruments from ${filePath}`);
  }

  getAll(): Promise<InstrumentDocument[]> {
    return Promise.resolve(this.documents);
  }

  getIndexedAt(): Promise<number> {
    return Promise.resolve(this.indexedAt);
  }
}

/**
 * Maps a raw feed record to the Search API document field names.
 */
function mapInstrumentDocument(instrument: RawInstrument): InstrumentDocument {
  const tags = instrument.tags ?? [];
  const issuer = blankToNull(instrument.vendor);

  return {
    symbol: instrument.symbol,
    symbol_openfigi: instrument.symbol_openfigi,
    display_name: instrument.display_name,
    kind: instrument.kind,
    currency: instrument.base_currency,
    logo: blankToNull(instrument.logo),
    issuer,
    is_betashares: issuer === 'betashares',
    is_flagship_fund: tags.includes('flagship_fund'),
    is_portfolio_excluded: tags.includes('portfolio_exclude'),
    is_auto_invest_included: tags.includes('auto_invest_include'),
    units_circulating: blankToNull(instrument.units_circulating),
  };
}

/**
 * Trims a string, returning null when it is missing or empty.
 */
function blankToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
