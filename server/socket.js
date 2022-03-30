module.exports = (io, socket, strangersState) => {

  /* --------------------- LISTENERS --------------------- */

  socket.on("chat:connect", connect);

  socket.on("chat:message", message);

  socket.on("chat:disconnect", () => {
    disconnect();
    socket.disconnect();
  });

  socket.on("disconnect", disconnect);

  /* --------------------- HANDLERS --------------------- */

  function connect() {
    console.log("Stranger connecting..", socket.id);
    console.log(strangersState.strangersAvailable);
    if (strangersState.strangersAvailable.length != 0) {

      // Pick random stranger
      let randomStranger = getRandomStranger();

      // Map connected strangers
      mapstrangersConnected(socket.id, randomStranger);

      // Remove picked random stranger from strangersState.strangersAvailable array
      removeStrangerFromAvailableList(randomStranger);

      io.to(socket.id).emit("chat:connected");
      io.to(randomStranger).emit("chat:connected");

      console.log("Stranger connected", socket.id, randomStranger);

      return;
    }

    strangersState.strangersAvailable.push(socket.id);
    console.log(strangersState.strangersAvailable);
    const timeout = setTimeout(() => {
      // If stranger is not connected within set duration, emit unavailable
      if (strangersState.strangersConnected.hasOwnProperty(socket.id) == false) {
        console.log("Stranger could not connect");
        // Remove stranger from strangersState.strangersAvailable array
        removeStrangerFromAvailableList(socket.id);

        io.to(socket.id).emit("chat:unavailable");
      }
    }, strangersState.searchStrangersDuration);

  }

  function message(message) {
    console.log("Strager message: " + message, socket.id);

    let senderSocketId = socket.id;
    let receiverSocketId = strangersState.strangersConnected[senderSocketId];
    if (receiverSocketId == null) {
      io.to(senderSocketId).emit("chat:disconnect");
      return;
    }
    io.to(receiverSocketId).emit("chat:message", message);
  }

  function disconnect() {
    console.log("Stranger disconnected", socket.id);

    // Decrement the count of strangers online
    strangersState.strangersOnlineCount--;

    // If stranger is connected to another stranger before disconnecting
    if (strangersState.strangersConnected.hasOwnProperty(socket.id)) {
      var randomStranger = strangersState.strangersConnected[socket.id];

      // Remove mapping of connected strangers
      removestrangersConnected(socket.id, randomStranger);

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

  function mapstrangersConnected(stranger1, stranger2) {
    strangersState.strangersConnected[stranger1] = stranger2;
    strangersState.strangersConnected[stranger2] = stranger1;
  }

  function removestrangersConnected(stranger1, stranger2) {
    delete strangersState.strangersConnected[stranger1];
    delete strangersState.strangersConnected[stranger2];
  }

};
