import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import s from "./Register.module.scss";
import CryptoJS from 'crypto-js';

const Register = ({ show, handleClose }: { show: boolean; handleClose: () => void }) => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeadPassword, setRepeadPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return email.length > 0 && password.length > 0 && password === repeadPassword;
    }

    async function hashPassword() {
        const hashBuffer = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
        return hashBuffer.toUpperCase();
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null); 
        setIsLoading(true); 

        const token = localStorage.getItem('access_token');
        const hashedPassword = await hashPassword();

        try {
            const response = await fetch('http://localhost:8081/api/User/Create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}` // Додаємо токен у заголовок
                },
                body: JSON.stringify({
                    userName: userName,
                    email: email,
                    password: hashedPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Помилка запиту до API');
            }

            const data = await response.json();
            if (data) {
                localStorage.setItem('access_token', `${data.accesToken}`);
                localStorage.setItem('user', `${data.user}`);
                console.log('Реєстрація успішна, токен збережено у localStorage');
                handleClose();
            } else {
                console.error('Реєстрація не вдалася, токен не отримано');
            }
        } catch (error) {
            console.error('Помилка:', error);
            setError('Помилка реєстрації. Будь ласка, спробуйте пізніше.');
        } finally {
            setIsLoading(false); 
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Реєстрація</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p className={s.errorMessage}>{error}</p>}
                <Form onSubmit={handleSubmit}>
                <Form.Group controlId="registerUserName">
                        <Form.Label>Логін</Form.Label>
                        <Form.Control
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="registerEmail">
                        <Form.Label>Поштова скринька</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="registerPassword">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="registerRepeatPassword">
                        <Form.Label>Знову пароль</Form.Label>
                        <Form.Control
                            type="password"
                            value={repeadPassword}
                            onChange={(e) => setRepeadPassword(e.target.value)}
                        />
                    </Form.Group>
                    <button disabled={!validateForm() || isLoading} className={s.buttonLogin}>
                        {isLoading ? 'Реєстрація...' : 'Register'}
                    </button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default Register;
