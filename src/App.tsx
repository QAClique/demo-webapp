
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import LocalSortPage from './LocalSortPage';
import FundTable from './FundTable';
import type { FundRow } from './FundTable';


const API_URL = 'http://localhost:5174/api/funds';

function ApiSortPage(): ReactElement {
  const [data, setData] = useState<FundRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const requestBody: any = {
          fields: 'symbol,symbolName,lastPrice,priceChange,percentChange,managedAssets.format(millions),tradeTime,raw.tradeTime,quickLink',
          lists: 'funds.aum.tsx',
          fieldCaptions: { managedAssets: 'AUM' },
          limit,
        };

        // Only add sorting parameters if a column has been clicked
        if (orderBy) {
          requestBody.orderBy = orderBy;
          requestBody.orderDir = orderDir;
        }

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) throw new Error('API error');
        const json = await response.json();
        setData(json.data.map((row: any) => ({
          symbol: row.symbol,
          symbolName: row.symbolName,
          lastPrice: row.lastPrice,
          priceChange: row.priceChange,
          percentChange: row.percentChange,
          managedAssets: row.managedAssets,
          tradeTime: row.tradeTime,
          rawTradeTime: row.raw?.tradeTime,
        })));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [orderBy, orderDir, limit]);

    function handleSort(col: string) {
      if (orderBy === col) {
        setOrderDir(orderDir === 'asc' ? 'desc' : 'asc');
      } else {
        setOrderBy(col);
        setOrderDir('asc');
      }
    }

  // handleSort already defined below, remove duplicate

  return (
    <>
      <FundTable
        data={data}
        loading={loading}
        error={error}
        orderBy={orderBy}
        orderDir={orderDir}
        onSort={handleSort}
        showCount={false}
      />
      <div style={{ marginBottom: 12, textAlign: 'left', color: '#666', width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
        <label>
          Number of Funds:
          <select
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            style={{ width: 80, marginLeft: 8 }}
            data-testid="number-of-funds-select"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </label>
      </div>
      <div style={{ color: '#bbb', fontSize: 14, textAlign: 'center', margin: '32px 0 0 0' }}>
        Data from Globe and Mail API. For demo purposes only.
      </div>
    </>
  );
}


function HeaderWithRouter(): ReactElement {
  const location = useLocation();
  return (
    <header style={{ marginBottom: 8, padding: 12, background: '#f8f9fa', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: 24 }}>
      <Link to="/api-sort" style={{ fontWeight: location.pathname === '/api-sort' ? 'bold' : undefined }}>API Sorting</Link>
      <Link to="/local-sort" style={{ fontWeight: location.pathname === '/local-sort' ? 'bold' : undefined }}>Client-Side Sorting</Link>
    </header>
  );
}

function App(): ReactElement {
  return (
    <Router>
      <HeaderWithRouter />
      <Routes>
        <Route path="/" element={<ApiSortPage />} />
        <Route path="/api-sort" element={<ApiSortPage />} />
        <Route path="/local-sort" element={<LocalSortPage />} />
      </Routes>
    </Router>
  );
}

export default App;
