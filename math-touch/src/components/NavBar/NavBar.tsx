import { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "../../assets/img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { PiCubeTransparentLight } from "react-icons/pi";
import { GoGraph } from "react-icons/go";
import { CgPhone } from "react-icons/cg";
import { 
  MdOutlineAssessment,
  MdVideogameAsset 
 } from "react-icons/md";
import s from "./NavBar.module.scss";

interface MenuItem {
  name: string;
  link: string;
}

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const [algebraMenu, setAlgebraMenu] = useState<MenuItem[]>([]);
  const [showDropdownGeometry, setShowDropdownGeometry] = useState(false);
  const [showDropdownAlgebra, setShowDropdownAlgebra] = useState(false);
  const navigate = useNavigate();

  const lastyear = "https://zno.osvita.ua/mathematics/";

  const handleLoginClick = () => {
    navigate("/auth");
  };
  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    
    // Використання тестових даних для меню
    const testMenu: MenuItem[] = [
      { name: "Лінійні рівняння", link: "/algebra/linear-equations" },
      { name: "Квадратні рівняння", link: "/algebra/quadratic-equations" },
      { name: "Многочлени", link: "/algebra/polynomials" },
      { name: "Матриці", link: "/algebra/matrices" },
    ];
    
    setAlgebraMenu(testMenu);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

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
          onClick={() => {
            updateExpanded(!expand);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav defaultActiveKey="#home">
            <Nav.Item
              style={{ marginLeft: "1em", position: "relative" }}
              onMouseEnter={() => setShowDropdownAlgebra(true)}
              onMouseLeave={() => setShowDropdownAlgebra(false)}
            >
              <Nav.Link as={Link} to="/algebra" onClick={() => updateExpanded(false)}>
                <GoGraph style={{ marginBottom: "2px" }} /> Алгебра
              </Nav.Link>

              {/* Підменю */}
              {showDropdownAlgebra && (
                <div className={s.dropdownMenu}>
                  {algebraMenu.map((item, index) => (
                    <Link
                      key={index}
                      to={item.link}
                      className={s.dropdownMenuItem}
                      onClick={() => updateExpanded(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </Nav.Item>

            <Nav.Item
              style={{ marginLeft: "1em", position: "relative" }}
              onMouseEnter={() => setShowDropdownGeometry(true)}
              onMouseLeave={() => setShowDropdownGeometry(false)}
            >
              <Nav.Link as={Link} to="/geometry" onClick={() => updateExpanded(false)}>
                <PiCubeTransparentLight style={{ marginBottom: "2px" }} /> Геометрія
              </Nav.Link>

              {/* Підменю */}
              {showDropdownGeometry && (
                <div className={s.dropdownMenu}>
                  {algebraMenu.map((item, index) => (
                    <Link
                      key={index}
                      to={item.link}
                      className={s.dropdownMenuItem}
                      onClick={() => updateExpanded(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </Nav.Item>
            
            <Nav.Item style={{ marginLeft: "1em" }}>
              <Nav.Link as={Link} to={lastyear} onClick={() => updateExpanded(false)}>
                <MdVideogameAsset style={{ marginBottom: "2px" }} /> Минулорічні НМТ
              </Nav.Link>
            </Nav.Item>
            
            <Nav.Item style={{ marginLeft: "1em" }}>
              <Nav.Link as={Link} to="/owntest" onClick={() => updateExpanded(false)}>
                <MdOutlineAssessment style={{ marginBottom: "2px" }} /> Власні тести
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
            
            <div className={s.login_div}>
              <button className={s.login_button} onClick={handleLoginClick}>
                Login
              </button>
            </div>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;