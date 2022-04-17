import React from "react";
import {Outlet, useLocation} from "react-router-dom";
import {useMediaQuery} from 'react-responsive';
import Header from "./components/Header";
import Footer from "./components/Footer.js";
import {SocketContext} from "./context.js";
import ChatSocket from "./chatSocket.js";
import "./index.css";

const {io} = require("socket.io-client");

// Initializing socket.io
const socket = io(process.env.REACT_APP_SERVER_URL);

function App() {
  const location = useLocation(); // get current component router path object
  const isMobile = useMediaQuery({query: `(max-width: 425px)`});

  let hideHeader = false;
  // Hide header when screen is mobile and current path is "/chat"
  if (location.pathname === '/chat' && isMobile) {
    hideHeader = true;
  }

  return (<div id="app">
    {
      (hideHeader)
        ? null
        : <Header/>
    }
    <div id="container">
      <SocketContext.Provider value={new ChatSocket(io, socket)}>
        <Outlet/>
      </SocketContext.Provider>
    </div>
    {
      (hideHeader)
        ? null
        : <Footer/>
    }
  </div>);
}

export default App;
