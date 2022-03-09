module.exports = (io, socket) => {
  let usersAvailableToConnect = [];
  let connectedUsers = {};

  socket.on("chat:connect", msg => {
    console.log("user wants to connect");

    if (usersAvailableToConnect.length != 0) {
      // Pick random user
      let randomStranger = usersAvailableToConnect[Math.floor(Math.random() * usersAvailableToConnect.length)];

      // Map users
      connectedUsers[socket.id] = randomStranger;
      connectedUsers[randomStranger] = socket.id;

      // Remove random stranger from usersAvailableToConnect array
      removeUserFromAvailableList(randomStranger);

      io.to(socket.id).emit("chat:connected");
      io.to(randomStranger).emit("chat:connected");

      return;
    }

    usersAvailableToConnect.push(socket.id);

    const myTimeout = setTimeout(() => {
      // If user is not connected within 10 seconds, emit unavailable
      if (connectedUsers.hasOwnProperty(socket.id) == false) {
        usersAvailableToConnect = [];

        // Remove user from usersAvailableToConnect array
        removeUserFromAvailableList(socket.id);

        io.to(socket.id).emit("chat:unavailable");
      }

    }, 10000);

  });

  socket.on("chat:message", msg => {
    console.log("message: " + msg);

    let senderSocketId = socket.id;
    let receiverSocketId = connectedUsers[senderSocketId];
    if (receiverSocketId == null) {}
    io.to(receiverSocketId).emit(/* ... */);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    // If user is connected to a stranger before disconnecting
    if (connectedUsers.hasOwnProperty(socket.id)) {
      let strangerUser = connectedUsers[socket.id];

      delete connectedUsers[socket.id];
      delete connectedUsers[strangerUser];

      io.to(socket.id).emit("chat:disconnected");
      io.to(strangerUser).emit("chat:disconnected");
    }

    // Remove user from usersAvailableToConnect array
    removeUserFromAvailableList(socket.id);

    // Remove stranger from usersAvailableToConnect array
    if (typeof(strangerUser) != "undefined") {
      removeUserFromAvailableList(strangerUser);
    }

  });

  function removeUserFromAvailableList(userSocketId) {
    const index = array.indexOf(userSocketId);
    if (index > -1) {
      usersAvailableToConnect.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

};
