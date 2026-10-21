# Senior Software Engineer coding test

## Scenario

We need to revamp the search functionality of our Betashares website by integrating it with the mock Search API included in [`api/`](./api/), which runs locally. The goal is to create a more intuitive and modern search experience for users by improving search performance, usability, and interface design.

1. Improve the user interface for searching
2. Integrate the frontend with the local mock Search API in `api/`
3. Ensure a smooth and intuitive search experience, including features such as instant suggestions, filters and pagination.
4. Demonstrate a working solution, running on [`http://localhost:3000`](http://localhost:3000/)

## Acceptance Criteria

- **Predictive search suggestions**
  - The search bar should provide auto-suggestions based on popular and relevant user queries
  - Users should be able to refine their search by selecting from suggested terms before completing their query
  - Commonly searched terms should be dynamically surfaced to guide users towards relevant products or content
  - The search experience should be clean and unobtrusive, ensuring ease of use without overwhelming the user
- **Search bar**
  - Create an accessible and visually appealing search input field
  - Display real-time search suggestions as the user types
  - Handle no results with a friendly message
- **Search results**
  - Display search results dynamically below the search bar
  - Display relevant information for each search result
  - Include pagination controls where applicable
- **Filters and ordering**
  - Add options to filter and re-order search results
- **Loading states**
  - Implement loading and or skeleton states while waiting for results

## Technology Stack

- React, Vue or vanilla JavaScript (your choice)
- Use a pre-rolled UI design system, or roll your own CSS
- Axios or Fetch API for API requests

## Submission

Please provide the following:

- **Code**
  - Using a GitHub repository
  - Using clear and meaningful commit messages
- **Documentation**
  - Please provide a README file with setup instructions and a brief description of how it all works

---

## Mock Search API

The mock Search API is in [`api/`](./api/). It runs locally and searches the instruments in `api/data/instruments.json`. See [`api/README.md`](./api/README.md) for the full reference.

Start it from the repository root:

```bash
npm run api:install
npm run api        # http://localhost:8787
```

The API accepts requests from any origin, so a frontend on `http://localhost:3000` can call it directly.

```
POST http://localhost:8787/search
{
    "from": 1,
    "size": 15,
    "kind": ["etf"]
}
```

`from` is the page number, starting at 1, and `size` is the page size. The response contains the page of `results`, the total `count` of matches before paging, and `indexed_at`.

### Searching on free text

To narrow the search results, search text can be provided in the payload. The search text matches on the `symbol`, `symbol_openfigi`, `display_name` and `issuer` fields in the results. Every word must appear in the same field, and `OR` between words searches for either side.

```
POST http://localhost:8787/search
{
    "search_text": "betashares"
}
```

### Ordering results

Results can be ordered by providing an `order_by` parameter to the payload containing a field name and direction as `asc` or `desc`.

```
POST http://localhost:8787/search
{
    "order_by": "units_circulating.desc"
}
```

### Filtering results

Results can be further narrowed by using filters. Filters come in three flavours: a collection of text to match on, a boolean value, or a range with min and max boundaries.

```
POST http://localhost:8787/search
{
  "kind": ["etf"],
  "is_betashares": { "value": true }
}
```

### Filtering

- symbol_openfigi - `string[]`
- kind - `string[]`
- issuer - `string[]`
- currency - `string[]`
- is_betashares - `{ value: <boolean|null> }`
- is_flagship_fund - `{ value: <boolean|null> }`
- is_portfolio_excluded - `{ value: <boolean|null> }`
- is_auto_invest_included - `{ value: <boolean|null> }`
- units_circulating - `{ min: <string|null>, max: <string|null> }`

### Facets

To build filter options with counts, the available facet keys and the count for each value are also provided.

```
GET  http://localhost:8787/facets/keys

POST http://localhost:8787/facets/kind
{
    "search_text": "bank"
}
```
