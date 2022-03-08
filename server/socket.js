module.exports = (io, socket) => {
  let usersAvailableToConnect = [];
  let connectedUsers = {};

  socket.on("chat:connect", msg => {
    console.log("user wants to connect");
    usersAvailableToConnect.push(socket.id);

    // TODO: Check for available users and connect to them randomly

    connectedUsers[socket.io] = xx; // xx=  randomly picked socket id;
    connectedUsers[xx] = socket.io;
  });

  socket.on("chat:message", msg => {
    console.log("message: " + msg);

    let senderSocketId = socket.id;
    let receiverSocketId = connectedUsers[senderSocketId];
    if (receiverSocketId == null) {
    }
    io.to(receiverSocketId).emit(/* ... */);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    // Remove user from usersAvailableToConnect array
    const index = array.indexOf(socket.id);
    if (index > -1) {
      usersAvailableToConnect.splice(index, 1); // 2nd parameter means remove one item only
    }
  });
};
