class ChatSocket {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  connectStranger() {
    this.socket.emit('chat:connect');
  }

  messageStranger(message) {
    this.socket.emit('chat:message', message);
  }

  disconnectChat() {
    this.socket.emit('chat:disconnect');
  }
}

export default ChatSocket;
