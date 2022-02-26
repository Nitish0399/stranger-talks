import React from 'react'
import styles from "../styles/chat.module.css";
import ChatMsg from "../components/ChatMsg";
import ChatMetaMsg from "../components/ChatMetaMsg";
import {Rings} from 'react-loader-spinner';

class ChatBody extends React.Component {

  render() {
    let child;
    if (this.props.headerType === "Connected") {
      child = <ChatBodyConnected/>;
    } else if (this.props.headerType === "Searching") {
      child = <ChatBodySearching/>;
    } else {
      child = <ChatBodyFailed/>;
    }
    return {
      ...child
    };
  }
  //
  // componentDidMount() {
  //   this.updateScroll();
  // }

}

function ChatBodyConnected() {

  function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
  }

  return (<div id={styles['chat-body']} ref={el => scrollToBottom(el)}>
    <ChatMsg message="Hey, Where are  you from?" msgType="Received"/>
    <ChatMsg message="Heloo, I am from India!" msgType="Sent"/>
    <ChatMsg message="Cool, I am too from India" msgType="Received"/>
    <ChatMetaMsg message="Sharing photo request sent"/>
    <ChatMetaMsg message="Stranger sent photo sharing request"/>
    <ChatMsg message="Thats amazing :)"/>
    <ChatMetaMsg message="You approved the request"/>
    <ChatMetaMsg message="Stranger approved your request"/>
    <ChatMsg message="Hey, Where are  you from?" msgType="Received"/>
    <ChatMsg message="Heloo, I am from India!" msgType="Sent"/>
    <ChatMsg message="Cool, I am too from India" msgType="Received"/>
    <ChatMetaMsg message="Sharing photo request sent"/>
    <ChatMetaMsg message="Stranger sent photo sharing request"/>
    <ChatMsg message="Thats amazing :)"/>
    <ChatMetaMsg message="You approved the request"/>
    <ChatMetaMsg message="Stranger approved your request"/>
    <ChatMsg message="Hey, Where are  you from?" msgType="Received"/>
    <ChatMsg message="Heloo, I am from India!" msgType="Sent"/>
    <ChatMsg message="Cool, I am too from India" msgType="Received"/>
    <ChatMetaMsg message="Sharing photo request sent"/>
    <ChatMetaMsg message="Stranger sent photo sharing request"/>
    <ChatMsg message="Thats amazing :)"/>
    <ChatMetaMsg message="You approved the request"/>
    <ChatMetaMsg message="Stranger approved your request"/><ChatMsg message="Hey, Where are  you from?" msgType="Received"/>
    <ChatMsg message="Heloo, I am from India!" msgType="Sent"/>
    <ChatMsg message="Cool, I am too from India" msgType="Received"/>
    <ChatMetaMsg message="Sharing photo request sent"/>
    <ChatMetaMsg message="Stranger sent photo sharing request"/>
    <ChatMsg message="Thats amazing :)"/>
    <ChatMetaMsg message="You approved the request"/>
    <ChatMetaMsg message="Stranger approved your request"/>
  </div>);
}

function ChatBodySearching() {
  return (<div id={styles['chat-body']}>
    <div id={styles['loader']}>
      <Rings height="70" width="70" color='#909090' className="justify-content-center" ariaLabel='loading'/>
    </div>
  </div>);
}

function ChatBodyFailed() {
  return (<div id={styles['chat-body']}>
    <p id={styles['failed-chat-body-text']}>No one is available at this moment to connect.</p>
  </div>);
}

export default ChatBody;
