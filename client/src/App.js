import {Outlet, useLocation} from "react-router-dom";
import {useMediaQuery} from 'react-responsive';
import Header from "./components/Header";
import Footer from "./components/Footer.js";
import {SocketContext} from "./context.js";
import ChatSocket from "./chatSocket.js";
import "./index.css";

const {io} = require("socket.io-client");

// Initializing socket.io
const socket = io("http://localhost:3001");
const chatSocket = new ChatSocket(io, socket);

function App() {
  const location = useLocation(); // get current component router path object
  const isMobile = useMediaQuery({query: `(max-width: 425px)`});

  let hideHeader = false;
  // Hide header when screen is mobile and current path is "/chat"
  if (location.pathname == '/chat' && isMobile) {
    hideHeader = true;
  }

  return (<div id="container">
    {
      (hideHeader)
        ? null
        : <Header/>
    }
    <div id="content">
      <SocketContext.Provider value={chatSocket}>
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
