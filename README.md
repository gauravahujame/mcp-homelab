# MCP Homelab

MCP server setup for homelab integration with Perplexity AI - provides filesystem access and command execution capabilities.

## Overview

This project enables **Perplexity AI** to securely access your homelab through Model Context Protocol (MCP) servers. It provides:

- 📁 **Filesystem Access**: Read/write files in allowed directories (dotfiles, config, workspace)
- 💻 **Command Execution**: Safe execution of whitelisted system and Docker commands
- 🌐 **Remote Access**: HTTP gateway for integration with Perplexity's remote MCP support
- 🔒 **Security**: Path restrictions and command whitelisting

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Nginx Proxy Manager (or similar reverse proxy)
- Domain with SSL certificate

### Deployment

```bash
# Clone the repository
git clone https://github.com/gauravahujame/mcp-homelab.git
cd mcp-homelab

# Start the services
chmod +x start-poc.sh
./start-poc.sh
```

### Reverse Proxy Setup

Add to your Nginx Proxy Manager:
- **Domain**: `mcp.yourdomain.com`
- **Forward to**: `your-docker-host-ip:3000`
- **SSL**: Enable with Let's Encrypt
- **WebSocket Support**: ✅ Enabled

### Perplexity Integration

1. Open Perplexity (Mac app)
2. Go to **Settings** → **Connectors** → **Add Connector**
3. Choose **Advanced** tab for remote MCP
4. Add URL: `https://mcp.yourdomain.com`
5. Test with: "List files in my workspace directory"

## Architecture

```
Perplexity AI → HTTPS → Nginx Proxy → Gateway:3000 → MCP Servers
                                           ├─ Filesystem:3001
                                           └─ Shell:3002
```

### Services

| Service | Port | Purpose |
|---------|------|----------|
| **Gateway** | 3000 | HTTP-to-MCP bridge for Perplexity |
| **Filesystem** | 3001 | File operations MCP server |
| **Shell** | 3002 | Safe command execution |

## File Structure

```
mcp-homelab/
├── docker-compose.yml      # Main orchestration
├── start-poc.sh           # Quick deployment script
├── filesystem/
│   └── start.sh          # Filesystem MCP startup
├── gateway/
│   ├── package.json      # HTTP gateway dependencies
│   └── server.js         # HTTP-to-MCP bridge
└── shell/
    ├── package.json      # Shell service dependencies
    └── server.js         # Safe command execution
```

## Security Features

### Filesystem Access
- **Path Restrictions**: Only allowed directories are accessible
  - `~/.config` (read-only)
  - `~/.dotfiles` (read-only)
  - `~/workspace` (read-write)

### Command Execution
- **Whitelist Only**: Predefined safe commands
  - `docker ps`, `docker images`
  - `systemctl status docker`
  - `df -h`, `free -m`, `uptime`
- **Timeout Protection**: 10-second execution limit
- **Error Handling**: Secure error responses

## Example Usage

Once integrated with Perplexity, you can:

```
💬 "Show me my current Docker containers"
💬 "List files in my workspace directory"
💬 "What's in my .zshrc file?"
💬 "Check system disk usage"
💬 "Create a new docker-compose.yml for nginx"
```

## Development

### Adding New Commands

Edit `shell/server.js` and add to `ALLOWED_COMMANDS`:

```javascript
const ALLOWED_COMMANDS = [
  'docker ps',
  // Add your command here
  'your-new-command'
];
```

### Adding New Paths

Edit `filesystem/start.sh` to include additional directories:

```bash
exec npx @modelcontextprotocol/server-filesystem \
  --host 0.0.0.0 \
  --port 3001 \
  /allowed/config \
  /allowed/dotfiles \
  /allowed/workspace \
  /allowed/your-new-path
```

## Troubleshooting

### Services Not Starting
```bash
# Check logs
docker-compose logs -f

# Restart services
docker-compose down && docker-compose up -d
```

### Perplexity Connection Issues
1. Verify HTTPS certificate is valid
2. Check WebSocket support is enabled
3. Test endpoint manually: `curl https://mcp.yourdomain.com/health`

### Permission Errors
```bash
# Fix script permissions
chmod +x filesystem/start.sh start-poc.sh

# Check Docker socket access
ls -la /var/run/docker.sock
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Test your changes locally
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Links

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Perplexity MCP Integration Guide](https://www.perplexity.ai/help-center/en/articles/11502712-local-and-remote-mcps-for-perplexity)
- [Official MCP Filesystem Server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
