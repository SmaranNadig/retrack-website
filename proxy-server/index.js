// index.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // required for backend HTTP requests

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Your Google Apps Script URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygZEBgBwMeWUhWDJsWofTAAgKNBWSzlsuvcYrikTulqiOzFLkmZU1OIgphwct5_YSuBQ/exec';

// Proxy route
app.post('/proxy', async (req, res) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.text(); // Apps Script often returns plain text
    res.status(200).send(data);
  } catch (error) {
    console.error('Error in proxy:', error);
    res.status(500).send('Proxy error: ' + error.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
