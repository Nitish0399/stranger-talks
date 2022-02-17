import React from 'react'
import styles from "../styles/chat.module.css";
import ChatMsg from "../components/ChatMsg";
import {Rings} from 'react-loader-spinner';

class ChatBody extends React.Component {
  render() {
    let child;
    if (this.props.headerType === "Connected") {
      child = <ChatBodyConnected/>;
    } else if (this.props.headerType === "Searching") {
      child = <ChatBodySearching/>;
    } else {
      child = <ChatBodyFailed/>;
    }
    return ({
      ...child
    });
  }
}

function ChatBodyConnected() {
  return (<div id={styles['chat-body']}>
    <ChatMsg message="Hey, Where are  you from?" msgType="Received"/>
    <ChatMsg message="Hii, I am from India!" msgType="Sent"/>
    <ChatMsg message="Hey, Where are  you from?" msgType="Received"/>
    <ChatMsg message="Hii, I am from India!" msgType="Sent"/>
  </div>);
}

function ChatBodySearching() {
  return (<div id={styles['chat-body']}>
    <div id={styles['loader']}>
      <Rings height="70" width="70" color='#909090' className="justify-content-center" ariaLabel='loading'/>
    </div>
  </div>);
}

function ChatBodyFailed() {
  return (<div id={styles['chat-body']}>
    <p id={styles['failed-chat-body-text']}>No one is available at this moment to connect..</p>
  </div>);
}

export default ChatBody;
