/**
 * A record as it appears in data/instruments.json (the raw instruments feed).
 */
export interface RawInstrument {
  symbol: string;
  symbol_openfigi: string;
  symbol_ric: string;
  display_name: string;
  display_price: string;
  tags: string[];
  base_currency: string;
  minimum_order_quantity: string;
  units_circulating: string | null;
  kind: string;
  vendor: string | null;
  colours: string[];
  colours_dark_mode: string[];
  logo: string | null;
  logo_dark_mode: string | null;
}

/**
 * An instrument as returned by the API, using the real Search API document field names.
 */
export interface InstrumentDocument {
  symbol: string;
  symbol_openfigi: string;
  display_name: string;
  kind: string;
  currency: string;
  logo: string | null;
  issuer: string | null;
  is_betashares: boolean;
  is_flagship_fund: boolean;
  is_portfolio_excluded: boolean;
  is_auto_invest_included: boolean;
  // Numeric string, the way the real Search API stores numbers.
  units_circulating: string | null;
}

export type InstrumentField = keyof InstrumentDocument;
