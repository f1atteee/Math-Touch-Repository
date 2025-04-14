import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { renderTextWithImages } from "../../utils/render/RenderTextWithImages";
import axios from "axios";

interface GeometryData {
  info: string;
  definition: string;
  images?: { id: number; data: string }[];
}

const GeometryDataComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<GeometryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const parsedId = useMemo(() => (id ? Number(id) : null), [id]);

  const fetchImages = useCallback(async (themeId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Токен не знайдено");
        setLoading(false);
        return [];
      }

      const response = await axios.post(
        `http://192.168.31.91:8082/api/Image/GetImagesForThem?typeMath=2&idThem=${themeId}`,
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
  }, []);

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
        "http://192.168.31.91:8082/api/Geometry/GetGeometryDataById",
        [parsedId],
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "text/plain",
          },
        }
      );

      const geometryData = response.data[0];

      if (geometryData) {
        const images = await fetchImages(parsedId);
        setData({
          info: geometryData.info || "Інформація не надана",
          definition: geometryData.definition || "Визначення не надано",
          images,
        });
      } else {
        setError("Дані не знайдено");
      }
    } catch (err: any) {
      console.error("Помилка при завантаженні:", err);
      setError(err.response?.data?.message || "Не вдалося завантажити дані");
    } finally {
      setLoading(false);
    }
  }, [parsedId, fetchImages]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>Geometry Data</h1>
      {loading && <p>Завантаження...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data ? (
        <>
          <div>
            <h2>Загальна інформація</h2>
            {renderTextWithImages(data.info, data.images)}
          </div>
          <div>
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

export default GeometryDataComponent;
