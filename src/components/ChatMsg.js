import React from 'react'
import PropTypes from 'prop-types'
import styles from "../styles/chat.module.css";

class ChatMsg extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let msgStyleClassName = "sent-msg";

    if (this.props.msgType === "Received") {
      msgStyleClassName = "received-msg";
    }

    return (<div className={styles[msgStyleClassName]}>
      <span>{this.props.message}</span>
    </div>);
  }
}

export default ChatMsg;
