import React from 'react';
import { Routes, Route, Link} from "react-router-dom";
import QuestionEditorPage from './QuestionEditorPage'; 
import TestTakingPage from './TestTakingPage';
import s from "./OwnTests.module.scss";

export const OwnTests: React.FC = () => {
    return (
        <div className={s.wrapper}>
            <header className={s.header}>
                <h2>Конструктор тестів</h2>
            </header>
            
            <nav className={s.nav}>
                <Link to="test" className={s.navLink}>
                    Пройти тест
                </Link>
                <Link to="create" className={s.navLink}>
                    Створити питання
                </Link>
            </nav>

            <div className={s.content}>
                <Routes>
                    <Route index element={<QuestionEditorPage />} /> 
                    <Route path="create" element={<QuestionEditorPage />} />
                    <Route path="test" element={<TestTakingPage />} />
                </Routes>
            </div>
        </div>
    );
};