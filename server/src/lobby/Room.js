/**
 * Room — holds two players, their deck selections, and a reference to
 * the GameEngine once the game starts.
 */
export class Room {
  constructor(roomCode, hostSocketId, hostName) {
    this.code = roomCode;
    this.createdAt = Date.now();
    this.status = 'waiting'; // waiting | ready | in_progress | finished

    this.players = {
      [hostSocketId]: {
        socketId: hostSocketId,
        name: hostName,
        playerId: 'player1',
        deck: null,       // validated deck JSON submitted from client
        ready: false,
      },
    };

    this.gameEngine = null; // set when game starts
  }

  get playerList() {
    return Object.values(this.players);
  }

  get isFull() {
    return Object.keys(this.players).length >= 2;
  }

  get hostSocketId() {
    return this.playerList[0]?.socketId ?? null;
  }

  addPlayer(socketId, name) {
    if (this.isFull) throw new Error('Room is full');
    this.players[socketId] = {
      socketId,
      name,
      playerId: 'player2',
      deck: null,
      ready: false,
    };
  }

  removePlayer(socketId) {
    delete this.players[socketId];
  }

  setDeck(socketId, deck) {
    if (!this.players[socketId]) throw new Error('Player not in room');
    this.players[socketId].deck = deck;
  }

  setReady(socketId, ready) {
    if (!this.players[socketId]) throw new Error('Player not in room');
    this.players[socketId].ready = ready;
  }

  get bothReady() {
    const list = this.playerList;
    return list.length === 2 && list.every((p) => p.ready && p.deck !== null);
  }

  /** Safe public snapshot — never exposes deck contents to other player */
  toPublicJSON(forSocketId) {
    return {
      code: this.code,
      status: this.status,
      players: this.playerList.map((p) => ({
        socketId: p.socketId,
        name: p.name,
        playerId: p.playerId,
        hasDeck: p.deck !== null,
        ready: p.ready,
        isYou: p.socketId === forSocketId,
      })),
    };
  }
}
