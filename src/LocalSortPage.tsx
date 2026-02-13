import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import './App.css';
import FundTable from './FundTable';
import type { FundRow } from './FundTable';
import { API_URL, useSortState } from './shared';
import type { ApiFundRow } from './shared';

function LocalSortPage(): ReactElement {
  // State for table data and loading
  const [data, setData] = useState<FundRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { orderBy, orderDir, handleSort } = useSortState();

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
            fields: 'symbol,symbolName,lastPrice,priceChange,percentChange,managedAssets.format(millions),tradeTime,raw.tradeTime,quickLink',
            lists: 'funds.aum.tsx',
            fieldCaptions: { managedAssets: 'AUM' },
            // No limit: get all funds
          }),
        });
        if (!response.ok) throw new Error('API error');
        const json = await response.json();
        setData(json.data.map((row: ApiFundRow) => ({
          symbol: row.symbol,
          symbolName: row.symbolName,
          lastPrice: row.lastPrice,
          priceChange: row.priceChange,
          percentChange: row.percentChange,
          managedAssets: row.managedAssets,
          tradeTime: row.tradeTime,
          rawTradeTime: row.raw?.tradeTime,
          rawPriceChange: row.raw?.priceChange,
          rawPercentChange: row.raw?.percentChange,
        })));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Locally sort data only if a column has been selected for sorting
  const sortedData = orderBy ? [...data].sort((a, b) => {
    const aVal = a[orderBy as keyof FundRow];
    const bVal = b[orderBy as keyof FundRow];
    if (aVal === null || aVal === undefined || bVal === null || bVal === undefined) return 0;

    // Use raw numeric values for change columns when available
    let aCompareVal: string | number = aVal;
    let bCompareVal: string | number = bVal;

    if (orderBy === 'priceChange' && a.rawPriceChange !== undefined && b.rawPriceChange !== undefined) {
      aCompareVal = a.rawPriceChange;
      bCompareVal = b.rawPriceChange;
    } else if (orderBy === 'percentChange' && a.rawPercentChange !== undefined && b.rawPercentChange !== undefined) {
      aCompareVal = a.rawPercentChange;
      bCompareVal = b.rawPercentChange;
    }

    if (!isNaN(Number(aCompareVal)) && !isNaN(Number(bCompareVal))) {
      return (Number(aCompareVal) - Number(bCompareVal)) * (orderDir === 'asc' ? 1 : -1);
    }
    return String(aCompareVal).localeCompare(String(bCompareVal)) * (orderDir === 'asc' ? 1 : -1);
  }) : data;

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
