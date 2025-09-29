import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import s from "./Register.module.scss";
import CryptoJS from 'crypto-js';
import { USER_CREATE_URL } from '@src/config/api';

const Register = ({ show, handleClose }: { show: boolean; handleClose: () => void }) => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [phone, setPhone] = useState("");
    const [rezervPhone, setRezervPhone] = useState("");
    const [password, setPassword] = useState("");
    const [repeadPassword, setRepeadPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return (
            userName.trim().length > 0 &&
            email.trim().length > 0 &&
            password.length > 0 &&
            password === repeadPassword
        );
    }

    async function hashPassword() {
        const hashBuffer = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
        return hashBuffer.toUpperCase();
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null); 
        setIsLoading(true); 

        // Registration is anonymous per API
        const hashedPassword = await hashPassword();

        try {
            const response = await fetch(USER_CREATE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    userName: userName,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    patronymic: patronymic,
                    password: hashedPassword,
                    phone: phone,
                    rezervPhone: rezervPhone
                }),
            });

            if (!response.ok) {
                throw new Error('Помилка запиту до API');
            }

            const data = await response.json();
            if (data) {
                const token = data.accessToken || data.accesToken || data.token;
                const userId = (data.user && (data.user.id || data.user.userId)) || data.userId || data.id;
                if (token) {
                    localStorage.setItem('access_token', String(token));
                }
                if (userId !== undefined && userId !== null) {
                    localStorage.setItem('user', String(userId));
                }
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
                    <Form.Group controlId="registerFirstName">
                        <Form.Label>Ім'я</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="registerLastName">
                        <Form.Label>Прізвище</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="registerPatronymic">
                        <Form.Label>По-батькові</Form.Label>
                        <Form.Control
                            type="text"
                            value={patronymic}
                            onChange={(e) => setPatronymic(e.target.value)}
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
                    <Form.Group controlId="registerPhone">
                        <Form.Label>Телефон</Form.Label>
                        <Form.Control
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="registerRezervPhone">
                        <Form.Label>Резервний телефон</Form.Label>
                        <Form.Control
                            type="tel"
                            value={rezervPhone}
                            onChange={(e) => setRezervPhone(e.target.value)}
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
                        {isLoading ? 'Реєстрація...' : 'Реєстрація'}
                    </button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default Register;
