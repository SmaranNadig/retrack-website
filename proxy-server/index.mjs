import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 10000;

// CORS configuration - this handles preflight requests automatically
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json());

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyEp4GuF6CxC0UhhfdmyiNaa0w8hTZYOaz24c1klyoxTwm4VfTQ0U056tK2h09SSadaFQ/exec';
//https://script.google.com/macros/s/AKfycbzfIVY8zaE0cNDtsWhD1iJ6nAdRfLbn7g3cj4kD9uPc0Ys18EezNnLXlMtwSpRkJ-IMhw/exec
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    endpoints: ['/proxy', '/api/proxy', '/lookup']
  });
});

// Root health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'ReTrack Proxy Server', 
    status: 'running',
    endpoints: {
      health: '/health',
      proxy: '/proxy',
      apiProxy: '/api/proxy',
      lookup: '/lookup'
    }
  });
});

// Main proxy endpoint that the HTML expects
app.post('/proxy', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    
    const sheetRes = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    if (!sheetRes.ok) {
      throw new Error(`Google Apps Script responded with ${sheetRes.status}: ${sheetRes.statusText}`);
    }
    
    const data = await sheetRes.json();
    console.log('Google Apps Script response:', data);
    
    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Proxy request failed', 
      detail: err.message 
    });
  }
});

// Alternative API proxy endpoint
app.post('/api/proxy', async (req, res) => {
  try {
    console.log('API Proxy - Received request:', req.body);
    
    const sheetRes = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    if (!sheetRes.ok) {
      throw new Error(`Google Apps Script responded with ${sheetRes.status}: ${sheetRes.statusText}`);
    }
    
    const data = await sheetRes.json();
    console.log('Google Apps Script response:', data);
    
    res.json(data);
  } catch (err) {
    console.error('API Proxy error:', err);
    res.status(500).json({ 
      success: false,
      error: 'API proxy request failed', 
      detail: err.message 
    });
  }
});

// Keep your original lookup endpoint for backward compatibility
app.post('/lookup', async (req, res) => {
  try {
    console.log('Lookup - Received request:', req.body);
    
    const sheetRes = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    if (!sheetRes.ok) {
      throw new Error(`Google Apps Script responded with ${sheetRes.status}: ${sheetRes.statusText}`);
    }
    
    const data = await sheetRes.json();
    console.log('Google Apps Script response:', data);
    
    res.json(data);
  } catch (err) {
    console.error('Lookup error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Lookup proxy failed', 
      detail: err.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error', 
    detail: err.message 
  });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Endpoint not found', 
    availableEndpoints: ['/', '/health', '/proxy', '/api/proxy', '/lookup']
  });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  GET  http://localhost:${PORT}/health`);
  console.log(`  POST http://localhost:${PORT}/proxy`);
  console.log(`  POST http://localhost:${PORT}/api/proxy`);
  console.log(`  POST http://localhost:${PORT}/lookup`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
