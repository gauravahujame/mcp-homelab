const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Allowed commands for POC
const ALLOWED_COMMANDS = [
  'docker ps',
  'docker images', 
  'docker-compose ps',
  'systemctl status docker',
  'df -h',
  'free -m',
  'uptime'
];

app.post('/execute', (req, res) => {
  const { command } = req.body;
  
  if (!ALLOWED_COMMANDS.includes(command)) {
    return res.status(403).json({ error: 'Command not allowed' });
  }
  
  exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({
      command,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      timestamp: new Date().toISOString()
    });
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(3002, '0.0.0.0', () => {
  console.log('MCP Shell server running on port 3002');
});
