import React from 'react';
import styles from "../styles/chat.module.css";
import ShareResourceRequestModal from "./modals/ShareResourceRequestModal";
import sendIcon from "../images/send-icon.svg";
import photoIcon from "../images/photo-icon.svg";
import videoIcon from "../images/video-icon.svg";

class ChatFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestModal: false,
      resourceRequestType: "photo"
    };

    this.shareResource = this.shareResource.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  render() {
    let footerState = "d-block"; // footer visible
    if (this.props.headerType !== "Connected") {
      footerState = "d-none"; // footer hidden
    }

    return (<div>
      <div id={styles['chat-footer']} className={`d-flex justify-content-between align-items-center ${footerState}`}>
        <div id={styles['chat-input']} className="flex-grow-1">
          <input type="text" placeholder="Type your message here"/>
          <button type="button" id={styles['send-btn']}><img src={sendIcon} alt="Send Icon"/></button>
        </div>
        <button type="button" id={styles['photo-upload-btn']}>
          <img src={photoIcon} alt="Photo Icon" onClick={() => this.shareResource("photo")}/></button>
        <button type="button" id={styles['video-upload-btn']}>
          <img src={videoIcon} alt="Video Icon" onClick={() => this.shareResource("video")}/></button>
      </div>
      <ShareResourceRequestModal resourceType={this.state.resourceRequestType} show={this.state.requestModal} onHide={this.closeModal}/>
    </div>);
  }

  shareResource(resourceRequestType) {
    this.setState({requestModal: true, resourceRequestType});
  }

  closeModal() {
    this.setState({requestModal: false});
  }

}
export default ChatFooter;
