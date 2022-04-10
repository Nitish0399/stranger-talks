import React from 'react';
import styles from "../../styles/chat.module.css";

class ChatMsg extends React.Component {

  render() {
    let msgStyleClassName = "sender-msg";

    if (this.props.msgType === "Receiver") {
      msgStyleClassName = "receiver-msg";
    }

    return (<div className="d-flex">
      <div className={`${styles["chat-msg"]} ${styles[msgStyleClassName]}`}>
        <span>{this.props.message}</span>
      </div>
    </div>);
  }
}

export default ChatMsg;
