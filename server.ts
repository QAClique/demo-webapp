import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 5174;

app.use(cors());
app.use(express.json());

app.post('/api/funds', async (req, res) => {
  try {
    const apiRes = await fetch('https://globeandmail.pl.barchart.com/module/dataTable.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await apiRes.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
