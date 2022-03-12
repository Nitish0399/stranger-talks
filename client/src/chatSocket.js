class ChatSocket {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  searchStrangers() {
    socket.emit('chat:connect');
  }

  messageStranger(message) {
    socket.emit('chat:message', message);
  }

  disconnectChat() {
    socket.emit('chat:disconnect');
  }
}

export default ChatSocket;
