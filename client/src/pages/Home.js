import React from 'react'
import {Link} from "react-router-dom";
import {Container} from 'react-bootstrap';
import {SocketContext} from "../context.js";
import styles from "../styles/home.module.css";
import chatIllustrationImage from "../images/chat-illustration.svg";
import developerImage from "../images/developer-image.jpg";

class Home extends React.Component {
  static contextType = SocketContext;

  constructor(props) {
    super(props);
    this.chatSocket = props.chatSocket;
    this.connectStranger = this.connectStranger.bind(this);
  }

  render() {
    return (<div className="pb-3">
      <Container className="d-flex justify-content-center justify-content-md-between justify-content-xl-evenly align-items-center flex-wrap flex-md-nowrap">
        <div id={styles['app-details']} className="text-center text-md-start">
          <h1 id={styles["app-title"]}>Talk with Strangers Online</h1>
          <p id={styles["app-description"]}>Connect with people around the world. Have engaging communication by sharing photos and videos.
          </p>
          <Link to="chat">
            <button id={styles['start-chat-btn']} onClick={this.connectStranger}>Connect with a Stranger now</button>
          </Link>
        </div>
        <div>
          <img id={styles["chat-illustration"]} src={chatIllustrationImage} alt="Chat Illustration"/>
        </div>
      </Container>
      <Container>
        <div className="d-flex justify-content-center justify-content-md-end justify-content-xl-center align-items-center flex-wrap my-4">
          <span id={styles['developer-label']}>Designed & Developed By</span>
          <div className="d-inline-block" id={styles['developer-data']}><img src={developerImage} alt="Developer"/>
            <span id={styles['developer-name']}>Nitish Gattepalli</span>
          </div>
        </div>
      </Container>
    </div>);
  }

  connectStranger() {
    this.context.connectStranger();
  }
}

export default Home;
