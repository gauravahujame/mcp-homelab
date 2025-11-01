#!/bin/bash
set -e

echo "🚀 Starting MCP Homelab POC..."

# Make filesystem script executable (redundant but safe)
chmod +x filesystem/start.sh

# Start services
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 15

# Test endpoints
echo "🧪 Testing services..."

echo "Testing Gateway..."
curl -s http://localhost:3000/health | jq . || echo "Gateway not ready yet"

echo "Testing Shell service..."
curl -s http://localhost:3002/health | jq . || echo "Shell service not ready yet"

echo "✅ POC started! Services running on:"
echo "   - Gateway: http://localhost:3000"  
echo "   - Filesystem: http://localhost:3001"
echo "   - Shell: http://localhost:3002"

echo ""
echo "🔧 Add to Nginx Proxy Manager:"
echo "   - Domain: mcp.yourdomain.com"
echo "   - Forward to: $(hostname -I | awk '{print $1}'):3000"
echo "   - Enable WebSocket support"
echo ""
echo "📝 To add to Perplexity:"
echo "   - Settings → Connectors → Add Remote MCP"
echo "   - URL: https://mcp.yourdomain.com"
