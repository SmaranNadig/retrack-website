const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/submit", async (req, res) => {
  console.log("Received request:", req.body);

  // Forward the request to your Apps Script endpoint
  const fetch = (await import("node-fetch")).default;

  const response = await fetch("https://script.google.com/macros/s/AKfycbygZEBgBwMeWUhWDJsWofTAAgKNBWSzlsuvcYrikTulqiOzFLkmZU1OIgphwct5_YSuBQ/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body)
  });

  const data = await response.text();
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
