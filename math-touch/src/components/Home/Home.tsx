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
                <br/>
                <h3 className={s.heading_name} style={{paddingBottom: "50px"}}>
                Тут ти знайдеш усе, що потрібно для підготовки до <span className={s.green}>ЗНО\НМТ з математики.</span>
                <br/>Вивчай теми, проходь тести — і впевнено складай іспит!
                </h3>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    );
}

export default Home;