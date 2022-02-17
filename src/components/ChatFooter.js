import React from 'react';
import {Modal} from 'react-bootstrap';
import styles from "../styles/chat.module.css";
import sendIcon from "../images/send-icon.svg";
import photoIcon from "../images/photo-icon.svg";
import videoIcon from "../images/video-icon.svg";

class ChatFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestModal: false
    };

    this.sendAsset = this.sendAsset.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  render() {
    let footerState = "d-block"; // footer visible
    if (this.props.headerType != "Connected") {
      footerState = "d-none";
    }

    return (<div>
      <div id={styles['chat-footer']} className={`d-flex justify-content-between align-items-center ${footerState}`}>
        <div id={styles['chat-input']} className="flex-grow-1">
          <input type="text" placeholder="Type your message here"/>
          <button type="button" id={styles['send-btn']}><img src={sendIcon} alt="Send Icon"/></button>
        </div>
        <button type="button" id={styles['photo-upload-btn']}>
          <img src={photoIcon} alt="Photo Icon" onClick={this.sendAsset}/></button>
        <button type="button" id={styles['video-upload-btn']}>
          <img src={videoIcon} alt="Video Icon" onClick={this.sendAsset}/></button>
      </div>
      <RequestModal show={this.state.requestModal} onHide={this.closeModal}/>
    </div>);
  }

  sendAsset() {
    this.setState({requestModal: true});
  }

  closeModal() {
    this.setState({requestModal: false});
  }

}
function RequestModal(props) {
  return (<Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered="centered">
    <Modal.Body>
      <h4>Centered Modal</h4>
      <p>
        Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
      </p>
    </Modal.Body>
    <Modal.Footer>
      <button onClick={props.onHide}>Close</button>
    </Modal.Footer>
  </Modal>);
}

export default ChatFooter;
