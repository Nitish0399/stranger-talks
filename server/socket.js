module.exports = (io, socket, strangersState) => {

  console.log('Stranger connected to socket server', socket.id);

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

    disconnect(); //disconnect earlier chat is exists

    if (strangersState.strangersAvailable.length != 0) {

      // Pick random stranger
      let randomStranger = getRandomStranger();

      // Map connected strangers
      mapConnectedStrangers(socket.id, randomStranger);

      // Remove picked random stranger from strangersState.strangersAvailable array
      removeStrangerFromAvailableList(randomStranger);

      io.to(socket.id).emit("chat:connected");
      io.to(randomStranger).emit("chat:connected");

      // Clear timeout created for random stranger
      let randomStrangerTimeout = strangersState.strangersTimeouts[randomStranger];
      clearTimeout(randomStrangerTimeout);

      console.log("Stranger connected", randomStranger);
      return;
    }

    strangersState.strangersAvailable.push(socket.id);

    const timeout = setTimeout(() => {
      // If stranger is not connected within set duration,
      // emit unavailable
      if (isStrangerChatActive() == false) {
        console.log("Stranger could not connect to chat");
        // Remove stranger from strangersState.strangersAvailable array
        removeStrangerFromAvailableList(socket.id);

        io.to(socket.id).emit("chat:unavailable");
      }
    }, strangersState.searchStrangersDuration);

    // Save the timeout created for current socket, to clear it later if needed
    strangersState.strangersTimeouts[socket.id] = timeout;
  }

  function message(message) {
    console.log("Strager chat message: " + message);

    let senderSocketId = socket.id;
    let receiverSocketId = strangersState.strangersConnected[senderSocketId];
    if (receiverSocketId == null) {
      io.to(senderSocketId).emit("chat:disconnect");
      return;
    }
    io.to(receiverSocketId).emit("chat:message", message);
  }

  function emitStrangersOnlineCount() {
    console.log("Strangers online: " + strangersState.strangersOnlineCount);

    // Emit to socket the count of strangers online
    io.emit("chat:strangers-online", strangersState.strangersOnlineCount);
  }

  function disconnect() {
    console.log("Stranger disconnected the chat");

    emitStrangersOnlineCount();

    // If stranger is connected to another stranger before disconnecting
    if (isStrangerChatActive()) {
      var randomStranger = strangersState.strangersConnected[socket.id];

      // Remove mapping of connected strangers
      deMapConnectedStrangers(socket.id, randomStranger);

      io.to(socket.id).emit("chat:disconnected");
      io.to(randomStranger).emit("chat:disconnected");
    }

    // Remove stranger from strangersState.strangersAvailable array
    removeStrangerFromAvailableList(socket.id);

    // Remove connected random stranger from strangersState.strangersAvailable array if undefined
    if (typeof(randomStranger) != "undefined") {
      removeStrangerFromAvailableList(randomStranger);
    }

  }

  /* --------------------- HELPERS --------------------- */

  // Picks random stranger from list of strangers available to connect
  function getRandomStranger() {
    return strangersState.strangersAvailable[Math.floor(Math.random() * strangersState.strangersAvailable.length)];
  }

  function removeStrangerFromAvailableList(strangerSocketId) {
    const index = strangersState.strangersAvailable.indexOf(strangerSocketId);
    if (index > -1) {
      strangersState.strangersAvailable.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  function isStrangerChatActive() {
    return strangersState.strangersConnected.hasOwnProperty(socket.id);
  }

  function mapConnectedStrangers(stranger1, stranger2) {
    strangersState.strangersConnected[stranger1] = stranger2;
    strangersState.strangersConnected[stranger2] = stranger1;
  }

  function deMapConnectedStrangers(stranger1, stranger2) {
    delete strangersState.strangersConnected[stranger1];
    delete strangersState.strangersConnected[stranger2];
  }

  function increaseStrangerOnlineCount() {
    // Increment the count of strangers online
    strangersState.strangersOnlineCount++;
  }

  function decreaseStrangerOnlineCount() {
    // Decrement the count of strangers online
    strangersState.strangersOnlineCount--;
  }
};
