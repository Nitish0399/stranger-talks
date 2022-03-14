import React from "react";
import {Container} from 'react-bootstrap';
import ChatHeader from "../components/chat/ChatHeader";
import ChatBody from "../components/chat/ChatBody";
import ChatFooter from "../components/chat/ChatFooter";
import styles from "../styles/chat.module.css";

class Chat extends React.Component {
  render() {
    let headerType = "Connected";
    return (<div>
      <Container id={styles['chat-container']}>
        <ChatHeader headerType={headerType}/>
        <ChatBody headerType={headerType}/>
        <ChatFooter headerType={headerType}/>
      </Container>
    </div>);
  }
}

export default Chat;
