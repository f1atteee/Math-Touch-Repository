import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../assets/img/logo.png";
import Toolstack from "./Toolstack";
import s from "./About.module.scss"

function About() {
  return (
    <Container fluid className={s.about_section}>
      <Particle />
      <Container>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              Know Who <strong className={s.green}>I'M</strong>
            </h1>
            <Aboutcard />
          </Col>
          <Col
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px" }}
            className={s.about_img}
          >
            <img src={laptopImg} alt="about" className={s.img_fluid} />
          </Col>
        </Row>
        <h1 className={s.heading}>
          Professional <strong className={s.green}>Skillset </strong>
        </h1>

        <Techstack />

        <h1 className={s.heading}>
          <strong className={s.green}>Tools</strong> I use
        </h1>
        <Toolstack />

      </Container>
    </Container>
  );
}

export default About;