
# Demo Web App

This project is a demonstration web application that displays a sortable table of mutual fund data, similar to the [Globe and Mail funds pages](https://www.theglobeandmail.com/investing/markets/funds/). It is built with React, TypeScript, and Vite for the frontend, and uses a Node.js/Express TypeScript backend as a proxy to fetch data from the Globe and Mail API (bypassing CORS restrictions).

The main idea of this project is to have two very similar pages, one where sorting of the funds table is done through the Back End (by API) and one done through the Front End. It is meant as an exercise for people who must test such pages to properly understand that you should not always test in an End to End fashion.

Obviously the architecture of the underlying page (whether the sort is done by Back End or Front End) has a tremendous impact on how the tests should be done in an efficient manner. You could however do all the testing at the End to End level which is the slowest, most brittle way of doing things and can only be done once development is pretty much done and dusted. But that would be a very bad approach, so **DON'T DO THAT!**

## Features

- Sortable, responsive table of fund data
- Clickable column headers for sorting (with direction indicator)
- User-selectable number of rows to display (only for page with API sort, the other will show all funds)
- Symbol column links to the Globe and Mail fund page
- Color formatting for change columns (green - positive, red - negative, black for no change)
- Table is visually disabled and shows a centered spinner while loading
- Use either the Globe and Mail real API or mock JSON response files for testing purposes

## Project Structure

- `src/` — React frontend code (main UI in `App.tsx`)
- `server.ts` — TypeScript backend proxy (compiled to `dist/server.cjs`)

## Prerequisites

- Node.js 22+ and npm

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Start the Back End (proxy server)

This will build and run the Back End, which is required for the Front End to fetch data.

```sh
npm run backend
```

The Back End will be available at <http://localhost:5174>

#### Using Mock Data (Optional)

For development, testing, or when the external API is unavailable, you can run the backend with mock API responses instead of the real API:

```sh
MOCK_DATA_FILE=sampleMockData.json npm run backend
```

Replace `sampleMockData.json` with any JSON file in the project root that has the same structure as the API response. Any time the API is hit, the content of this JSON file will be sent, there is no actual logic being done (no sorting or any other analysis, so craft your mock data carefully).

Having the ability to mock responses is useful for:

- Development when the external API is down
- Testing with controlled data sets
- Demonstrating sorting functionality with different data sets

When using mock data, the Back End will log `Mock mode enabled: [filename]` on startup otherwise it will say `Real API mode enabled`.

The project includes `sampleMockData.json` with randomly generated fund data that matches the API response format. This file contains non-proprietary sample data suitable for development and demonstration purposes. There is also `emptyMockData.json` which allows you to test a scenario where the data table is empty, which would be harder to do with real data (having to mess with databases and all).

### 3. Start the Front End (React app)

In a separate terminal:

```sh
npm run dev
```

### 4. Open the app

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Run Integration test

To run the integration test, fire up Webdriver.io:

```bash
npx wdio
```

This will silently run the test. To see the actual browser output, set environment variable DEBUG to true and then run. A shortcut to do so in Linux/Mac:

```bash
DEBUG=true npx wdio
```

## Notes

- The Back End proxy is required to bypass CORS when accessing the Globe and Mail API.
- The project is for demonstration purposes only and is not affiliated with The Globe and Mail.
