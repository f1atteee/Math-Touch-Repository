import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface GeometryDataProps {
    data: {
        info: string;
        definition: string;
    };
}

const GeometryData: React.FC = () => {
    const { id } = useParams(); // Отримуємо параметр id з URL
    const [data, setData] = useState<GeometryDataProps['data'] | null>(null); // Стан для зберігання даних
    const [loading, setLoading] = useState<boolean>(true); // Стан для відображення процесу завантаження
    const [error, setError] = useState<string | null>(null); // Стан для відображення помилки

    // Використовуємо useEffect для виклику API при монтуванні компоненти
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('access_token'); // Отримуємо токен з localStorage

            if (!token) {
                setError('Токен не знайдений');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post(
                    'http://192.168.31.90:8082/api/Algebra/GetAlgebraDataById', // Змінити на ваш API для geometry
                    [id], // Передаємо id як масив
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`, // Додаємо токен до заголовків
                            'Content-Type': 'application/json', // Вказуємо формат контенту
                            'Accept': 'text/plain', // Вказуємо тип відповіді
                        }
                    }
                );
                setData(response.data); // Записуємо отримані дані в стан
            } catch (error) {
                setError('Помилка при завантаженні даних'); // Обробка помилки
            } finally {
                setLoading(false); // Завершення завантаження
            }
        };

        fetchData(); // Викликаємо функцію для отримання даних
    }, [id]); // Залежність від id для повторного виклику при зміні id

    if (loading) {
        return <div>Loading...</div>; // Відображення індикатора завантаження
    }

    if (error) {
        return <div>{error}</div>; // Відображення повідомлення про помилку
    }

    if (!data) {
        return <div>Data not found</div>; // Якщо дані не знайдені
    }

    return (
        <div>
            <h1>Geometry Data</h1>
            <div>
                <h2>Info</h2>
                <p>{data.info}</p>
            </div>
            <div>
                <h2>Definition</h2>
                <p>{data.definition}</p>
            </div>
        </div>
    );
};

export default GeometryData;
