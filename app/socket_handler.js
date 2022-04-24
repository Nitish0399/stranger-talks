module.exports = (io, socket, socketState) => {
  console.log("Stranger connected to socket server", socket.id);

  increaseStrangerOnlineCount();

  emitStrangersOnlineCount();

  /* --------------------- LISTENERS --------------------- */

  socket.on("chat:connect", connect);

  socket.on("chat:message", message);

  socket.on("chat:disconnect", () => {
    disconnect();
  });

  socket.on("disconnect", () => {
    decreaseStrangerOnlineCount();
    disconnect();
  });

  /* --------------------- HANDLERS --------------------- */

  function connect() {
    console.log("Stranger connecting to chat...");

    io.to(socket.id).emit("chat:searching"); // emit to socket

    disconnect();
    // disconnect earlier chat is exists

    if (socketState.strangersAvailable.length != 0) {
      // Pick random stranger
      let randomStranger = getRandomStranger();

      // Map connected strangers
      mapConnectedStrangers(socket.id, randomStranger);

      // Remove picked random stranger from socketState.strangersAvailable array
      removeStrangerFromAvailableList(randomStranger);

      io.to(socket.id).emit("chat:connected");
      io.to(randomStranger).emit("chat:connected");

      // Clear timeout created for random stranger
      let randomStrangerTimeout = socketState.strangersTimeouts[randomStranger];
      clearTimeout(randomStrangerTimeout);

      console.log("Stranger connected", randomStranger);
      return;
    }

    socketState.strangersAvailable.push(socket.id);

    const timeout = setTimeout(() => {
      // If stranger is not connected within set duration,
      // emit unavailable
      if (isStrangerChatActive() == false) {
        console.log("Stranger could not connect to chat");
        // Remove stranger from socketState.strangersAvailable array
        removeStrangerFromAvailableList(socket.id);

        io.to(socket.id).emit("chat:unavailable");
      }
    }, process.env.STRANGER_SEARCH_DURATION);

    // Save the timeout created for current socket, to clear it later if needed
    socketState.strangersTimeouts[socket.id] = timeout;

    console.log(socketState.strangersAvailable);
  }

  function message(message) {
    console.log("Strager chat message: " + message);

    let senderSocketId = socket.id;
    let receiverSocketId = socketState.strangersConnected[senderSocketId];
    if (receiverSocketId == null) {
      io.to(senderSocketId).emit("chat:disconnect");
      return;
    }
    io.to(receiverSocketId).emit("chat:message", message);
  }

  function emitStrangersOnlineCount() {
    console.log("Strangers online: " + socketState.strangersOnlineCount);

    // Emit to socket the count of strangers online
    io.emit("chat:strangers-online", socketState.strangersOnlineCount);
  }

  function disconnect() {
    console.log("Stranger disconnected the chat", socket.id);

    emitStrangersOnlineCount();

    // If stranger is connected to another stranger before disconnecting
    if (isStrangerChatActive()) {
      var randomStranger = socketState.strangersConnected[socket.id];

      // Remove mapping of connected strangers
      deMapConnectedStrangers(socket.id, randomStranger);

      io.to(socket.id).emit("chat:disconnected");
      io.to(randomStranger).emit("chat:disconnected");
    }

    // Remove stranger from socketState.strangersAvailable array
    removeStrangerFromAvailableList(socket.id);

    // Remove connected random stranger from socketState.strangersAvailable array if undefined
    if (typeof randomStranger != "undefined") {
      removeStrangerFromAvailableList(randomStranger);
    }
  }

  /* --------------------- HELPERS --------------------- */

  // Picks random stranger from list of strangers available to connect
  function getRandomStranger() {
    return socketState.strangersAvailable[
      Math.floor(Math.random() * socketState.strangersAvailable.length)
    ];
  }

  function removeStrangerFromAvailableList(strangerSocketId) {
    const index = socketState.strangersAvailable.indexOf(strangerSocketId);
    if (index > -1) {
      socketState.strangersAvailable.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  function isStrangerChatActive() {
    return socketState.strangersConnected.hasOwnProperty(socket.id);
  }

  function mapConnectedStrangers(stranger1, stranger2) {
    socketState.strangersConnected[stranger1] = stranger2;
    socketState.strangersConnected[stranger2] = stranger1;
  }

  function deMapConnectedStrangers(stranger1, stranger2) {
    delete socketState.strangersConnected[stranger1];
    delete socketState.strangersConnected[stranger2];
  }

  function increaseStrangerOnlineCount() {
    // Increment the count of strangers online
    socketState.strangersOnlineCount++;
  }

  function decreaseStrangerOnlineCount() {
    // Decrement the count of strangers online
    socketState.strangersOnlineCount--;
  }
};
