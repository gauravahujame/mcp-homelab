#!/bin/sh
set -e

# Install filesystem server (Node 20+ base image)
npm install -g @modelcontextprotocol/server-filesystem

# Run in one line to avoid shell continuation issues
exec npx @modelcontextprotocol/server-filesystem --host 0.0.0.0 --port 3001 /allowed/config /allowed/dotfiles /allowed/workspace
