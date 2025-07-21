import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbygZEBgBwMeWUhWDJsWofTAAgKNBWSzlsuvcYrikTulqiOzFLkmZU1OIgphwct5_YSuBQ/exec';

app.post('/lookup', async (req, res) => {
  try {
    const sheetRes = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await sheetRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Lookup proxy failed', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
