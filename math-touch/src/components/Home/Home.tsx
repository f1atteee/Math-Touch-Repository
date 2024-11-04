import { Container, Row, Col } from "react-bootstrap";
import s from "../Home/Home.module.scss"

function Home() {
    return(
        <section>
        <div className={s.home_section} id="home">
          <Container className={s.home_content}>
            <Row>
              <Col md={7} className={s.home_header}>
                <h1 className={s.heading}>
                  Привіт!{" "}
                  <span className={s.wave} role="img" aria-labelledby="wave">
                    👋🏻
                  </span>
                </h1>
                <h1 className={s.heading_name}>
                  Я
                  <strong className={s.main_name}> твій посібник з математики </strong>
                </h1>

              </Col>
            </Row>
          </Container>
          <Container className={s.home_page_two}>
            <Row>
              <Col md={7}>
                <h3 className={s.heading_name} style={{paddingBottom: "50px"}}>
                Допоможу <span className={s.green}> пригадати або ж вивчити</span>. <br/>Усі<span className={s.green}> теми із шкільного курсу математики</span>. 
                </h3>
                <br/>
                <br/>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    );
}

export default Home;