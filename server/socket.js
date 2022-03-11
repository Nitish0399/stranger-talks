module.exports = (io, socket) => {
  let strangersAvailableToConnect = [];
  let connectedStrangers = {};
  let searchStrangersDuration = 10000; // in milliseconds

  socket.on("chat:connect", msg => {
    console.log("stranger wants to connect", socket.id);

    if (strangersAvailableToConnect.length != 0) {
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

        // Remove stranger from strangersAvailableToConnect array
        removeStrangerFromAvailableList(socket.id);

        io.to(socket.id).emit("chat:unavailable");
      }
    }, searchStrangersDuration);

  });

  socket.on("chat:message", message => {
    console.log("message: " + message, socket.id);

    let senderSocketId = socket.id;
    let receiverSocketId = connectedStrangers[senderSocketId];
    if (receiverSocketId == null) {
      io.to(senderSocketId).emit("chat:disconnected");
      return;
    }
    io.to(receiverSocketId).emit("chat:message", message);
  });

  socket.on("disconnect", () => {
    console.log("stranger disconnected", socket.id);

    // If stranger is connected to another stranger before disconnecting
    if (connectedStrangers.hasOwnProperty(socket.id)) {
      let randomStranger = connectedStrangers[socket.id];

      // Remove mapping of connected strangers
      removeConnectedStrangers();

      io.to(socket.id).emit("chat:disconnected");
      io.to(randomStranger).emit("chat:disconnected");
    }

    // Remove stranger from strangersAvailableToConnect array
    removeStrangerFromAvailableList(socket.id);

    // Remove connected random stranger from strangersAvailableToConnect array
    if (typeof(randomStranger) != "undefined") {
      removeStrangerFromAvailableList(strangerStranger);
    }

  });

  // Picks random stranger from list of strangers available to connect
  function getRandomStranger() {
    return strangersAvailableToConnect[Math.floor(Math.random() * strangersAvailableToConnect.length)];
  }

  function removeStrangerFromAvailableList(strangerSocketId) {
    const index = array.indexOf(strangerSocketId);
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
