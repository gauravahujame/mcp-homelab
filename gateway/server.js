const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Simple HTTP-to-MCP bridge
app.post('/mcp/filesystem', async (req, res) => {
  try {
    const { method, params } = req.body;
    
    // Proxy to filesystem MCP server
    const response = await fetch('http://mcp-filesystem:3001/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, params })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('MCP Gateway running on port 3000');
});
