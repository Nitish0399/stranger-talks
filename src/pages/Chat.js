import React from "react";
import {Container} from 'react-bootstrap';
import ChatHeader from "../components/ChatHeader";
import ChatBody from "../components/ChatBody";
import ChatFooter from "../components/ChatFooter";
import styles from "../styles/chat.module.css";

class Chat extends React.Component {
  render() {
    return (<div>
      <Container id={styles['chat-container']}>
        <ChatHeader headerType="Connected"/>
        <ChatBody/>
        <ChatFooter/>
      </Container>
    </div>);
  }
}

export default Chat;
