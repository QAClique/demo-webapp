
import { useEffect, useState } from 'react';
import './App.css';

// The columns to display, matching the API fields (no Link column)
const fields = [
  { key: 'symbol', label: 'Symbol' },
  { key: 'symbolName', label: 'Name' },
  { key: 'lastPrice', label: 'Last Price' },
  { key: 'priceChange', label: 'Change' },
  { key: 'percentChange', label: '% Change' },
  { key: 'managedAssets', label: 'AUM' },
  { key: 'tradeTime', label: 'Trade Time' },
];

type FundRow = {
  symbol: string;
  symbolName: string;
  lastPrice: string;
  priceChange: string;
  percentChange: string;
  managedAssets: string;
  tradeTime: string;
};

// Use the local proxy server
const API_URL = 'http://localhost:5174/api/funds';

function App() {
  // State for table data, sorting, and row limit
  const [data, setData] = useState<FundRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState('symbol');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');
  const [limit, setLimit] = useState(50);

  // Fetch data from the API whenever sorting or limit changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: 'symbol,symbolName,lastPrice,priceChange,percentChange,managedAssets.format(millions),tradeTime,quickLink',
            lists: 'funds.aum.tsx',
            fieldCaptions: { managedAssets: 'AUM' },
            orderDir,
            orderBy,
            limit,
          }),
        });
        if (!response.ok) throw new Error('API error');
        const json = await response.json();
        // The API returns data in json.data; map to our FundRow type
        setData(json.data.map((row: any) => ({
          symbol: row.symbol,
          symbolName: row.symbolName,
          lastPrice: row.lastPrice,
          priceChange: row.priceChange,
          percentChange: row.percentChange,
          managedAssets: row.managedAssets,
          tradeTime: formatTradeTime(row.raw?.tradeTime),
        })));

  // Format Unix timestamp to YYYY-MM-DD
  function formatTradeTime(ts: number | undefined): string {
    if (!ts) return '';
    const date = new Date(ts * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [orderBy, orderDir, limit]);

  // Handle sorting when a column header is clicked
  function handleSort(col: string) {
    if (orderBy === col) {
      setOrderDir(orderDir === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(col);
      setOrderDir('asc');
    }
  }

  // Render sort indicator
  function sortIndicator(col: string) {
    if (orderBy !== col) return null;
    return orderDir === 'asc' ? ' ▲' : ' ▼';
  }

  // Helper for color formatting
  function getChangeClass(val: string) {
    if (!val || val === 'unch') return '';
    if (val.startsWith('-')) return 'neg';
    if (val.startsWith('+')) return 'pos';
    return '';
  }

  return (
    <div className="container">
      <h1>Mutual Funds Leader</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div style={{ position: 'relative', overflowX: 'auto' }}>
        {/* Loading overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
        <table className={"fund-table" + (loading ? " disabled" : "") }>
          <thead>
            <tr>
              {fields.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  {col.label}{sortIndicator(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.symbol + i}>
                <td className="left">
                  <a href={`https://www.theglobeandmail.com/investing/markets/funds/${row.symbol}/`} target="_blank" rel="noopener noreferrer">
                    {row.symbol}
                  </a>
                </td>
                <td className="left">{row.symbolName}</td>
                <td className="center">{row.lastPrice}</td>
                <td className={getChangeClass(row.priceChange) + ' center'}>{row.priceChange}</td>
                <td className={getChangeClass(row.percentChange) + ' center'}>{row.percentChange}</td>
                <td className="center">{row.managedAssets}</td>
                <td className="center">{row.tradeTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16 }}>
        <label>
          Rows to display:
          <select value={limit} onChange={e => setLimit(Number(e.target.value))} style={{ marginLeft: 8 }}>
            {[25, 50, 100, 250].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <p style={{ marginTop: 24, fontSize: 12, color: '#888' }}>
        Data from Globe and Mail API. For demo purposes only.
      </p>
    </div>
  );
}

export default App;
