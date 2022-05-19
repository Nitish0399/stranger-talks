import styles from "../styles/contact.module.css";
import contactIllustrationImage from "../images/contact-illustration.svg";

function Contact() {
  return (<div className="container pt-3 pb-5 d-flex justify-content-center justify-content-md-evenly align-items-center flex-wrap flex-md-nowrap">
    <div>
      <img id={styles['contact-illustration']} src={contactIllustrationImage} alt="Contact Illustration"/>
    </div>
    <form>
      <div class="form-floating mb-3">
        <input type="text" class="form-control" id={styles['name-input']} placeholder="Nitish"/>
        <label for="name-input">Your Name</label>
      </div>
      <div class="form-floating mb-3">
        <input type="email" class="form-control" id={styles['email-input']} placeholder="name@example.com"/>
        <label for="email-input">Email Id</label>
      </div>
      <div class="form-floating mb-3">
        <textarea class="form-control" placeholder="Type your message here" id={styles['message-input']}></textarea>
        <label for="message-input">Message</label>
      </div>
      <button id={styles['submit-btn']} type="button" class="btn btn-primary" onClick={(e) => submitContactForm(e)}>Send</button>
    </form>
  </div>);

  function submitContactForm(e) {
    console.log(e);
  }
}

export default Contact;
