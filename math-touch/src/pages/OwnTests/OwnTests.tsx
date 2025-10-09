import React from 'react';
import { Routes, Route, Link} from "react-router-dom";
// Припустімо, що ці компоненти існують:
import QuestionEditorPage from './QuestionEditorPage'; 
import TestTakingPage from './TestTakingPage';
import s from "./OwnTests.module.scss"; // Припустімо, що у вас є свій стиль

// ВИПРАВЛЕНО: Експортуємо як іменований експорт (export const), щоб відповідати useRoutes.tsx
export const OwnTests: React.FC = () => {
    return (
        <div className={s.wrapper}>
            <header className={s.header}>
                <h2>Мій Конструктор Тестів</h2>
            </header>
            
            <nav className={s.nav}>
                {/* Посилання ведуть на відносні шляхи "create" та "test" */}
                <Link to="create" className={s.navLink}>
                    Створити питання
                </Link>
                <Link to="test" className={s.navLink}>
                    Пройти тест
                </Link>
            </nav>

            <div className={s.content}>
                {/* Вкладені маршрути для /owntest/* */}
                <Routes>
                    {/* Маршрут, коли URL закінчується на /owntest (тобто OwnTests є індексом) */}
                    <Route index element={<QuestionEditorPage />} /> 

                    {/* Маршрут для /owntest/create */}
                    <Route path="create" element={<QuestionEditorPage />} />
                    
                    {/* Маршрут для /owntest/test */}
                    <Route path="test" element={<TestTakingPage />} />
                    
                    {/* Якщо ви хочете відображати дочірні компоненти, використовуйте Outlet
                        <Route path="section" element={<Outlet />}>
                            ...
                        </Route>
                    */}
                </Routes>
            </div>
        </div>
    );
};