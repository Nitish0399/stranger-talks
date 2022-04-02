import React from 'react'
import {Link} from "react-router-dom";
import {Container} from 'react-bootstrap';
import {SocketContext} from "../context.js";
import styles from "../styles/home.module.css";
import chatIllustrationImage from "../images/chat-illustration.svg";
import developerImage from "../images/developer-image.jpg";

class Home extends React.Component {
  _isMounted = false;

  static contextType = SocketContext;

  constructor(props, context) {
    super(props);

    context.getStrangersOnlineCount();

    this.state = {
      strangersOnlineCount: 0
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.context.socket.on("chat:strangers-online", function(strangersOnlineCount) {
      // For eliminating memory leak when component is unmounted
      if (this._isMounted) {
        this.setState({strangersOnlineCount});
      }
    }.bind(this));

  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (<div className="pt-2 pb-5">
      <Container className="d-flex justify-content-center justify-content-md-between justify-content-xl-evenly align-items-center flex-wrap flex-md-nowrap">
        <div id={styles['app-details']} className="text-center text-md-start">
          <h1 id={styles["app-title"]}>Talk with Strangers Online</h1>
          <p id={styles["app-description"]}>Connect with people around the world. Have engaging communication by sharing photos and videos.
          </p>
          <Link to="chat">
            <button id={styles['start-chat-btn']}>Connect with a Stranger now</button>
          </Link>
          <div id={styles['compliance-text']} className="mt-3">
            <p>By connecting to a stranger, you agree to our&nbsp;
              <Link to="terms-and-conditions">
                Terms & Conditions
              </Link>
              &nbsp;and&nbsp;
              <Link to="privacy-policy">Privacy Policy</Link>
            </p>
          </div>
        </div>
        <div className="d-flex flex-column">
          <img id={styles["chat-illustration"]} className="order-2 order-md-1" src={chatIllustrationImage} alt="Chat Illustration"/>
          <div id={styles['strangers-online']} className="order-1 order-md-2">
            <h5>{this.state.strangersOnlineCount}</h5>
            <h6>Strangers Online</h6>
          </div>
        </div>
      </Container>
      {/*<Container>
        <div className="d-flex justify-content-center justify-content-md-end justify-content-xl-center align-items-center flex-wrap my-4">
          <span id={styles['developer-label']}>Designed & Developed By</span>
          <div className="d-inline-block" id={styles['developer-data']}><img src={developerImage} alt="Developer"/>
            <span id={styles['developer-name']}>Nitish Gattepalli</span>
          </div>
        </div>
      </Container>*/
      }
    </div>);
  }

}

export default Home;
