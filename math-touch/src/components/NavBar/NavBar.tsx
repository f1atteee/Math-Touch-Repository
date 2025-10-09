import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "../../assets/img/logo.png";
import { Link } from "react-router-dom";
import { SECTION_GET_BY_TYPE_URL, USER_GET_BY_ID_URL } from "@src/config/api";
import { PiCubeTransparentLight } from "react-icons/pi";
import { GoGraph } from "react-icons/go";
import { CgNotes, CgPhone } from "react-icons/cg";
import { MdOutlineAssessment, MdVideogameAsset } from "react-icons/md";
import s from "./NavBar.module.scss";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
import ProfileModal from "@src/components/Profile/ProfileModal";
import { useAuth } from "@src/context/AuthContext";

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthorized, user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

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
          USER_GET_BY_ID_URL(userId),
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
            fetchUrl={SECTION_GET_BY_TYPE_URL}
            updateExpanded={updateExpanded}
          />
          <DropDownMenu
            label="Геометрія"
            icon={<PiCubeTransparentLight style={{ marginBottom: "2px" }} />}
            typeMath={2}
            pathPrefix="geometry"
            fetchUrl={SECTION_GET_BY_TYPE_URL}
            updateExpanded={updateExpanded}
          />
          
          {/* ЗМІНЕНО: НМТ Минулих Років */}
          <Nav.Item style={{ marginLeft: "1em" }}>
            <Nav.Link
              href={lastyear} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => updateExpanded(false)}
            >
              <MdVideogameAsset style={{ marginBottom: "2px" }} /> НМТ Минулих Років
            </Nav.Link>
          </Nav.Item>
          
          <Nav.Item style={{ marginLeft: "1em" }}>
            <Nav.Link as={Link} to="/owntest" onClick={() => updateExpanded(false)}>
              <MdOutlineAssessment style={{ marginBottom: "2px" }} /> Мій Конструктор Тестів
            </Nav.Link>
          </Nav.Item>

          <Nav.Item style={{ marginLeft: "1em" }}>
            <Nav.Link as={Link} to="/notate" onClick={() => updateExpanded(false)}>
              <CgNotes style={{ marginBottom: "2px" }} /> Нотатки
            </Nav.Link>
          </Nav.Item>
          
          <Nav.Item style={{ marginLeft: "1em" }}>
            <Nav.Link as={Link} to="/contact" onClick={() => updateExpanded(false)}>
              <CgPhone style={{ marginBottom: "2px" }} /> Зворотний Зв'язок
            </Nav.Link>
          </Nav.Item>
          <div className={s.login_container}>
            <div className={s.login_div}>
              {!isAuthorized ? (
                <button className={s.login_button} onClick={() => navigate('/auth')}>
                  Login
                </button>
              ) : (
                <button className={s.login_button} onClick={() => setShowProfile(true)}>
                  {user?.userName || userName || 'Profile'}
                </button>
              )}
            </div>
            {isAuthorized && (
              <button className={s.logout_button} onClick={handleLogout}>
                Вихід
              </button>
            )}
          </div>
        </Nav>
      </Navbar.Collapse>
      <ProfileModal show={showProfile} handleClose={() => setShowProfile(false)} />
    </Navbar>
  );
}

export default NavBar;
