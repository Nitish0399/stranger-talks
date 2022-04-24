class SocketState {
  constructor() {
    this.strangersOnlineCount = 0;
    this.strangersAvailable = [];
    this.strangersConnected = {};
    this.strangersTimeouts = {};
  }
}

module.exports = SocketState;
