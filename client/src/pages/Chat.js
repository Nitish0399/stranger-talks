import React from "react";
import {Container} from 'react-bootstrap';
import {SocketContext} from "../context.js";
import ChatHeader from "../components/chat/ChatHeader";
import ChatBody from "../components/chat/ChatBody";
import ChatFooter from "../components/chat/ChatFooter";
import styles from "../styles/chat.module.css";

class Chat extends React.Component {
  static contextType = SocketContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      chatStatus: "Searching"
    };

  }

  componentDidMount() {
    this.context.socket.on("chat:connected", function(chatStatus) {
      this.setState({chatStatus: "Connected"});
    }.bind(this));
  }

  render() {
    let chatStatus = this.state.chatStatus;
    return (<div>
      <Container id={styles['chat-container']}>
        <ChatHeader chatStatus={chatStatus}/>
        <ChatBody chatStatus={chatStatus}/>
        <ChatFooter chatStatus={chatStatus}/>
      </Container>
    </div>);
  }
}

export default Chat;
