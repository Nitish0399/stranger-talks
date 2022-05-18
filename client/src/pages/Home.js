import {useContext, useState, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {Container} from 'react-bootstrap';
import {SocketContext} from "../context.js";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "../styles/home.module.css";
import chatIllustrationImage from "../images/chat-illustration.svg";
import constants from "../config/constants.js";

function Home() {

  const chatSocket = useContext(SocketContext);
  const navigate = useNavigate();

  const [strangersOnlineCount, setStrangersOnlineCount] = useState(chatSocket.strangersOnlineCount);

  const [chatButtonLoaderDisplay, setChatButtonLoaderDisplay] = useState(false)

  const onStrangerOnlineCountChange = () => {
    setStrangersOnlineCount(chatSocket.strangersOnlineCount);
  }

  useEffect(() => {
    chatSocket.attach(onStrangerOnlineCountChange);

    // Detach observer when component unmounted
    return() => chatSocket.detach(onStrangerOnlineCountChange);
  })

  function navigateToChat(e) {
    e.preventDefault();
    setChatButtonLoaderDisplay(true);
    window.grecaptcha.ready(function() {
      window.grecaptcha.execute(constants.G_RECAPTCHA_SITE_KEY, {action: 'submit'}).then(function(token) {
        verifyRecaptchaToken(token);
      });
    });
  }

  function verifyRecaptchaToken(token) {
    fetch(`${constants.APP_URL}/api/v1/recaptcha/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'g_recaptcha_token': token})
    }).then(response => response.json()).then(data => {
      if (data.status === "Success") {
        navigate('/chat');
      } else {
        throw new Error(data.message);
      }
    }).catch((error) => {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
    }).then(() => {
      setChatButtonLoaderDisplay(false);
    });
  }

  return (<div className="pt-2 pb-4">
    <Container className="d-flex justify-content-center justify-content-md-between justify-content-xl-evenly align-items-center flex-wrap flex-md-nowrap">
      <div id={styles['app-details']} className="text-center text-md-start">
        <h1 id={styles["app-title"]}>Talk with Strangers Online</h1>
        <p id={styles["app-description"]}>Connect with people around the world. Have engaging communications by chatting live.
        </p>
        <button id={styles['start-chat-btn']} className="btn btn-primary" type="button" onClick={(e) => navigateToChat(e)}>
          Connect with a Stranger now {
            (chatButtonLoaderDisplay)
              ? <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
              : null
          }

        </button>

        <div id={styles['compliance-text']} className="mt-3">
          <p>By connecting to a stranger, you agree to our&nbsp;
            <Link to="terms-and-conditions">
              Terms & Conditions
            </Link>
            &nbsp;and&nbsp;
            <Link to="privacy-policy">Privacy Policy</Link>
          </p>
        </div>
        <div id={styles['compliance-text']} className="mt-3">
          <p>This site is protected by reCAPTCHA and the Google&nbsp;
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            &nbsp;and&nbsp;
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
            &nbsp;apply.
          </p>
        </div>
      </div>
      <div className="d-flex flex-column">
        <img id={styles["chat-illustration"]} className="order-2 order-md-1" src={chatIllustrationImage} alt="Chat Illustration"/>
        <div id={styles['strangers-online']} className="order-1 order-md-2">
          <h5>{strangersOnlineCount}</h5>
          <h6>Strangers Online</h6>
        </div>
      </div>
    </Container>
  </div>);

}

export default Home;
