import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import s from "./DropDownMenu.module.scss";
import { THEMS_GET_BY_IDS_FOR_TYPE_URL } from "@src/config/api";

interface TopicItem {
  id: number;
  topic: string;
  idParagraph: number;
  typeMath: number;
}

interface SectionItem {
  id: number;
  name: string;
  includeThemsJson: string;
  typeMath: number;
  subItems?: TopicItem[];
}

interface DropDownMenuProps {
  label: string;
  icon: JSX.Element;
  typeMath: number;
  pathPrefix: string;
  fetchUrl: string;
  updateExpanded: (expanded: boolean) => void;
}

const DropDownMenu = ({
  label,
  icon,
  typeMath,
  pathPrefix,
  fetchUrl,
  updateExpanded,
}: DropDownMenuProps) => {
  const [menuItems, setMenuItems] = useState<SectionItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionItem | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await fetch(`${fetchUrl}?typeMath=${typeMath}`, {
        method: "POST",
        headers: {
          accept: "text/plain",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) return;

      const rawData = await response.json();

      const formatted = rawData.map((item: any) => ({
        id: item.idOrder,
        name: item.name,
        includeThemsJson: item.includeThemsJson,
        typeMath: item.typeMath,
      }));

      setMenuItems(formatted);
    } catch (error) {}
  };

  const fetchTopicsByIds = async (themeIds: number[], typeMath: number): Promise<TopicItem[]> => {
    const token = localStorage.getItem("access_token");
    if (!token) return [];

    const response = await fetch(
      `${THEMS_GET_BY_IDS_FOR_TYPE_URL}?typeMath=${typeMath}`,
      {
        method: "POST",
        headers: {
          "accept": "text/plain",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(themeIds),
      }
    );

    if (!response.ok) throw new Error("Не вдалося завантажити підтеми");

    const topics = await response.json();
    return topics;
  };

  const handleTopicClick = (topic: TopicItem) => {
    const route = typeMath === 1 ? `/algebra/${topic.idParagraph}` : `/geometry/${topic.idParagraph}`;
    navigate(route, { state: { topicName: topic.topic } }); // Передаємо назву підтеми
    updateExpanded(false);
  };

  const handleSectionHover = async (section: SectionItem) => {
    if (section.subItems) {
      setActiveSection(section);
      return;
    }

    try {
      const themeIds = JSON.parse(section.includeThemsJson);
      const topics = await fetchTopicsByIds(themeIds, section.typeMath);

      const updated = menuItems.map((item) =>
        item.id === section.id ? { ...item, subItems: topics } : item
      );
      setMenuItems(updated);
      setActiveSection({ ...section, subItems: topics });
    } catch (err) {}
  };

  return (
    <div
      className={s.dropdownWrapper}
      onMouseEnter={() => {
        setShowDropdown(true);
        fetchData();
      }}
      onMouseLeave={() => {
        setShowDropdown(false);
        setActiveSection(null);
      }}
    >
      <Link to={`/${pathPrefix}`} className="nav-link" onClick={() => updateExpanded(false)}>
        {icon} {label}
      </Link>

      {showDropdown && (
        <div className={s.dropdownMenu}>
          <div className={s.sectionList}>
            {menuItems.map((section) => (
              <div
                key={section.id}
                className={`${s.dropdownMenuItem} ${
                  activeSection?.id === section.id ? s.active : ""
                }`}
                onMouseEnter={() => handleSectionHover(section)}
              >
                {section.name}

                {activeSection?.id === section.id && activeSection.subItems && (
                  <div className={`${s.subMenu} ${activeSection.subItems.length > 0 ? s.visible : ""}`}>
                    {activeSection.subItems.map((topic) => (
                      <div
                        key={topic.id}
                        className={s.dropdownMenuItem}
                        onClick={() => handleTopicClick(topic)}
                      >
                        {topic.topic}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownMenu;
