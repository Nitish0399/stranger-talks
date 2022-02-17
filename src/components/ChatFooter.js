import React from 'react'
import styles from "../styles/chat.module.css";
import sendIcon from "../images/send-icon.svg";
import photoIcon from "../images/photo-icon.svg";
import videoIcon from "../images/video-icon.svg";

class ChatFooter extends React.Component {
  render() {
    let footerState = "d-block"; // footer visible
    if (this.props.headerType != "Connected") {
      footerState = "d-none";
    }
    return (<div id={styles['chat-footer']} className={`d-flex justify-content-between align-items-center ${footerState}`}>
      <div id={styles['chat-input']} className="flex-grow-1">
        <input type="text" placeholder="Type your message here"/>
        <button type="button" id={styles['send-btn']}><img src={sendIcon} alt="Send Icon"/></button>
      </div>
      <button type="button" id={styles['photo-upload-btn']}><img src={photoIcon} alt="Photo Icon"/></button>
      <button type="button" id={styles['video-upload-btn']}><img src={videoIcon} alt="Video Icon"/></button>
    </div>);
  }
}

export default ChatFooter;
