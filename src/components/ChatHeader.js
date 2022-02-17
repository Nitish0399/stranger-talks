import React from 'react'
import {Link} from "react-router-dom";
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
      <div className="d-inline-block" style={{
          marginLeft: "15px",
          width: "calc(100% - 58px)"
        }}>
        <h3 className={styles['chat-header-title']}>Connected!</h3>
        <p className={styles['chat-header-sub-title']}>You can start sending messages to the stranger now.</p>
      </div>
    </div>
    <Link to="/" className="m-auto m-sm-0">
      <button type="button" id={styles['end-chat-btn']}><img id={styles['end-chat-icon']} src={closeIcon} alt="End Chat Icon"/>End Chat</button>
    </Link>
  </div>);
}

function ChatHeaderSearching() {
  return (<div id={styles['chat-header']} className="d-flex justify-content-between align-items-center">
    <div>
      <img src={searchIcon} id={styles['chat-header-icon-search']} alt="Chat Header Icon"/>
      <div className="d-inline-block ms-3">
        <h3 className={styles['chat-header-title']}>Searching...</h3>
      </div>
    </div>
    <Link to="/">
      <img className={styles['close-chat-icon']} src={closeIcon} alt="End Chat Icon"/>
    </Link>
  </div>);
}

function ChatHeaderFailed() {
  return (<div id={styles['chat-header']} className="d-flex justify-content-between align-items-center">
    <div>
      <img src={errorIcon} id={styles['chat-header-icon-error']} alt="Chat Header Icon"/>
      <div className="d-inline-block ms-3">
        <h3 className={styles['chat-header-title']}>Could not find strangers :(</h3>
      </div>
    </div>
    <Link to="/">
      <img className={styles['close-chat-icon']} src={closeIcon} alt="End Chat Icon"/>
    </Link>
  </div>);
}

export default ChatHeader;
