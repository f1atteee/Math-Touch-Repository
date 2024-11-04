import { Col, Row } from "react-bootstrap";
import {
  DiJavascript1,
  DiReact,
  DiPython,
  DiGit,
  DiDatabase,
  DiDotnet,
  DiMysql,
  DiMsqlServer,
  DiMarkdown,
  DiSqllite
} 
from "react-icons/di";
import {
  SiSolidity,
  SiPostgresql,
  SiPostman,
} from "react-icons/si";
import s from "./About.module.scss"

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className={s.tech_icons}>
        <DiDotnet />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <DiJavascript1 />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <DiMsqlServer />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <DiDatabase />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <DiReact />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <SiSolidity />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <DiMarkdown />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <DiMysql />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <DiGit />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <SiPostman />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <DiSqllite />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <SiPostgresql />
      </Col>
      <Col xs={4} md={2} className={s.tech_icons}>
        <DiPython />
      </Col>
    </Row>
  );
}

export default Techstack;