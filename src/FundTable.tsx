export type FundRow = {
  symbol: string;
  symbolName: string;
  lastPrice: string;
  priceChange: string;
  percentChange: string;
  managedAssets: string;
  tradeTime: string;
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

function formatNumber(val: string) {
  if (val == null || val === '') return '';
  const num = Number(val.replace(/[^\d.-]/g, ''));
  if (isNaN(num)) return val;
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatAUM(val: string) {
  if (val == null || val === '') return '';
  const num = Number(val.replace(/[^\d.-]/g, ''));
  if (isNaN(num)) return val;
  return num.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' M';
}

function formatChange(val: string) {
  if (val == null || val === '') return '';
  // Remove any leading + from API, we'll add our own
  const raw = val.replace(/^\+/, '');
  const num = Number(raw.replace(/[^\d.-]/g, ''));
  if (isNaN(num)) return val;
  const color = num > 0 ? '#16a34a' : num < 0 ? '#dc2626' : undefined;
  const sign = num > 0 ? '+' : '';
  return <span style={{ color, fontWeight: 500 }}>{sign}{raw}</span>;
}

function formatDate(val: string) {
  if (!val) return '';
  // If it's a unix timestamp (seconds), convert to date
  if (/^\d+$/.test(val)) {
    const date = new Date(Number(val) * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  // If it's a date string, parse and reformat as YYYY-MM-DD
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return val;
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
                style={{ cursor: 'pointer', userSelect: 'none', padding: 8, borderBottom: '1.5px solid #bbb' }}
                onClick={() => onSort(col.key)}
              >
                {col.label}
                {orderBy === col.key && (
                  <span style={{ marginLeft: 4 }}>{orderDir === 'asc' ? '▲' : '▼'}</span>
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
                  // Only Name column is left-aligned
                  if (col.key === 'symbol') {
                    style = { ...style, fontWeight: 500 };
                    // Restore link to Globe site
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
                  if (col.key === 'lastPrice') {
                    content = formatNumber(content);
                  }
                  if (col.key === 'managedAssets') {
                    content = formatAUM(content);
                  }
                  if (col.key === 'priceChange' || col.key === 'percentChange') {
                    content = formatChange(content);
                  }
                  if (col.key === 'tradeTime') {
                    content = formatDate(content);
                    style = { ...style, color: undefined };
                  }
                  return (
                    <td key={col.key} className={col.key === 'symbol' ? 'left' : ''} style={style}>
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
