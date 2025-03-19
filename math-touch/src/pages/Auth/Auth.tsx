import { useState } from "react";
import Form from "react-bootstrap/Form";
import Register from "../../components/Register/Register"; // Імплементуйте шлях до вашого компонента реєстрації
import s from "./Auth.module.scss";
import Logo from "@src/components/Logo/Logo";
import { useAuth } from '../../context/AuthContext';
import CryptoJS from 'crypto-js';

const Auth = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showRegister, setShowRegister] = useState(false);
    const { setIsAuthorized } = useAuth(); // Use the context here

    function validateForm() {
        return login.length > 0 && password.length > 0;
    }

    async function hashPassword() {
        const hashBuffer = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
        return hashBuffer.toUpperCase();
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        var hashPass = await hashPassword();
        try {
            const response = await fetch('http://localhost:8081/api/User/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'text/plain',
                },
                body: JSON.stringify({
                    Login: login,
                    Password: hashPass,
                }),
            });

            if (!response.ok) {
                throw new Error('Error in API request');
            }

            const data = await response.json();
            if (data) {
                localStorage.setItem('access_token', `${data.accesToken}`);
                localStorage.setItem('user', `${data.user.id}`);
                setIsAuthorized(true);
                console.log('Logged in successfully, token saved to localStorage');
            } else {
                console.error('Login failed, no token received');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={s.loginWrapper}>
            <div className={s.Login}>
                <div className={s.logoContainer}>
                    <Logo/>
                </div>
                <h1 className={s.formTitle}>Раді вітати Вас знову</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="login">
                        <Form.Label>Логін/пошта</Form.Label>
                        <Form.Control
                            autoFocus
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <div className={s.registerLink}>
                        <button 
                            type="submit" 
                            className={s.buttonLogin} 
                            disabled={!validateForm()}>
                            Увійти
                        </button>
                    </div>
                </Form>
                <div className={s.registerLink}>
                    <button className={s.buttonLogin} onClick={() => setShowRegister(true)}>
                        Ти тут новенький ? Створи профіль
                    </button>
                </div>
                <Register show={showRegister} handleClose={() => setShowRegister(false)} />
            </div>
        </div>
    );
};

export default Auth;