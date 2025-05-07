import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { renderTextWithImages } from "../../utils/render/RenderTextWithImages";
import s from "./UniversalMathComponent.module.scss";

interface MathData {
  info: string;
  definition: string;
  images?: { id: number; data: string }[]; // Тільки для Геометрії
}

interface UniversalMathComponentProps {
  typeMath: number; // 1 для Алгебри, 2 для Геометрії
  fetchUrl: string; // URL для основного запиту
  fetchImagesUrl?: string; // URL для запиту зображень (тільки для Геометрії)
}

const UniversalMathComponent: React.FC<UniversalMathComponentProps> = ({
  typeMath,
  fetchUrl,
  fetchImagesUrl,
}) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { topicName } = location.state || {}; // Отримуємо назву підтеми

  const [data, setData] = useState<MathData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const parsedId = useMemo(() => (id ? Number(id) : null), [id]);

  const fetchImages = useCallback(async (themeId: number) => {
    if (!fetchImagesUrl) return []; // Якщо URL для зображень не заданий, повертаємо порожній масив

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Токен не знайдено");
        setLoading(false);
        return [];
      }

      const response = await axios.post(
        `${fetchImagesUrl}?typeMath=${typeMath}&idThem=${themeId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "text/plain",
          },
        }
      );

      return response.data.map((img: any) => ({
        id: img.id,
        data: img.data && img.data.startsWith("data:")
          ? img.data
          : `data:image/jpeg;base64,${img.data}`,
      }));
    } catch (err) {
      console.error("Помилка при завантаженні зображень:", err);
      return [];
    }
  }, [fetchImagesUrl, typeMath]);

  const fetchData = useCallback(async () => {
    if (parsedId === null) {
      setError("Невірний ID");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Токен не знайдено");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        fetchUrl,
        [parsedId],
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "text/plain",
          },
        }
      );

      const mathData = response.data[0];

      if (!mathData) {
        setError("Дані не знайдено");
        setLoading(false);
        return;
      }

      let images = [];
      if (typeMath === 2 && fetchImagesUrl) {
        // Завантажуємо зображення тільки для Геометрії
        images = await fetchImages(parsedId);
      }

      setData({
        info: mathData.info || "Інформація не надана",
        definition: mathData.definition || "Визначення не надано",
        images,
      });
    } catch (err: any) {
      console.error("Помилка при завантаженні:", err);
      setError(err.response?.data?.message || "Не вдалося завантажити дані");
    } finally {
      setLoading(false);
    }
  }, [parsedId, fetchUrl, fetchImages, typeMath, fetchImagesUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className={s.container}>
      {/* Виводимо назву підтеми, якщо вона є, інакше показуємо тип математики */}
      <h1>{topicName || (typeMath === 1 ? "Алгебра" : "Геометрія")}</h1>
      {loading && <p>Завантаження...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data ? (
        <>
          <div className={s.preserveWhitespace}>
            <h2>Загальна інформація</h2>
            {typeMath === 2 && data.images
              ? renderTextWithImages(data.info, data.images)
              : <p>{data.info}</p>}
          </div>
          <div className={s.preserveWhitespace}>
            <h2>Словничок термінів</h2>
            <p>{data.definition}</p>
          </div>
        </>
      ) : (
        <p>Дані не доступні</p>
      )}
    </div>
  );
};

export default UniversalMathComponent;