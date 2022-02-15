import React from 'react'
import styles from "../styles/chat.module.css";
import sendIcon from "../images/send-icon.svg";
import photoIcon from "../images/photo-icon.svg";
import videoIcon from "../images/video-icon.svg";

class ChatFooter extends React.Component {
  render() {
    return (<div id={styles['chat-footer']} className="d-flex justify-content-between align-items-center">
      <div className="flex-grow-1">
        <input type="text" id={styles['chat-input']} placeholder="Type your message here"/>
        <button type="button" id={styles['photo-upload-btn']}><img src={sendIcon} alt="Send Icon"/></button>
      </div>
      <button type="button" id={styles['photo-upload-btn']}><img src={photoIcon} alt="Photo Icon"/></button>
      <button type="button" id={styles['video-upload-btn']}><img src={videoIcon} alt="Video Icon"/></button>
    </div>);
  }
}

export default ChatFooter;
