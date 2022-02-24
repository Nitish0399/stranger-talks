import React from 'react';
import styles from "../styles/chat.module.css";

class ChatMetaMsg extends React.Component {

  render() {
    return (<div className={styles["chat-meta-msg"]}>
      <span>{this.props.message}</span>
    </div>);
  }
}

export default ChatMetaMsg;
