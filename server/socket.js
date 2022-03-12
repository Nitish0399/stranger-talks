module.exports = (io, socket) => {

  let strangersAvailableToConnect = [];
  let connectedStrangers = {};
  let searchStrangersDuration = 10000; // in milliseconds

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

    if (strangersAvailableToConnect.length != 0) {
      console.log("Stranger connected", socket.id);
      // Pick random stranger
      let randomStranger = getRandomStranger();

      // Map connected strangers
      mapConnectedStrangers(socket.id, randomStranger);

      // Remove picked random stranger from strangersAvailableToConnect array
      removeStrangerFromAvailableList(randomStranger);

      io.to(socket.id).emit("chat:connected");
      io.to(randomStranger).emit("chat:connected");

      return;
    }

    strangersAvailableToConnect.push(socket.id);

    const timeout = setTimeout(() => {
      // If stranger is not connected within set duration, emit unavailable
      if (connectedStrangers.hasOwnProperty(socket.id) == false) {
        console.log("Stranger could not connect");
        // Remove stranger from strangersAvailableToConnect array
        removeStrangerFromAvailableList(socket.id);

        io.to(socket.id).emit("chat:unavailable");
      }
    }, searchStrangersDuration);

  }

  function message(message) {
    console.log("Strager message: " + message, socket.id);

    let senderSocketId = socket.id;
    let receiverSocketId = connectedStrangers[senderSocketId];
    if (receiverSocketId == null) {
      io.to(senderSocketId).emit("chat:disconnect");
      return;
    }
    io.to(receiverSocketId).emit("chat:message", message);
  }

  function disconnect() {
    console.log("Stranger disconnected", socket.id);

    // If stranger is connected to another stranger before disconnecting
    if (connectedStrangers.hasOwnProperty(socket.id)) {
      var randomStranger = connectedStrangers[socket.id];

      // Remove mapping of connected strangers
      removeConnectedStrangers();

      io.to(socket.id).emit("chat:disconnect");
      io.to(randomStranger).emit("chat:disconnect");
    }

    // Remove stranger from strangersAvailableToConnect array
    removeStrangerFromAvailableList(socket.id);

    // Remove connected random stranger from strangersAvailableToConnect array
    if (typeof(randomStranger) != "undefined") {
      removeStrangerFromAvailableList(randomStranger);
    }

  }

  /* --------------------- HELPERS --------------------- */

  // Picks random stranger from list of strangers available to connect
  function getRandomStranger() {
    return strangersAvailableToConnect[Math.floor(Math.random() * strangersAvailableToConnect.length)];
  }

  function removeStrangerFromAvailableList(strangerSocketId) {
    const index = strangersAvailableToConnect.indexOf(strangerSocketId);
    if (index > -1) {
      strangersAvailableToConnect.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  function mapConnectedStrangers(stranger1, stranger2) {
    connectedStrangers[stranger1] = stranger2;
    connectedStrangers[stranger2] = stranger1;
  }

  function removeConnectedStrangers(stranger1, stranger2) {
    delete connectedStrangers[stranger1];
    delete connectedStrangers[stranger2];
  }

};
