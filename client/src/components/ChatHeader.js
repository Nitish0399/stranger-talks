import React from 'react'
import {Link} from "react-router-dom";
import {SocketContext} from "../context.js";
import styles from "../styles/chat.module.css";
import closeIcon from "../images/close-icon.svg";
import errorIcon from "../images/error-icon.svg";
import successIcon from "../images/success-icon.svg";
import searchIcon from "../images/search-icon.svg";

class ChatHeader extends React.Component {
  render() {
    let child;
    if (this.props.headerType === "Connected") {
      child = <ChatHeaderConnected/>;
    } else if (this.props.headerType === "Searching") {
      child = <ChatHeaderSearching/>;
    } else {
      child = <ChatHeaderFailed/>;
    }
    return ({
      ...child
    });
  }
}

function ChatHeaderConnected() {
  return (<div id={styles['chat-header']} className="d-flex justify-content-between align-items-center flex-wrap">
    <div className="flex-fill">
      <img src={successIcon} id={styles['chat-header-icon-success']} alt="Chat Header Icon"/>
      <div className={styles['chat-header-main']}>
        <h3 className={styles['chat-header-title']}>Connected!</h3>
        <p className={styles['chat-header-sub-title']}>You can start sending messages to the stranger now.</p>
      </div>
    </div>
    <CloseChatButton/>
  </div>);
}

function ChatHeaderSearching() {
  return (<div id={styles['chat-header']} className="d-flex justify-content-between align-items-center flex-wrap">
    <div>
      <img src={searchIcon} id={styles['chat-header-icon-search']} alt="Chat Header Icon"/>
      <div className={styles['chat-header-main']}>
        <h3 className={styles['chat-header-title']}>Searching...</h3>
      </div>
    </div>
    <CloseChatButton/>
  </div>);
}

function ChatHeaderFailed() {
  return (<div id={styles['chat-header']} className="d-flex justify-content-between align-items-center">
    <div className="flex-fill">
      <img src={errorIcon} id={styles['chat-header-icon-error']} alt="Chat Header Icon"/>
      <div className={styles['chat-header-main']}>
        <h3 className={styles['chat-header-title']}>No strangers available at this moment</h3>
      </div>
    </div>
    <CloseChatButton/>
  </div>);
}

function CloseChatButton() {
  const chatSocket = React.useContext(SocketContext);

  function disconnectChat() {
    chatSocket.disconnectChat();
  }

  return (<Link to="/" className="m-auto m-sm-0" onClick={() => disconnectChat(chatSocket)}>
    <img className={styles['close-chat-icon']} src={closeIcon} alt="Close Chat Icon"/>
  </Link>);
}

export default ChatHeader;
