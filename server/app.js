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
  availableStrangers: [],
  connectedStrangers: {},
  searchStrangersDuration: 10000 // in milliseconds
};

io.on("connection", (socket) => {
  console.log('Stranger connected to socket server', socket.id);
  socketHandler(io, socket, strangersState);
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
