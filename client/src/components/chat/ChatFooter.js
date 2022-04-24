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

    // Add keyboard "Enter" keydown event listener to send message
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter" || event.keyCode === 13) {
        event.preventDefault();
        sendMessage();
      }
    };
    document.addEventListener("keyup", listener);

    // Detach observer when component unmounted
    return() => {
      chatSocket.detach(onChatStatusChange);
      document.removeEventListener("keyup", listener);
    };
  })

  let footerState = "d-block"; // footer visible
  if (chatStatus !== "Connected" && chatStatus !== "Disconnected") {
    footerState = "d-none"; // footer hidden
  }

  if (chatStatus === "Disconnected") {
    return (<div id={styles["chat-footer"]}>
      <Link to="/chat" onClick={() => window.location.reload()} className="d-block text-center">
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
    if (messageInput !== "") {
      chatSocket.messagesList.push({"message": messageInput, "party": "Sender"});
      chatSocket.sendMessage(messageInput);
      setMessageInput("");
    }
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
