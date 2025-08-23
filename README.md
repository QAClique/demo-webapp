
# Globe Funds Demo

This project is a demonstration web application that displays a sortable table of mutual fund data, similar to the Globe and Mail funds page. It is built with React, TypeScript, and Vite for the frontend, and uses a Node.js/Express TypeScript backend as a proxy to fetch data from the Globe and Mail API (bypassing CORS restrictions).

## Features
- Sortable, responsive table of fund data
- Clickable column headers for sorting (with direction indicator)
- User-selectable number of rows to display
- Symbol column links to the Globe and Mail fund page
- Color formatting for change columns (green/red/black)
- Table is visually disabled and shows a centered spinner while loading

## Project Structure
- `src/` — React frontend code (main UI in `App.tsx`)
- `server.ts` — TypeScript backend proxy (compiled to `dist/server.cjs`)

## Prerequisites
- Node.js 18+ and npm

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
```
Terminal 2:
```sh
npm run dev
```

## Notes
- The backend proxy is required to bypass CORS when accessing the Globe and Mail API.
- The project is for demonstration purposes only and is not affiliated with The Globe and Mail.
