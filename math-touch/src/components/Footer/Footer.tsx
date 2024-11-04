import { Row, Col} from "react-bootstrap";
import {
  AiFillGithub,
} from "react-icons/ai";
import s from "../Footer/Footer.module.scss"

function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <div className={s.footer}>
      <Row>
        <Col md="6" className={s.copywright}>
          <h3>Designed and Developed by Kravets' Devs</h3>
        </Col>
        <Col md="3" className={s.copywright}>
          <h3>Copyright © {year}</h3>
        </Col>
        <Col md="2" className={s.body}>
          <a
            href="https://github.com/f1atteee"
            style={{ color: "white" }}
            target="_blank" 
            rel="noopener noreferrer"
          >
            <AiFillGithub />
          </a>
        </Col>
      </Row>
    </div>
  );
}

export default Footer;