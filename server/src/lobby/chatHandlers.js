import { v4 as uuidv4 } from 'uuid';

/**
 * registerChatHandlers — wires up in-game chat for one connected socket.
 *
 * Events handled (client → server):
 *   chat:message  { text }
 *
 * Events emitted (server → client):
 *   chat:message  { id, senderId, senderName, text, timestamp }
 */
export function registerChatHandlers(io, socket, lobbyManager) {
  socket.on('chat:message', ({ text } = {}) => {
    if (!text?.trim()) return;

    const room = lobbyManager.findRoomBySocket(socket.id);
    if (!room) return;

    const player = room.players[socket.id];
    if (!player) return;

    const entry = {
      id:         uuidv4(),
      senderId:   socket.id,
      senderName: player.name,
      text:       text.trim().slice(0, 200),
      timestamp:  Date.now(),
    };

    // Broadcast to everyone in the room
    io.to(room.code).emit('chat:message', entry);
  });
}
