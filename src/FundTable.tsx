export type FundRow = {
  symbol: string;
  symbolName: string;
  lastPrice: string;
  priceChange: string;
  percentChange: string;
  managedAssets: string;
  tradeTime: string;
  rawTradeTime?: number;
};

export const fields = [
  { key: 'symbol', label: 'Symbol' },
  { key: 'symbolName', label: 'Name' },
  { key: 'lastPrice', label: 'Last Price' },
  { key: 'priceChange', label: 'Change' },
  { key: 'percentChange', label: '% Change' },
  { key: 'managedAssets', label: 'AUM' },
  { key: 'tradeTime', label: 'Trade Time' },
];

function formatChange(val: string) {
  if (val == null || val === '') return { content: '', className: '' };
  // Remove any leading + from API, we'll add our own
  const raw = val.replace(/^\+/, '');
  const num = Number(raw.replace(/[^\d.-]/g, ''));
  if (isNaN(num)) return { content: val, className: '' };
  const className = num > 0 ? 'pos' : num < 0 ? 'neg' : '';
  const sign = num > 0 ? '+' : '';
  return { content: `${sign}${raw}`, className };
}

function formatDate(rawTradeTime?: number) {
  // Use the raw trade time (Unix timestamp in seconds)
  if (rawTradeTime != null) {
    // Convert seconds to milliseconds
    const date = new Date(rawTradeTime * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return '';
}

export default function FundTable({ data, loading, error, orderBy, orderDir, onSort, showCount }: {
  data: FundRow[];
  loading: boolean;
  error: string | null;
  orderBy: string | null;
  orderDir: 'asc' | 'desc';
  onSort: (col: string) => void;
  showCount?: boolean;
}) {
  return (
  <div className="container" style={{ position: 'relative', minHeight: 400 }}>
      {loading && (
        <div className="loading-overlay"><div className="spinner" /></div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
  <h1 style={{ fontWeight: 800, fontSize: '2.8rem', margin: '8px 0 12px 0', textAlign: 'left', letterSpacing: 0.5, lineHeight: 1.1 }}>Mutual Funds Leader</h1>
  <table className={`fund-table${loading ? ' disabled' : ''}`} style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16, border: '1.5px solid #bbb' }}>
        <thead>
          <tr>
            {fields.map(col => (
              <th
                key={col.key}
                data-testid={col.key === 'tradeTime' ? 'raw.tradeTime' : col.key}
                style={{ cursor: 'pointer', userSelect: 'none', padding: 8, borderBottom: '1.5px solid #bbb' }}
                onClick={() => onSort(col.key)}
              >
                {col.label}
                {orderBy === col.key && (
                  <span
                    data-testid={`sort-indicator-${col.key}`}
                    data-sort-direction={orderDir}
                    style={{ marginLeft: 4 }}
                  >
                    {orderDir === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const isLast = i === data.length - 1;
            return (
              <tr key={row.symbol + i}>
                {fields.map(col => {
                  let content: any = row[col.key as keyof FundRow];
                  let style: any = { padding: 8, borderBottom: isLast ? '1.5px solid #bbb' : '1px solid #f3f3f3', textAlign: 'center' };
                  let className = col.key === 'symbol' ? 'left' : '';

                  // Only Name column is left-aligned
                  if (col.key === 'symbol') {
                    style = { ...style, fontWeight: 500 };
                    content = (
                      <a
                        href={`https://www.theglobeandmail.com/investing/markets/funds/${row.symbol}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'underline', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit', background: 'none' }}
                      >
                        {row.symbol}
                      </a>
                    );
                  }
                  if (col.key === 'symbolName') {
                    style = { ...style, textAlign: 'left' };
                  }
                  if (col.key === 'priceChange' || col.key === 'percentChange') {
                    const changeResult = formatChange(content);
                    content = changeResult.content;
                    if (changeResult.className) {
                      className += (className ? ' ' : '') + changeResult.className;
                    }
                  }
                  if (col.key === 'tradeTime') {
                    content = formatDate(row.rawTradeTime);
                    style = { ...style, color: undefined };
                  }
                  return (
                    <td key={col.key} className={className} style={style} data-testid={col.key === 'tradeTime' ? 'raw.tradeTime' : col.key}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {showCount && (
        <div style={{ marginBottom: 12, textAlign: 'right', color: '#666' }}>
          Showing {data.length.toLocaleString()} funds
        </div>
      )}
    </div>
  );
}
