import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5174;
const MOCK_DATA_FILE = process.env.MOCK_DATA_FILE;

app.use(cors());
app.use(express.json());

app.post('/api/funds', async (req, res) => {
  try {
    if (MOCK_DATA_FILE) {
      console.log('Using mock data from:', MOCK_DATA_FILE);

      // Load mock data from file
      const mockFilePath = path.join(process.cwd(), MOCK_DATA_FILE);

      if (!fs.existsSync(mockFilePath)) {
        throw new Error(`Mock data file "${MOCK_DATA_FILE}" not found`);
      }

      const mockDataContent = fs.readFileSync(mockFilePath, 'utf8');
      const mockData = JSON.parse(mockDataContent);

      // Return the exact JSON file as the API response
      res.json(mockData);
    } else {
      console.log('Using real API');

      // Proxy to real API
      const apiRes = await fetch('https://globeandmail.pl.barchart.com/module/dataTable.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      const data = await apiRes.json();
      res.json(data);
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: 'Server error', details: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  if (MOCK_DATA_FILE) {
    console.log(`Mock mode enabled: ${MOCK_DATA_FILE}`);
  } else {
    console.log('Real API mode enabled');
  }
});
