import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "../../assets/img/logo.png";
import { Link } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { PiCubeTransparentLight } from "react-icons/pi";
import { GoGraph } from "react-icons/go";
import { CgPhone } from "react-icons/cg";
import { MdOutlineAssessment, MdVideogameAsset } from "react-icons/md";
import s from "./NavBar.module.scss";
import DropDownMenu from "../DropDownMenu/DropDownMenu";

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  const lastyear = "https://zno.osvita.ua/mathematics/";

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("user");
      const token = localStorage.getItem("access_token");
      if (!userId || !token) return;

      try {
        const response = await fetch(
          `http://localhost:8081/api/User/GetById?id=${userId}`,
          {
            headers: {
              accept: "text/plain",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setUserName(data.userName);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUserData();
  }, []);

  const scrollHandler = () => {
    updateNavbar(window.scrollY >= 20);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
    window.location.reload();
  };

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={navColour ? s.sticky : s.navbar}
    >
      <Navbar.Brand href="/" className="d-flex">
        <img src={logo} className={s.img_fluid_logo} alt="brand" />
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="responsive-navbar-nav"
        onClick={() => updateExpanded(!expand)}
      >
        <span></span><span></span><span></span>
      </Navbar.Toggle>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav>
          <DropDownMenu
            label="Алгебра"
            icon={<GoGraph style={{ marginBottom: "2px" }} />}
            typeMath={1}
            pathPrefix="algebra"
            fetchUrl="http://localhost:8082/api/Section/GetSectionByTypeMath"
            updateExpanded={updateExpanded}
          />
          <DropDownMenu
            label="Геометрія"
            icon={<PiCubeTransparentLight style={{ marginBottom: "2px" }} />}
            typeMath={2}
            pathPrefix="geometry"
            fetchUrl="http://localhost:8082/api/Section/GetSectionByTypeMath"
            updateExpanded={updateExpanded}
          />
          <Nav.Item style={{ marginLeft: "1em" }}>
            <Nav.Link
              href={lastyear} // Використовуємо href для відкриття посилання
              target="_blank" // Відкриваємо посилання у новій вкладці
              rel="noopener noreferrer" // Забезпечуємо безпеку
              onClick={() => updateExpanded(false)} // Закриваємо меню
            >
              <MdVideogameAsset style={{ marginBottom: "2px" }} /> Минулорічні НМТ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item style={{ marginLeft: "1em" }}>
            <Nav.Link as={Link} to="/owntest" onClick={() => updateExpanded(false)}>
              <MdOutlineAssessment style={{ marginBottom: "2px" }} /> Авторські тести
            </Nav.Link>
          </Nav.Item>
          <Nav.Item style={{ marginLeft: "1em" }}>
            <Nav.Link as={Link} to="/about" onClick={() => updateExpanded(false)}>
              <AiOutlineUser style={{ marginBottom: "2px" }} /> Про нас
            </Nav.Link>
          </Nav.Item>
          <Nav.Item style={{ marginLeft: "1em" }}>
            <Nav.Link as={Link} to="/contact" onClick={() => updateExpanded(false)}>
              <CgPhone style={{ marginBottom: "2px" }} /> Зворотній зв'язок
            </Nav.Link>
          </Nav.Item>
          <div className={s.login_container}>
            <div className={s.login_div}>
              Привіт, {userName}
            </div>
            <button className={s.logout_button} onClick={handleLogout}>
              Вихід
            </button>
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
