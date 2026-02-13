# CLAUDE.md — Agent Context for demo-webapp

## Project Overview
Demo web app displaying a sortable table of mutual fund data (from Globe and Mail API). Two pages demonstrate different sorting architectures: server-side (API sort) vs client-side (local sort). Built as a teaching tool for testing strategy — the architecture determines whether tests should be E2E, API-level, or unit-level.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite 7, React Router v7
- **Backend:** Node.js/Express 5 proxy server (`server.ts` → compiled to `dist/server.cjs`)
- **Testing:** WebdriverIO (browser runner, Mocha framework) for integration tests
- **Styling:** Plain CSS (App.css, index.css) + some inline styles in components

## Architecture

### Two Pages, One Table Component
- **ApiSortPage** (`src/App.tsx`): Sends `orderBy`/`orderDir`/`limit` to the API. Server sorts the data. Re-fetches on every sort/limit change.
- **LocalSortPage** (`src/LocalSortPage.tsx`): Fetches all data once (no sorting params). Sorts in-memory using `Array.sort()`. Uses `rawPriceChange`/`rawPercentChange` fields for numeric sorting.
- **FundTable** (`src/FundTable.tsx`): Shared presentational component. Receives data + sort state as props. Renders table with column headers, sort indicators, color-coded changes, and symbol links.

### Backend Proxy (`server.ts`)
- Single endpoint: `POST /api/funds`
- Two modes: real API proxy (to `globeandmail.pl.barchart.com`) or mock data (via `MOCK_DATA_FILE` env var)
- CORS restricted to `http://localhost:5173`
- Compiled with `tsconfig.server.json` → CommonJS output renamed to `.cjs`

### Shared Module (`src/shared.ts`)
- `API_URL` constant
- `useSortState()` hook (orderBy, orderDir, handleSort)
- `ApiFundRow` interface (raw API response shape)

## File Map

| File | Purpose |
|------|---------|
| `src/App.tsx` | Router, HeaderWithRouter nav, ApiSortPage component |
| `src/LocalSortPage.tsx` | LocalSortPage component (client-side sorting) |
| `src/FundTable.tsx` | Shared table component, FundRow type, formatChange/formatDate helpers, fields array |
| `src/shared.ts` | API_URL, useSortState hook, ApiFundRow interface |
| `src/main.tsx` | React DOM entry point |
| `src/App.css` | Table styles, loading overlay/spinner, container layout, pos/neg color classes |
| `src/index.css` | Global styles (fonts, colors, light/dark scheme) |
| `src/FundTable.test.tsx` | WebdriverIO integration test (mocks fetch, tests sort indicator) |
| `server.ts` | Express proxy server |
| `wdio.conf.ts` | WebdriverIO config (browser runner, React preset, Chrome) |

## Key Types
- **`FundRow`** (FundTable.tsx): Frontend row shape with optional `rawTradeTime`, `rawPriceChange`, `rawPercentChange`
- **`ApiFundRow`** (shared.ts): Raw API response row shape with nested `raw` object

## Conventions
- React components use `function` declarations with `ReactElement` return type
- Error handling uses `catch (err: unknown)` with `instanceof Error` guard
- CSS classes for table styling: `.fund-table`, `.disabled`, `.pos`, `.neg`, `.left`
- Data-testid attributes on columns for testing (e.g., `data-testid="lastPrice"`, `data-testid="sort-indicator-lastPrice"`)
- Sort direction stored as `'asc' | 'desc'`, indicators are `▲`/`▼`

## Build & Run
- `npm run dev` — Vite dev server on port 5173
- `npm run backend` — Build + run Express proxy on port 5174
- `MOCK_DATA_FILE=sampleMockData.json npm run backend` — Use mock data
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint
- `npx wdio` — Integration tests (add `DEBUG=true` to see browser)

## Gotchas
- Test files (`*.test.tsx`) are excluded from `tsconfig.app.json` — wdio types conflict with the app build
- Backend uses `node-fetch` v2 (CommonJS) — the `.js` → `.cjs` rename in `backend:postbuild` is a workaround for the project's `"type": "module"` setting
- The `fields` array in FundTable.tsx is internal only (not exported) — column definitions live there
- Mock data files: `sampleMockData.json` (full data), `emptyMockData.json` (empty table test)
- The `tradeTime` column uses `data-testid="raw.tradeTime"` (not `"tradeTime"`) — matches the API field name convention
