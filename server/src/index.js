import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { LobbyManager } from './lobby/LobbyManager.js';
import { registerLobbyHandlers } from './lobby/lobbyHandlers.js';
import { registerChatHandlers } from './lobby/chatHandlers.js';
import { registerCardRoutes } from './api/cardRoutes.js';
import { cardDB } from './data/CardDatabase.js';

const PORT = process.env.PORT || 3001;

// ── Load card database first ─────────────────────────────────────────
cardDB.load();

// ── Express + Socket.io ──────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// ── REST routes ──────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', rooms: lobbyManager.getRoomCount(), cards: cardDB.cards.size });
});

registerCardRoutes(app);

// ── Socket.io ────────────────────────────────────────────────────────
const lobbyManager = new LobbyManager();

io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);
  registerLobbyHandlers(io, socket, lobbyManager);
  registerChatHandlers(io, socket, lobbyManager);

  socket.on('disconnect', (reason) => {
    console.log(`[socket] disconnected: ${socket.id} (${reason})`);
    lobbyManager.handleDisconnect(socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[server] ST-CCG server running on port ${PORT}`);
});
