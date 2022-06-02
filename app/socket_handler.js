const nodemailer = require('nodemailer');

module.exports = (io, socket, socketState) => {
  console.log("Chat Socket: Stranger connected to socket server, ", new Date().toISOString());

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
    console.log("Chat Socket: Stranger connecting to chat, ", new Date().toISOString());

    sendEmailToNotifyNewChat();

    io.to(socket.id).emit("chat:searching"); // emit to socket

    // disconnect earlier chat is exists
    disconnect();

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

      console.log("Chat Socket: Stranger connected, ", new Date().toISOString());
      return;
    }

    socketState.strangersAvailable.push(socket.id);

    const timeout = setTimeout(() => {
      // If stranger is not connected within set duration,
      // emit unavailable
      if (isStrangerChatActive() == false) {
        console.log("Chat Socket: Stranger could not connect to chat, ", new Date().toISOString());
        // Remove stranger from socketState.strangersAvailable array
        removeStrangerFromAvailableList(socket.id);

        io.to(socket.id).emit("chat:unavailable");
      }
    }, process.env.STRANGER_SEARCH_DURATION);

    // Save the timeout created for current socket, to clear it later if needed
    socketState.strangersTimeouts[socket.id] = timeout;
  }

  function message(message) {
    console.log("Chat Socket: Strager sent chat message, ", new Date().toISOString());

    let senderSocketId = socket.id;
    let receiverSocketId = socketState.strangersConnected[senderSocketId];
    if (receiverSocketId == null) {
      io.to(senderSocketId).emit("chat:disconnect");
      return;
    }
    io.to(receiverSocketId).emit("chat:message", message);
  }

  function emitStrangersOnlineCount() {
    console.log("Chat Socket: Strangers online count: " + socketState.strangersOnlineCount + ", ", new Date().toISOString());

    // Emit to socket the count of strangers online
    // io.emit("chat:strangers-online", socketState.strangersOnlineCount);

    //Emit random count (for user retaining purpose)
    io.emit("chat:strangers-online", Math.floor(Math.random() * 10) + 9 + socketState.strangersOnlineCount);
  }

  function disconnect() {
    console.log("Chat Socket: Stranger disconnected the chat, ", new Date().toISOString());

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
    return socketState.strangersAvailable[Math.floor(Math.random() * socketState.strangersAvailable.length)];
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

  function sendEmailToNotifyNewChat() {
    if (socketState.strangersOnlineCount == 1) {
      let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: process.env.NODE_MAILER_EMAIL,
          pass: process.env.G_APP_PASSWORD
        }
      });
      const emailData = {
        from: process.env.NODE_MAILER_EMAIL, // Sender address
        to: "nitish0399@hotmail.com", // List of recipients
        subject: `User connecting to chat | Stranger Talks`, // Subject line
        html: `
        <b>Open app now to chat with stranger</b>
      `
      };
      transport.sendMail(emailData, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("User connecting to chat email sent to nitish0399@hotmail.com");
        }
      });
    }
  }
};
