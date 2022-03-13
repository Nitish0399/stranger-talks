import React from "react";
import ReactDOM from "react-dom";
import {SocketContext} from "./context.js";
import ChatSocket from "./chatSocket.js";
import "./index.css";
import App from "./App";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import reportWebVitals from "./reportWebVitals";
import {BrowserRouter, Routes, Route} from "react-router-dom";

const {io} = require("socket.io-client");

// Initializing socket.io
const socket = io("http://localhost:3001");
const chatSocket = new ChatSocket(io, socket);

ReactDOM.render(<React.StrictMode>
  <BrowserRouter>
    <Routes>
      <SocketContext.Provider value={chatSocket}>
        <Route path="/" element={<App />}>
          <Rout index="index">