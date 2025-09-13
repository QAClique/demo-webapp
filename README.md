
# Globe Funds Demo

This project is a demonstration web application that displays a sortable table of mutual fund data, similar to the Globe and Mail funds page. It is built with React, TypeScript, and Vite for the frontend, and uses a Node.js/Express TypeScript backend as a proxy to fetch data from the Globe and Mail API (bypassing CORS restrictions).

The main idea of this project is to have two very similar pages, one where sorting of the data table is done through the backend (API) and one done through the Front End. It is meant as an exercise for people who must test such pages to properly understand the Test Pyramid and where they should be doing their tests.

Obviously the architecture of the underlying page (whether the sort is done by backend or frontend) has a tremendous impact on how the tests should be done in an efficient manner. You could however do all the testing at the End to End level which is the slowest, most brittle way of doing things and can only be done once everything is done and dusted. But that would be a very bad approach, so DON'T DO THAT!

## Features

- Sortable, responsive table of fund data
- Clickable column headers for sorting (with direction indicator)
- User-selectable number of rows to display
- Symbol column links to the Globe and Mail fund page
- Color formatting for change columns (green/red/black)
- Table is visually disabled and shows a centered spinner while loading
- Use either the Globe and Mail real API or mock data in JSON files for testing purposes

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

### 2. Start the backend (proxy server)

This will build and run the backend, which is required for the frontend to fetch data.

```sh
npm run backend
```

The backend will be available at http://localhost:5174

#### Using Mock Data (Optional)

For development, testing, or when the external API is unavailable, you can run the backend with mock data instead of the real API:

```sh
MOCK_DATA_FILE=sampleMockData.json npm run backend
```

Replace `sampleMockData.json` with any JSON file in the project root that has the same structure as the API response. This is useful for:

- Development when the external API is down
- Testing with controlled data sets
- Demonstrating sorting functionality with different data sets

When using mock data, the backend will log `Mock mode enabled: [filename]` on startup otherwise it will say `Real API mode enabled`.

### 3. Start the frontend (React app)

In a separate terminal:

```sh
npm run dev
```

The frontend will be available at http://localhost:5173

### 4. Open the app

Visit [http://localhost:5173](http://localhost:5173) in your browser.

## One-liner: Start both backend and frontend

You must run the backend and frontend in separate terminals. There is no single command to start both, but you can use two terminals:

Terminal 1:

```sh
npm run backend
# or with mock data:
# MOCK_DATA_FILE=sampleMockData.json npm run backend
```

Terminal 2:

```sh
npm run dev
```

## Mock Data

The backend supports mock data mode for development and testing purposes. When the `MOCK_DATA_FILE` environment variable is set, the backend will serve data from the specified JSON file instead of proxying to the external API.

### Sample Mock Data

The project includes `sampleMockData.json` with randomly generated fund data that matches the API response format. This file contains non-proprietary sample data suitable for development and demonstration purposes. There is also `emptyMockData.json` which allows you to test a scenario where the data table is empty, which would be really hard to do with real data.

### Mock Data Benefits

- **Reliability**: Continue development when external API is unavailable
- **Testing**: Use controlled data sets for testing sorting functionality
- **Demonstration**: Show differences between backend sorting (API Sort page) and frontend sorting (Front-End Sorting page)

## Notes

- The backend proxy is required to bypass CORS when accessing the Globe and Mail API.
- The project is for demonstration purposes only and is not affiliated with The Globe and Mail.
