import { Room } from './Room.js';

const ROOM_CODE_LENGTH = 4;
const ROOM_TTL_MS = 1000 * 60 * 60 * 2; // 2 hours

/**
 * LobbyManager — owns all active rooms and manages their lifecycle.
 * It does NOT own the io instance for emitting; callers (lobbyHandlers)
 * handle all socket emissions so this class stays pure/testable.
 */
export class LobbyManager {
  constructor() {
    this.rooms = new Map(); // code → Room
    this._startCleanupTimer();
  }

  getRoomCount() {
    return this.rooms.size;
  }

  /** Create a new room and return it. Throws if name is missing. */
  createRoom(hostSocketId, hostName) {
    if (!hostName?.trim()) throw new Error('Player name is required');
    const code = this._generateCode();
    const room = new Room(code, hostSocketId, hostName);
    this.rooms.set(code, room);
    console.log(`[lobby] room created: ${code} by ${hostName} (${hostSocketId})`);
    return room;
  }

  /** Join an existing room. Returns the room. */
  joinRoom(code, socketId, playerName) {
    const room = this._getRoom(code);
    if (room.isFull) throw new Error('Room is full');
    if (room.status !== 'waiting') throw new Error('Game already in progress');
    if (!playerName?.trim()) throw new Error('Player name is required');
    room.addPlayer(socketId, playerName);
    console.log(`[lobby] ${playerName} (${socketId}) joined room ${code}`);
    return room;
  }

  /** Submit / update a player's deck selection. */
  submitDeck(code, socketId, deck) {
    const room = this._getRoom(code);
    // Basic sanity — full validation happens in DeckValidator
    if (!deck || !Array.isArray(deck.missions)) {
      throw new Error('Invalid deck format');
    }
    room.setDeck(socketId, deck);
    return room;
  }

  /** Toggle ready state. Returns the room. */
  setReady(code, socketId, ready) {
    const room = this._getRoom(code);
    room.setReady(socketId, ready);
    return room;
  }

  /** Returns the room a socket is currently in, or null. */
  findRoomBySocket(socketId) {
    for (const room of this.rooms.values()) {
      if (room.players[socketId]) return room;
    }
    return null;
  }

  /** Called when a socket disconnects. Cleans up their room presence. */
  handleDisconnect(socketId) {
    const room = this.findRoomBySocket(socketId);
    if (!room) return null;

    room.removePlayer(socketId);
    console.log(`[lobby] ${socketId} left room ${room.code}`);

    // If room is now empty, remove it
    if (room.playerList.length === 0) {
      this.rooms.delete(room.code);
      console.log(`[lobby] room ${room.code} removed (empty)`);
    }

    return room;
  }

  // ── Private helpers ──────────────────────────────────────────────────

  _getRoom(code) {
    const room = this.rooms.get(code?.toUpperCase());
    if (!room) throw new Error(`Room "${code}" not found`);
    return room;
  }

  _generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code;
    do {
      code = Array.from({ length: ROOM_CODE_LENGTH }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
    } while (this.rooms.has(code));
    return code;
  }

  _startCleanupTimer() {
    setInterval(() => {
      const now = Date.now();
      for (const [code, room] of this.rooms.entries()) {
        if (now - room.createdAt > ROOM_TTL_MS) {
          this.rooms.delete(code);
          console.log(`[lobby] room ${code} expired`);
        }
      }
    }, 1000 * 60 * 15); // run every 15 minutes
  }
}
