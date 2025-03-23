import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface AlgebraData {
  info: string;
  definition: string;
}

const AlgebraDataComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Отримуємо параметр id з URL
  const [data, setData] = useState<AlgebraData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const parsedId = useMemo(() => (id ? Number(id) : null), [id]);

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
      console.log("ID для запиту:", parsedId);

      const response = await axios.post(
        "http://localhost:5176/api/Algebra/GetAlgebraDataById", // Ваш API для algebra
        [parsedId], // Масив з ID
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "text/plain",
          },
        }
      );

      console.log("Відповідь сервера:", response.data);

      // Оскільки відповідь сервера — це масив, беремо перший елемент
      const algebraData = response.data[0];

      // Якщо дані існують, оновлюємо стейт
      if (algebraData) {
        setData({
          info: algebraData.info || "Інформація не надана",
          definition: algebraData.definition || "Визначення не надано",
        });
      } else {
        setError("Дані не знайдено");
      }
    } catch (err: any) {
      console.error("Помилка при завантаженні:", err);
      setError(
        err.response?.data?.message || "Не вдалося завантажити дані"
      );
    } finally {
      setLoading(false);
    }
  }, [parsedId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Algebra Data</h1>
      {loading && <p>Завантаження...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data ? (
        <>
          <div>
            <h2>Info</h2>
            <p>{data.info}</p>
          </div>
          <div>
            <h2>Definition</h2>
            <p>{data.definition}</p>
          </div>
        </>
      ) : (
        <p>Дані не доступні</p>
      )}
    </div>
  );
};

export default AlgebraDataComponent;