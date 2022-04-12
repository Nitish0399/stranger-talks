const express = require("express");
const http = require('http');
const {Server} = require("socket.io");
var cors = require('cors');
const socketHandler = require("./socket.js");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

const server = http.createServer(app);

// Serving static files
app.use(express.static('client/build'));

// All other GET requests not handled by API will return the React app
app.get('*', (req, res) => {
  res.sendFile(__dirname, 'client/build/index.html');
});

// Initializing Socket server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

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
