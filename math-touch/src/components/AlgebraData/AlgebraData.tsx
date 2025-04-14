import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./AlgebraData.module.scss";

interface AlgebraData {
  info: string;
  definition: string;
}

const AlgebraDataComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
      const response = await axios.post(
        "http://192.168.31.91:8082/api/Algebra/GetAlgebraDataById",
        [parsedId],
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "text/plain",
          },
        }
      );

      const algebraData = response.data[0];

      if (!algebraData) {
        setError("Дані не знайдено");
        setLoading(false);
        return;
      }

      const info = algebraData.info || "Інформація не надана";
      const definition = algebraData.definition || "Визначення не надано";
      setData({ info, definition });
    } catch (err: any) {
      console.error("Помилка при завантаженні:", err);
      setError(err.response?.data?.message || "Не вдалося завантажити дані");
    } finally {
      setLoading(false);
    }
  }, [parsedId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="algebra-data-container">
      <h1>Algebra Data</h1>
      {loading && <p className="loading">Завантаження...</p>}
      {error && <p className="error">{error}</p>}
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
        <p className="no-data">Дані не доступні</p>
      )}
    </div>
  );
};

export default AlgebraDataComponent;
