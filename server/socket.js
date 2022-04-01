module.exports = (io, socket, strangersState) => {

  console.log('Stranger connected to socket server', socket.id);

  increaseStrangerOnlineCount();
  emitStrangersOnlineCount();

  /* --------------------- LISTENERS --------------------- */

  socket.on("chat:connect", connect);

  socket.on("chat:message", message);

  socket.on("chat:strangers-online", emitStrangersOnlineCount);

  socket.on("chat:disconnect", () => {
    disconnect();
  });

  socket.on("disconnect", () => {
    decreaseStrangerOnlineCount();
    disconnect();
  });

  /* --------------------- HANDLERS --------------------- */

  function connect() {
    console.log("Stranger connecting to chat..", socket.id);

    if (strangersState.strangersAvailable.length != 0) {

      // Pick random stranger
      let randomStranger = getRandomStranger();

      // Map connected strangers
      mapConnectedStrangers(socket.id, randomStranger);

      // Remove picked random stranger from strangersState.strangersAvailable array
      removeStrangerFromAvailableList(randomStranger);

      io.to(socket.id).emit("chat:connected");
      io.to(randomStranger).emit("chat:connected");

      console.log("Stranger connected", socket.id, randomStranger);
      return;
    }

    strangersState.strangersAvailable.push(socket.id);

    const timeout = setTimeout(() => {
      // If stranger is not connected within set duration, emit unavailable
      if (strangersState.strangersConnected.hasOwnProperty(socket.id) == false) {
        console.log("Stranger could not connect to chat");
        // Remove stranger from strangersState.strangersAvailable array
        removeStrangerFromAvailableList(socket.id);

        io.to(socket.id).emit("chat:unavailable");
      }
    }, strangersState.searchStrangersDuration);

  }

  function message(message) {
    console.log("Strager chat message: " + message, socket.id);

    let senderSocketId = socket.id;
    let receiverSocketId = strangersState.strangersConnected[senderSocketId];
    if (receiverSocketId == null) {
      io.to(senderSocketId).emit("chat:disconnect");
      return;
    }
    io.to(receiverSocketId).emit("chat:message", message);
  }

  function emitStrangersOnlineCount() {
    console.log("Strangers online: " + strangersState.strangersOnlineCount, socket.id);

    // Emit to socket the count of strangers online
    io.to(socket.id).emit("chat:strangers-online", strangersState.strangersOnlineCount);
  }

  function disconnect() {
    console.log("Stranger disconnected the chat", socket.id);

    // If stranger is connected to another stranger before disconnecting
    if (strangersState.strangersConnected.hasOwnProperty(socket.id)) {
      var randomStranger = strangersState.strangersConnected[socket.id];

      // Remove mapping of connected strangers
      demapConnectedStrangers(socket.id, randomStranger);

      io.to(socket.id).emit("chat:disconnect");
      io.to(randomStranger).emit("chat:disconnect");
    }

    // Remove stranger from strangersState.strangersAvailable array
    removeStrangerFromAvailableList(socket.id);

    // Remove connected random stranger from strangersState.strangersAvailable array
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

  function mapConnectedStrangers(stranger1, stranger2) {
    strangersState.strangersConnected[stranger1] = stranger2;
    strangersState.strangersConnected[stranger2] = stranger1;
  }

  function demapConnectedStrangers(stranger1, stranger2) {
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
