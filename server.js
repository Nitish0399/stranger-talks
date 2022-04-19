const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
var cors = require("cors");
require("dotenv").config();
const socketHandler = require("./app/socket_handler.js");
const SocketState = require("./app/models/socket_state.js");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

const server = http.createServer(app);

// Serving static files
app.use(express.static("client/build"));

// All other GET requests not handled by server will return the React app
app.get("*", (req, res) => {
  res.sendFile(__dirname, "client/build/index.html");
});

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

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
