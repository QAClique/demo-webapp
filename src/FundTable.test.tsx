import { browser, $ } from '@wdio/globals'
import { render } from '@testing-library/react'
import LocalSortPage from './LocalSortPage'

// Sample mock data that matches the expected API response structure
const mockApiResponse = {
  data: [
    {
      symbol: 'TDB902',
      symbolName: 'TD Canadian Bond Index Fund',
      lastPrice: '$10.45',
      priceChange: '+0.05',
      percentChange: '+0.48%',
      managedAssets: '$1,234.5M',
      tradeTime: '4:00 PM ET',
      raw: { tradeTime: 1631721600 }
    },
    {
      symbol: 'TDB900',
      symbolName: 'TD Canadian Index Fund',
      lastPrice: '$35.82',
      priceChange: '-0.12',
      percentChange: '-0.33%',
      managedAssets: '$2,567.8M',
      tradeTime: '4:00 PM ET',
      raw: { tradeTime: 1631721600 }
    },
    {
      symbol: 'TDB901',
      symbolName: 'TD US Index Fund',
      lastPrice: '$28.91',
      priceChange: '+0.23',
      percentChange: '+0.80%',
      managedAssets: '$987.3M',
      tradeTime: '4:00 PM ET',
      raw: { tradeTime: 1631721600 }
    }
  ]
};

describe('Front End Sorting Tests', () => {
  it('should show sort indicator on Last Price column', async () => {
    // Mock fetch globally in the browser context
    await browser.execute((mockData: any) => {
      const originalFetch = window.fetch;
      window.fetch = async (url: any, options: any) => {
        if (url.includes('/api/funds')) {
          return new Response(JSON.stringify(mockData), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
        return originalFetch(url, options);
      };
    }, mockApiResponse);

    render(<LocalSortPage />)
    await $('th[data-testid="lastPrice"]').click();

    await $('[data-testid="sort-indicator-lastPrice"]')
      .waitForDisplayed({ timeoutMsg: 'Expected: Sort indicator is displayed in the "Last Price" column, but it was not' });
    await browser.pause(15000); // Pause to visually confirm the sort indicator during demo (use DEBUG=true to see output)
  })
})
