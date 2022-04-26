const express = require("express");
const http = require("http");
const path = require('path');
const {Server} = require("socket.io");
require("dotenv").config();
const socketHandler = require("./app/socket_handler.js");
const SocketState = require("./app/models/socket_state.js");

const PORT = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);

// Initializing Socket server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const socketState = new SocketState();

io.on("connection", socket => {
  socketHandler(io, socket, socketState);
});

//  Serving static files
app.use(express.static(path.join(__dirname, 'client/build')));

//  All other GET requests not handled by server will return the React app
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
