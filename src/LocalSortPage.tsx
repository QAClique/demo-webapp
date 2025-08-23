import { useEffect, useState } from 'react';
import './App.css';
import FundTable from './FundTable';
import type { FundRow } from './FundTable';

// FundRow imported from FundTable

// Use the local proxy server
const API_URL = 'http://localhost:5174/api/funds';

function LocalSortPage() {
  // State for table data, sorting, and row limit
  const [data, setData] = useState<FundRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState('symbol');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');
  // No limit: always load all funds for front-end sorting

  // Fetch data from the API (no orderBy/orderDir)
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
            // No limit: get all funds
          }),
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
        })));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Local sort handler
  function handleSort(col: string) {
    if (orderBy === col) {
      setOrderDir(orderDir === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(col);
      setOrderDir('asc');
    }
  }

  // Locally sort data
  const sortedData = [...data].sort((a, b) => {
    const aVal = a[orderBy as keyof typeof data[0]];
    const bVal = b[orderBy as keyof typeof data[0]];
    if (!aVal || !bVal) return 0;
    if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
      return (Number(aVal) - Number(bVal)) * (orderDir === 'asc' ? 1 : -1);
    }
    return String(aVal).localeCompare(String(bVal)) * (orderDir === 'asc' ? 1 : -1);
  });

  return (
    <>
      <FundTable
        data={sortedData}
        loading={loading}
        error={error}
        orderBy={orderBy}
        orderDir={orderDir}
        onSort={handleSort}
        showCount={true}
      />
      <div style={{ color: '#bbb', fontSize: 14, textAlign: 'center', margin: '32px 0 0 0' }}>
        Data from Globe and Mail API. For demo purposes only.
      </div>
    </>
  );
}

export default LocalSortPage;
