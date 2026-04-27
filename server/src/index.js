import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { LobbyManager } from './lobby/LobbyManager.js';
import { registerLobbyHandlers } from './lobby/lobbyHandlers.js';

const PORT = process.env.PORT || 3001;

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

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', rooms: lobbyManager.getRoomCount() });
});

const lobbyManager = new LobbyManager(io);

io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  registerLobbyHandlers(io, socket, lobbyManager);

  socket.on('disconnect', (reason) => {
    console.log(`[socket] disconnected: ${socket.id} (${reason})`);
    lobbyManager.handleDisconnect(socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[server] ST-CCG server running on port ${PORT}`);
});
