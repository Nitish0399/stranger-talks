import React from "react";
import {SocketContext} from "../../context.js";
import styles from "../../styles/chat.module.css";
import ShareResourceRequestModal from "../modals/ShareResourceRequestModal";
import ShareResourceResponseModal from "../modals/ShareResourceResponseModal";

import sendIcon from "../../images/send-icon.svg";
import photoIcon from "../../images/photo-icon.svg";
import videoIcon from "../../images/video-icon.svg";

class ChatFooter extends React.Component {
  static contextType = SocketContext;

  constructor(props, context) {
    super(props);
    this.state = {
      chatStatus: context.chatStatus,
      messageInput: "",
      // requestModal: false,
      // resourceRequestType: "photo"
    };

    this.onChatStatusChange = this.onChatStatusChange.bind(this);
    this.handleMessageInputChange = this.handleMessageInputChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    // this.shareResource = this.shareResource.bind(this);
    // this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.context.attach(this.onChatStatusChange);
  }

  onChatStatusChange() {
    this.setState({chatStatus: this.context.chatStatus});
  }

  componentWillUnmount() {
    this.context.detach(this.onChatStatusChange);
  }

  render() {
    let footerState = "d-block"; // footer visible
    if (this.state.chatStatus !== "Connected") {
      footerState = "d-none"; // footer hidden
    }

    return (<div>
      <div id={styles["chat-footer"]} className={`d-flex justify-content-between align-items-center ${footerState}`}>
        <div id={styles["chat-input"]} className="flex-grow-1">
          <input type="text" value={this.state.messageInput} placeholder="Type your message here" onChange={this.handleMessageInputChange}/>
          <button type="button" id={styles["send-btn"]} onClick={this.sendMessage}>
            <img src={sendIcon} alt="Send Icon"/>
          </button>
        </div>
        {/*
        <button type="button" id={styles["photo-upload-btn"]}>
          <img src={photoIcon} alt="Photo Icon" onClick={() => this.shareResource("photo")}/>
        </button>
        <button type="button" id={styles["video-upload-btn"]}>
          <img src={videoIcon} alt="Video Icon" onClick={() => this.shareResource("video")}/>
        </button>
        */
        }
      </div>

      {/* <ShareResourceResponseModal resourceType={this.state.resourceRequestType} show={this.state.requestModal} onHide={this.closeModal}/> */}
    </div>);
  }

  handleMessageInputChange(e) {
    this.setState({messageInput: e.target.value});
  }

  sendMessage() {
    this.context.messagesList.push({"message": this.state.messageInput, "party": "Sender"});
    this.context.sendMessage(this.state.messageInput);
    this.setState({messageInput: ""});
  }

  // shareResource(resourceRequestType) {
  //   this.setState({requestModal: true, resourceRequestType});
  // }
  //
  // closeModal() {
  //   this.setState({requestModal: false});
  // }
}
export default ChatFooter;
