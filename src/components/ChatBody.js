import React from 'react'
import styles from "../styles/chat.module.css";
import ChatMsg from "../components/ChatMsg";

class ChatBody extends React.Component {
  render() {
    return (<div id={styles['chat-body']}>
      <ChatMsg message="Hey, Where are  you from?" msgType="Received"/>
      <ChatMsg message="Hii, I am from India!" msgType="Sent"/>
    </div>);
  }
}

export default ChatBody;
