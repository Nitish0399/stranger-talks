// Chat Socket Model and Subject in Observer Pattern
class ChatSocket {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
    this.strangersOnlineCount = 0;
    this.chatStatus = "Searching";
    this.messagesList = []; // [{message : "Hello", party : "Sender"}, {message : "Hey", party : "Receiver"}]
    this.registerChatSocketListeners();

    this.observers = [];
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify() {
    this.observers.forEach(observer => {
      observer();
    });
  }

  registerChatSocketListeners() {
    this.socket.on("chat:strangers-online", function(strangersOnlineCount) {
      console.log("Stranger Online Count : ", strangersOnlineCount);
      this.strangersOnlineCount = strangersOnlineCount;
      this.notify();
    }.bind(this));

    this.socket.on("chat:connected", function(chatStatus) {
      console.log("Stranger Connected");
      this.chatStatus = "Connected";
      this.notify();
    }.bind(this));

    this.socket.on("chat:unavailable", function(chatStatus) {
      console.log("Stranger Unavailable");
      this.chatStatus = "Unavailable";
      this.notify();
    }.bind(this));

    this.socket.on("chat:disconnect", function(chatStatus) {
      console.log("Stranger Disconnected");
      this.chatStatus = "Disconnected";
      this.notify();
    }.bind(this));

    this.socket.on("chat:message", function(message) {
      console.log("Chat Message Received: ", message);
      this.messagesList.push({message, "party": "Receiver"});
      this.notify();
    }.bind(this));
  }

  connectStranger() {
    console.log("chat connected");
    this.socket.emit('chat:connect');
  }

  sendMessage(message) {
    console.log("Chat Message Sent: ", message);
    this.socket.emit('chat:message', message);
    this.notify();
  }

  getStrangersOnlineCount() {
    this.socket.emit('chat:strangers-online');
  }

  disconnectChat() {
    console.log("chat disconnected");
    this.socket.emit('chat:disconnect');
  }
}

export default ChatSocket;
