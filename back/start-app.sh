#!/bin/bash
docker compose --env-file .env up --build -d
node src/server.js