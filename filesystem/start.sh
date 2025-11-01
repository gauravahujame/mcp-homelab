#!/bin/sh
npm install -g @modelcontextprotocol/server-filesystem
exec npx @modelcontextprotocol/server-filesystem \
  --host 0.0.0.0 \
  --port 3001 \
  /allowed/config \
  /allowed/dotfiles \
  /allowed/workspace
