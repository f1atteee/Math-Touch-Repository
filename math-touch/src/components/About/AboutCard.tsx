import Card from "react-bootstrap/Card";
import s from "./About.module.scss"

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className={s.green}>Nazar Kravets </span>
            from <span className={s.green}> Lviv, Ukraine.</span>
            <br/>I currently work as a developer in the distribution company - BERTAgroup. 
            <br/>Specifically, my position covers such types of work as managing the replication of data from the POS system to the back office. 
            <br/>I also write instruments mostly in C#. Even to my specialization, such skills as writing bot telegrams for working with business processes in the company were added. 
            <br/>A bot that divides users according to a hierarchical system relative to it, you have many opportunities to work with it. 
            <br/>Well, I also study and practice Front-end layout to visualize the work of my APIs
          </p>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;