import {Outlet, useLocation} from "react-router-dom";
import {useMediaQuery} from 'react-responsive';
import Header from "./components/Header";
import {SocketContext} from "./context.js";
import ChatSocket from "./chatSocket.js";

const {io} = require("socket.io-client");

// Initializing socket.io
const socket = io("http://localhost:3001");
const chatSocket = new ChatSocket(io, socket);

function App() {
  const location = useLocation();
  const isMobile = useMediaQuery({query: `(max-width: 425px)`});

  let hideHeader = false;
  if (location.pathname == '/chat' && isMobile) {
    hideHeader = true;
  }

  return (<div>
    {
      (hideHeader)
        ? null
        : <Header/>
    }
    <SocketContext.Provider value={chatSocket}>
      <Outlet/>
    </SocketContext.Provider>
  </div>);
}

export default App;
