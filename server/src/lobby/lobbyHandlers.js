/**
 * registerLobbyHandlers — wires up all lobby-related socket events for one
 * connected client.
 *
 * Events handled (client → server):
 *   lobby:create   { playerName, deck? }
 *   lobby:join     { roomCode, playerName }
 *   lobby:deck     { deck }           submit / update deck selection
 *   lobby:ready    { ready }          toggle ready (true/false)
 *   lobby:leave                       voluntarily leave room
 *
 * Events emitted (server → client):
 *   lobby:created  { room }           to creator only
 *   lobby:update   { room }           to all players in room after any change
 *   lobby:error    { message }        to the socket that caused the error
 *   game:start     { ... }            when both players are ready (Phase 5)
 */
export function registerLobbyHandlers(io, socket, lobbyManager) {

  // ── lobby:create ────────────────────────────────────────────────────
  socket.on('lobby:create', ({ playerName } = {}) => {
    try {
      const room = lobbyManager.createRoom(socket.id, playerName);
      socket.join(room.code);
      socket.emit('lobby:created', { room: room.toPublicJSON(socket.id) });
      console.log(`[lobby:create] room ${room.code} created`);
    } catch (err) {
      socket.emit('lobby:error', { message: err.message });
    }
  });

  // ── lobby:join ──────────────────────────────────────────────────────
  socket.on('lobby:join', ({ roomCode, playerName } = {}) => {
    try {
      const room = lobbyManager.joinRoom(roomCode, socket.id, playerName);
      socket.join(room.code);

      // Notify joiner
      socket.emit('lobby:joined', { room: room.toPublicJSON(socket.id) });

      // Notify everyone in the room (including joiner via broadcast)
      io.to(room.code).emit('lobby:update', {
        room: room.toPublicJSON(socket.id), // joiner's view
      });

      // Also send the host an updated room from their own perspective
      const host = room.playerList.find((p) => p.socketId !== socket.id);
      if (host) {
        io.to(host.socketId).emit('lobby:update', {
          room: room.toPublicJSON(host.socketId),
        });
      }

      console.log(`[lobby:join] ${playerName} joined room ${room.code}`);
    } catch (err) {
      socket.emit('lobby:error', { message: err.message });
    }
  });

  // ── lobby:deck ──────────────────────────────────────────────────────
  socket.on('lobby:deck', ({ deck } = {}) => {
    try {
      const room = lobbyManager.findRoomBySocket(socket.id);
      if (!room) throw new Error('You are not in a room');

      lobbyManager.submitDeck(room.code, socket.id, deck);
      _broadcastRoomUpdate(io, socket, room);
      console.log(`[lobby:deck] deck submitted in room ${room.code}`);
    } catch (err) {
      socket.emit('lobby:error', { message: err.message });
    }
  });

  // ── lobby:ready ─────────────────────────────────────────────────────
  socket.on('lobby:ready', ({ ready = true } = {}) => {
    try {
      const room = lobbyManager.findRoomBySocket(socket.id);
      if (!room) throw new Error('You are not in a room');

      lobbyManager.setReady(room.code, socket.id, ready);
      _broadcastRoomUpdate(io, socket, room);

      // If both players are ready, start the game
      if (room.bothReady) {
        console.log(`[lobby] both ready in room ${room.code} — starting game`);
        room.status = 'in_progress';
        // GameEngine will be initialised here in Phase 5
        // For now, emit a placeholder start event
        io.to(room.code).emit('game:starting', { roomCode: room.code });
      }
    } catch (err) {
      socket.emit('lobby:error', { message: err.message });
    }
  });

  // ── lobby:leave ─────────────────────────────────────────────────────
  socket.on('lobby:leave', () => {
    _handlePlayerLeave(io, socket, lobbyManager);
  });
}

// ── Shared helpers ─────────────────────────────────────────────────────

/** Broadcast the current room state to every player from their own perspective. */
function _broadcastRoomUpdate(io, socket, room) {
  for (const player of room.playerList) {
    io.to(player.socketId).emit('lobby:update', {
      room: room.toPublicJSON(player.socketId),
    });
  }
}

/** Handle a player leaving (used by both lobby:leave and disconnect). */
export function _handlePlayerLeave(io, socket, lobbyManager) {
  const room = lobbyManager.handleDisconnect(socket.id);
  if (!room) return;

  socket.leave(room.code);

  // Notify remaining players
  for (const player of room.playerList) {
    io.to(player.socketId).emit('lobby:update', {
      room: room.toPublicJSON(player.socketId),
    });
    io.to(player.socketId).emit('lobby:player_left', {
      message: 'The other player has left the room.',
    });
  }
}
