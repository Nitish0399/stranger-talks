const express = require("express");
const http = require('http');
const {Server} = require("socket.io");
var cors = require('cors');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const socketHandler = require("./socket.js");

// Maintain the state of stranger sockets
var strangersState = {
  strangersOnlineCount: 0,
  strangersAvailable: [],
  strangersConnected: {},
  strangersTimeouts: {},
  searchStrangersDuration: 15000 // in milliseconds
};

io.on("connection", (socket) => {
  socketHandler(io, socket, strangersState);
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
