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
    console.log(strangersState.availableStrangers);
    if (strangersState.availableStrangers.length != 0) {

      // Pick random stranger
      let randomStranger = getRandomStranger();

      // Map connected strangers
      mapConnectedStrangers(socket.id, randomStranger);

      // Remove picked random stranger from strangersState.availableStrangers array
      removeStrangerFromAvailableList(randomStranger);

      io.to(socket.id).emit("chat:connected");
      io.to(randomStranger).emit("chat:connected");

      console.log("Stranger connected", socket.id, randomStranger);

      return;
    }

    strangersState.availableStrangers.push(socket.id);
    console.log(strangersState.availableStrangers);
    const timeout = setTimeout(() => {
      // If stranger is not connected within set duration, emit unavailable
      if (strangersState.connectedStrangers.hasOwnProperty(socket.id) == false) {
        console.log("Stranger could not connect");
        // Remove stranger from strangersState.availableStrangers array
        removeStrangerFromAvailableList(socket.id);

        io.to(socket.id).emit("chat:unavailable");
      }
    }, strangersState.searchStrangersDuration);

  }

  function message(message) {
    console.log("Strager message: " + message, socket.id);

    let senderSocketId = socket.id;
    let receiverSocketId = strangersState.connectedStrangers[senderSocketId];
    if (receiverSocketId == null) {
      io.to(senderSocketId).emit("chat:disconnect");
      return;
    }
    io.to(receiverSocketId).emit("chat:message", message);
  }

  function disconnect() {
    console.log("Stranger disconnected", socket.id);

    // If stranger is connected to another stranger before disconnecting
    if (strangersState.connectedStrangers.hasOwnProperty(socket.id)) {
      var randomStranger = strangersState.connectedStrangers[socket.id];

      // Remove mapping of connected strangers
      removeConnectedStrangers(socket.id, randomStranger);

      io.to(socket.id).emit("chat:disconnect");
      io.to(randomStranger).emit("chat:disconnect");
    }

    // Remove stranger from strangersState.availableStrangers array
    removeStrangerFromAvailableList(socket.id);

    // Remove connected random stranger from strangersState.availableStrangers array
    if (typeof(randomStranger) != "undefined") {
      removeStrangerFromAvailableList(randomStranger);
    }

  }

  /* --------------------- HELPERS --------------------- */

  // Picks random stranger from list of strangers available to connect
  function getRandomStranger() {
    return strangersState.availableStrangers[Math.floor(Math.random() * strangersState.availableStrangers.length)];
  }

  function removeStrangerFromAvailableList(strangerSocketId) {
    const index = strangersState.availableStrangers.indexOf(strangerSocketId);
    if (index > -1) {
      strangersState.availableStrangers.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  function mapConnectedStrangers(stranger1, stranger2) {
    strangersState.connectedStrangers[stranger1] = stranger2;
    strangersState.connectedStrangers[stranger2] = stranger1;
  }

  function removeConnectedStrangers(stranger1, stranger2) {
    delete strangersState.connectedStrangers[stranger1];
    delete strangersState.connectedStrangers[stranger2];
  }

};
