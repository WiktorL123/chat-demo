# Anonymous WebSocket Chat

A simple real-time WebSocket chat app that pairs users randomly.  
Each page load creates a new temporary user instance.

## Tech Stack

- **Frontend**: Vite + React
- **Backend**: Express + WebSocket 
- **Database**: MongoDB (for storing messages and chat sessions)
- **Styling**: React inline styles 
- **Communication**: WebSocket only (no REST API)

## Features

- Automatic random user pairing
- Text message exchange
- Waiting screen when no partner is available
- Auto session closing on disconnect
- Message and session history stored in MongoDB

## Getting Started

Make sure you have:
- Node.js installed
- Docker (if you want to run MongoDB locally)

Then simply run:

```bash
./start-app.sh
