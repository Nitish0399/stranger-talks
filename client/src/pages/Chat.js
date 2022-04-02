import React from "react";
import {Container} from 'react-bootstrap';
import {SocketContext} from "../context.js";
import ChatHeader from "../components/chat/ChatHeader";
import ChatBody from "../components/chat/ChatBody";
import ChatFooter from "../components/chat/ChatFooter";
import styles from "../styles/chat.module.css";

class Chat extends React.Component {
  _isMounted = false;

  static contextType = SocketContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      chatStatus: "Searching"
    };

    context.connectStranger();
  }

  componentDidMount() {
    this._isMounted = true;

    this.context.socket.on("chat:connected", function(chatStatus) {
      console.log("Stranger Connected");
      // For eliminating memory leak when component is unmounted
      if (this._isMounted) {
        this.setState({chatStatus: "Connected"});
      }
    }.bind(this));

    this.context.socket.on("chat:unavailable", function(chatStatus) {
      console.log("Stranger Unavailable");
      // For eliminating memory leak when component is unmounted
      if (this._isMounted) {
        this.setState({chatStatus: "Unavailable"});
      }
    }.bind(this));

    this.context.socket.on("chat:disconnect", function(chatStatus) {
      console.log("Stranger Disconnected");
      // For eliminating memory leak when component is unmounted
      if (this._isMounted) {
        this.setState({chatStatus: "Disconnected"});
      }
    }.bind(this));
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.context.disconnectChat();
  }

  render() {
    let chatStatus = this.state.chatStatus;
    return (<div>
      <Container id={styles['chat-container']} className="d-flex flex-column justify-content-between">
        <ChatHeader chatStatus={chatStatus}/>
        <ChatBody chatStatus={chatStatus}/>
        <ChatFooter chatStatus={chatStatus}/>
      </Container>
    </div>);
  }
}

export default Chat;
