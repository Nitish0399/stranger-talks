import {Outlet} from "react-router-dom";
import Header from "./components/Header";
import {SocketContext} from "./context.js";
import ChatSocket from "./chatSocket.js";

const {io} = require("socket.io-client");

// Initializing socket.io
const socket = io("http://localhost:3001");
const chatSocket = new ChatSocket(io, socket);

function App() {
  return (<div>
    <Header/>
    <SocketContext.Provider value={chatSocket}>
      <Outlet/>
    </SocketContext.Provider>
  </div>);
}

export default App;
