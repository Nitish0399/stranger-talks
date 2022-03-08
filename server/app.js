const express = require("express");
const http = require('http');
const {Server} = require("socket.io");

const PORT = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);

const io = new Server(server);

const socketHandler = require("./socket.js");

io.on("connection", (socket) => {
  console.log('a user connected');
  socketHandler(io, socket);
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
