import React from "react";
import ReactDOM from "react-dom";

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
      <Route exact="exact" path="/" element={<App />}>
        <Route index="index" element={<Home chatSocket = {
            chatSocket
          } />}/>
        <Route path="chat" element={<Chat chatSocket = {
            chatSocket
          } />}/>
      </Route>
      <Route path="*" element={<NotFound />}/>
    </Routes>
  </BrowserRouter>
</React.StrictMode>, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
