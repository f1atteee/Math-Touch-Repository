import { Col, Row } from "react-bootstrap";
import {
  SiVisualstudiocode,
  SiPostman,
  SiSlack,
  SiTelegram,
} from "react-icons/si";
import {
    DiTrello,
    DiStackoverflow,
} from "react-icons/di"
import s from "./About.module.scss"

function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className={s.tech_icons}>
        <SiVisualstudiocode />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        < DiTrello/>
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <SiPostman />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <SiSlack />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <DiStackoverflow />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <SiTelegram />
      </Col>
    </Row>
  );
}

export default Toolstack;