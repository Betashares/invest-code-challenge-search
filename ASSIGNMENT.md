# Senior Software Engineer coding challenge

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

- React, Vue, Angular or vanilla JavaScript (your choice)
- Use a pre-rolled UI design system, or roll your own CSS
- Axios or Fetch API for API requests

## Submission

Please provide the following:

- **Code**
  - Fork this repository and build your solution in your own GitHub repository, then share its link with us
  - Using clear and meaningful commit messages
- **Documentation**
  - Please provide a README file with setup instructions and a brief description of how it all works

---

## Mock Search API

Build against the mock Search API in [`api/`](./api/). It runs locally on `http://localhost:8787`. [`api/README.md`](./api/README.md) explains how to run it and how to search, filter, order and page results.
