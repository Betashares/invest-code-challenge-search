# Search Mock API

A local, read-only mock of the Betashares Search API. It searches the instruments in [`data/instruments.json`](data/instruments.json) using the same request and response contract as the real API, so a client can switch to it by changing only the base URL.

It is a small Koa app with the same controller → service → repository structure as the Personalisation API.

## Getting started

```bash
$ nvm use        # Node 20+
$ npm install
$ npm start      # http://localhost:8787, restarts when src/ or data/ change
```

| Script | Action |
| --- | --- |
| `npm start` | Dev server with nodemon + ts-node |
| `npm run build` / `npm run serve:prod` | Compile to `dist/`, then run the compiled server |
| `npm run type-check` | `tsc --noEmit` |
| `npm run format` | Prettier |

Optional environment variables:

- `PORT`: default `8787`, the real Search API's local port.
- `INSTRUMENTS_FILE`: default `data/instruments.json`.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Health check |
| POST | `/search` | Search instruments. `?fields=a,b` returns only those fields. |
| GET | `/instruments/:symbol_openfigi` | One instrument, e.g. `/instruments/A200:AU`. Mock-only. Supports `?fields=`. |
| GET | `/facets/keys` | Facet keys |
| GET | `/v2/facets/keys` | Facet keys grouped by kind: `all`, `etf`, `equity` |
| POST | `/facets/:key` | Count for each facet value, given a search query. `?omit_empty_counts=true` hides zero counts. |

### Search query

Every key is optional.

```jsonc
{
  "search_text": "bank",                        // every word must appear in one field; "a OR b" for either
  "kind": ["etf"],                              // multi-select: symbol_openfigi, kind, issuer, currency
  "is_betashares": { "value": true },           // boolean: is_betashares, is_flagship_fund,
                                                //   is_portfolio_excluded, is_auto_invest_included
  "units_circulating": { "min": "1000000000" }, // range (numeric strings, inclusive)
  "order_by": "units_circulating.desc",         // "field", "field.asc" or "field.desc" (default desc)
  "from": 1,                                    // page number, starting at 1
  "size": 15                                    // page size (default 15)
}
```

The response is `{ "results": [...], "count": <total before paging>, "indexed_at": <data file time, epoch ms> }`.

Default order: with no `search_text`, Betashares instruments come first, then symbols A–Z. With `search_text`, results are ranked:

1. exact ticker
2. start of a ticker
3. every word in the name
4. every word in another text field

### Examples

```bash
$ curl -X POST localhost:8787/search -d '{ "search_text": "bank" }'
$ curl -X POST 'localhost:8787/search?fields=symbol,display_name' -d '{ "kind": ["etf"], "is_betashares": { "value": true } }'
$ curl -X POST localhost:8787/search -d '{ "kind": ["equity"], "order_by": "units_circulating.desc", "size": 5 }'
$ curl localhost:8787/instruments/A200:AU
$ curl -X POST localhost:8787/facets/kind -d '{ "search_text": "bank" }'
$ curl -X POST 'localhost:8787/facets/issuer?omit_empty_counts=true' -d '{ "kind": ["equity"] }'
```

POST bodies are read as JSON whatever their `Content-Type`, as the real API does. Invalid bodies return `400 { "message": "..." }`.

## Project structure

```
src/
  main.ts                  bootstrap: middleware → modules → routes → listen
  index.ts                 public barrel: models, repository, controllers, module init
  module.ts                wires repository → services → controllers
  controllers/             HTTP only: read and validate the request, call a service, set the response
  services/                search and facet logic (no Koa)
  repositories/            InstrumentsRepository, plus the JSON file implementation that maps
                           data/instruments.json to InstrumentDocument
  models/                  document and query types, plus search-fields.config.ts
  validation/              search query body validation
  health/                  GET / health controller
  shared/                  env config, BaseController, error / 404 middleware, endpoint enums
```

## Changing the mock

| To | Edit |
| --- | --- |
| Add a field to results | `InstrumentDocument` in `models/instrument.model.ts`, and the mapper in `repositories/instruments-json.repository.ts` |
| Make a field searchable, filterable or a facet | The lists in `models/search-fields.config.ts` (the query type and validation follow them) |
| Change ranking | `scoreTextMatch` in `services/search.service.ts` |
| Change the default order | `applyDefaultOrder` in `services/search.service.ts` |
| Change the data | Edit `data/instruments.json`; the dev server restarts and reloads it |
| Use another data source | Implement `InstrumentsRepository` and construct it in `module.ts` |
