import {useContext, useState, useEffect} from 'react';
import {SocketContext} from "../../context.js";
import {Link} from "react-router-dom";
import styles from "../../styles/chat.module.css";
// import ShareResourceRequestModal from "../modals/ShareResourceRequestModal";
// import ShareResourceResponseModal from "../modals/ShareResourceResponseModal";

import sendIcon from "../../images/send-icon.svg";
// import photoIcon from "../../images/photo-icon.svg";
// import videoIcon from "../../images/video-icon.svg";

function ChatFooter() {
  const chatSocket = useContext(SocketContext);
  const [chatStatus, setChatStatus] = useState(chatSocket.chatStatus);
  const [messageInput, setMessageInput] = useState("");
  // const [requestModal, setRequestModal] = useState(false);
  // const [resourceRequestType, setResourceRequestType] = useState("photo");

  const onChatStatusChange = () => {
    setChatStatus(chatSocket.chatStatus);
  }

  useEffect(() => {
    chatSocket.attach(onChatStatusChange);

    // Detach observer when component unmounted
    return() => chatSocket.detach(onChatStatusChange);
  })

  let footerState = "d-block"; // footer visible
  if (chatStatus !== "Connected" && chatStatus !== "Disconnected") {
    footerState = "d-none"; // footer hidden
  }

  if (chatStatus === "Disconnected") {
    return (<div id={styles["chat-footer"]}>
      <Link to="/chat" className="d-block text-center">
        <button id={styles['start-chat-btn']}>Connect again</button>
      </Link>
    </div>);
  }

  return (<div>
    <div id={styles["chat-footer"]} className={`d-flex justify-content-between align-items-center ${footerState}`}>
      <div id={styles["chat-input"]} className="flex-grow-1">
        <input type="text" value={messageInput} placeholder="Type your message here" onChange={handleMessageInputChange}/>
        <button type="button" id={styles["send-btn"]} onClick={sendMessage}>
          <img src={sendIcon} alt="Send Icon"/>
        </button>
      </div>
      {/*
      <button type="button" id={styles["photo-upload-btn"]}>
        <img src={photoIcon} alt="Photo Icon" onClick={() => shareResource("photo")}/>
      </button>
      <button type="button" id={styles["video-upload-btn"]}>
        <img src={videoIcon} alt="Video Icon" onClick={() => shareResource("video")}/>
      </button>
      */
      }
    </div>

    {/* <ShareResourceResponseModal resourceType={resourceRequestType} show={requestModal} onHide={closeModal}/> */}
  </div>);

  function handleMessageInputChange(e) {
    setMessageInput(e.target.value);
  }

  function sendMessage() {
    chatSocket.messagesList.push({"message": messageInput, "party": "Sender"});
    chatSocket.sendMessage(messageInput);
    setMessageInput("");
  }

  // function shareResource(resourceRequestType) {
  //   setRequestModal(true);
  //   setResourceRequestType(resourceRequestType);
  // }
  //
  // function closeModal() {
  //   setRequestModal(false);
  // }
}
export default ChatFooter;
