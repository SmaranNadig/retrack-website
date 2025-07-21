 import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygZEBgBwMeWUhWDJsWofTAAgKNBWSzlsuvcYrikTulqiOzFLkmZU1OIgphwct5_YSuBQ/exec';

app.post('/proxy', async (req, res) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.text();
    res.status(200).send(data);
  } catch (error) {
    console.error('Error in proxy:', error);
    res.status(500).send('Proxy error: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
