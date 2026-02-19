import { useState } from 'react';

export const API_URL = 'http://localhost:5174/api/funds';

export function useSortState() {
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');

  function handleSort(col: string) {
    if (orderBy === col) {
      setOrderDir(orderDir === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(col);
      setOrderDir('asc');
    }
  }

  return { orderBy, orderDir, handleSort } as const;
}

/** Shape of a single fund row as returned by the Globe and Mail API. */
export interface ApiFundRow {
  symbol: string;
  symbolName: string;
  lastPrice: string;
  priceChange: string;
  percentChange: string;
  managedAssets: string;
  tradeTime: string;
  raw?: {
    tradeTime?: number;
    priceChange?: number;
    percentChange?: number;
  };
}
