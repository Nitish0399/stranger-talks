import React from "react";
import {SocketContext} from "../../context.js";
import styles from "../../styles/chat.module.css";
import {Link} from "react-router-dom";
import ChatMsg from "./ChatMsg";
import ChatMetaMsg from "./ChatMetaMsg";
import {Rings} from "react-loader-spinner";

class ChatBody extends React.Component {
  render() {
    let child;
    if (this.props.chatStatus === "Connected") {
      child = <ChatBodyConnected/>;
    } else if (this.props.chatStatus === "Searching") {
      child = <ChatBodySearching/>;
    } else if (this.props.chatStatus === "Unavailable") {
      child = <ChatBodyUnavailable/>;
    } else {
      child = <ChatBodyError/>;
    }
    return {
      ...child
    };
  }
}

function ChatBodyConnected() {
  const chatSocket = React.useContext(SocketContext);

  chatSocket.socket.on("chat:message", function(message) {
    console.log(message);
  });

  function scrollToBottom(element) {
    if (element != null) {
      element.scrollTop = element.scrollHeight;
    }
  }

  return (<div id={styles["chat-body"]} ref={el => scrollToBottom(el)}></div>);
}

function ChatBodySearching() {
  return (<div id={styles["chat-body"]}>
    <div id={styles["loader"]}>
      <Rings height="70" width="70" color="#909090" className="justify-content-center" ariaLabel="loading"/>
    </div>
  </div>);
}

function ChatBodyUnavailable() {
  return (<div id={styles["chat-body"]}>
    <p id={styles["failed-chat-body-text"]}>
      No one is available at this moment to connect.
    </p>
  </div>);
}

function ChatBodyError() {
  const chatSocket = React.useContext(SocketContext);

  return (<div id={styles["chat-body"]}>
    <Link to="chat" className="d-block text-center">
      <button id={styles['start-chat-btn']} onClick={connectStranger}>Connect again</button>
    </Link>
  </div>);

  function connectStranger() {
    chatSocket.connectStranger();
  }
}

export default ChatBody;
