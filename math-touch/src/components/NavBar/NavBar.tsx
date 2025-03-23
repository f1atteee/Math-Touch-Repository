import { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "../../assets/img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { PiCubeTransparentLight } from "react-icons/pi";
import { GoGraph } from "react-icons/go";
import { CgPhone } from "react-icons/cg";
import { MdOutlineAssessment, MdVideogameAsset } from "react-icons/md";
import s from "./NavBar.module.scss";

interface MenuItem {
  id: number;
  name: string;
  link: string;
}

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const [algebraMenu, setAlgebraMenu] = useState<MenuItem[]>([]);
  const [geometryMenu, setGeometryMenu] = useState<MenuItem[]>([]);
  const [showDropdownGeometry, setShowDropdownGeometry] = useState(false);
  const [showDropdownAlgebra, setShowDropdownAlgebra] = useState(false);
  const navigate = useNavigate();

  const lastyear = "https://zno.osvita.ua/mathematics/";

  const handleLoginClick = () => {
    navigate("/auth");
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
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

  const fetchGeometryData = async () => {
    try {
      const token = localStorage.getItem("access_token"); // Отримуємо токен

      if (!token) {
        console.error("Токен не знайдено!");
        return;
      }

      const response = await fetch(
        "http://192.168.31.90:8082/api/Section/GetSectionByTypeMath?typeMath=2",
        {
          method: "POST",
          headers: {
            "accept": "text/plain",
            "Authorization": `Bearer ${token}`, // Додаємо токен до заголовків
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // API вимагає body, тому передаємо порожній об'єкт
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP помилка! Статус: ${response.status}`);
      }

      const rawData = await response.json();
      console.log(rawData);

      // Перетворення отриманих даних у формат MenuItem
      const formattedData: MenuItem[] = rawData.map((item: any) => ({
        id: item.idOrder, // Додай ID
        name: item.name,
        link: `/geometry/${item.idOrder}`, // Використовуємо idOrder для коректного маршруту
      }));

      setGeometryMenu(formattedData);
    } catch (error) {
      console.error("Помилка завантаження геометричних даних:", error);
    }
  };

  const fetchAlgebraData = async () => {
    try {
      const token = localStorage.getItem("access_token"); // Отримуємо токен

      if (!token) {
        console.error("Токен не знайдено!");
        return;
      }

      const response = await fetch(
        "http://192.168.31.90:8082/api/Section/GetSectionByTypeMath?typeMath=1",
        {
          method: "POST",
          headers: {
            "accept": "text/plain",
            "Authorization": `Bearer ${token}`, // Додаємо токен до заголовків
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // API вимагає body, тому передаємо порожній об'єкт
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP помилка! Статус: ${response.status}`);
      }

      const rawData = await response.json();
      console.log(rawData);

      // Перетворення отриманих даних у формат MenuItem
      const formattedData: MenuItem[] = rawData.map((item: any) => ({
        id: item.idOrder, // Додай ID
        name: item.name,
        link: `/algebra/${item.idOrder}`, // Використовуємо idOrder для коректного маршруту
      }));

      setAlgebraMenu(formattedData);
    } catch (error) {
      console.error("Помилка завантаження алгебраїчних даних:", error);
    }
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
          {/* Алгебра */}
          <Nav.Item
            style={{ marginLeft: "1em", position: "relative" }}
            onMouseEnter={() => {
              setShowDropdownAlgebra(true);
              fetchAlgebraData(); // Запит виконується при наведенні
            }}
            onMouseLeave={() => setShowDropdownAlgebra(false)}
          >
            <Nav.Link as={Link} to="/algebra" onClick={() => updateExpanded(false)}>
              <GoGraph style={{ marginBottom: "2px" }} /> Алгебра
            </Nav.Link>

            {showDropdownAlgebra && (
              <div className={s.dropdownMenu}>
                {algebraMenu.length > 0 ? (
                  algebraMenu.map((item, index) => (
                    <Link
                      key={index}
                      to={item.link} // Використовуємо згенероване посилання
                      className={s.dropdownMenuItem}
                      onClick={() => updateExpanded(false)}
                    >
                      {item.name}
                    </Link>
                  ))
                ) : (
                  <div className={s.dropdownMenuItem}>Завантаження...</div>
                )}
              </div>
            )}
          </Nav.Item>

          {/* Геометрія */}
          <Nav.Item
            style={{ marginLeft: "1em", position: "relative" }}
            onMouseEnter={() => {
              setShowDropdownGeometry(true);
              fetchGeometryData(); // Запит виконується при наведенні
            }}
            onMouseLeave={() => setShowDropdownGeometry(false)}
          >
            <Nav.Link as={Link} to="/geometry" onClick={() => updateExpanded(false)}>
              <PiCubeTransparentLight style={{ marginBottom: "2px" }} /> Геометрія
            </Nav.Link>

            {showDropdownGeometry && (
              <div className={s.dropdownMenu}>
                {geometryMenu.length > 0 ? (
                  geometryMenu.map((item, index) => (
                    <Link
                      key={index}
                      to={item.link} // Використовуємо згенероване посилання
                      className={s.dropdownMenuItem}
                      onClick={() => updateExpanded(false)}
                    >
                      {item.name}
                    </Link>
                  ))
                ) : (
                  <div className={s.dropdownMenuItem}>Завантаження...</div>
                )}
              </div>
            )}
          </Nav.Item>

          {/* Інші пункти меню */}
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