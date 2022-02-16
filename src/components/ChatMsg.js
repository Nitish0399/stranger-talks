import React from 'react';
import styles from "../styles/chat.module.css";

class ChatMsg extends React.Component {

  render() {
    let msgStyleClassName = "sent-msg";

    if (this.props.msgType === "Received") {
      msgStyleClassName = "received-msg";
    }

    return (<div className={`${styles["chat-msg"]} ${styles[msgStyleClassName]}`}>
      <span>{this.props.message}</span>
    </div>);
  }
}

export default ChatMsg;
