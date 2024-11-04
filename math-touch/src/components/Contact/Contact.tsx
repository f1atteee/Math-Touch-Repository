import { useState, useEffect } from "react";
import { 
    Row, Col, 
    Toast, ToastContainer
} from "react-bootstrap";
import {
    SiLinkedin,
    SiInstagram,
    SiTelegram,
} from "react-icons/si";
import s from "./Contact.module.scss";

interface Toast {
    id: number;
    message: string;
    variant: string;
}

function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [isCooldown, setIsCooldown] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(15); // Час очікування в секундах
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, variant: string) => {
        const id = Date.now();
    
        setToasts((currentToasts) => {
            const newToasts = [...currentToasts, { id, message, variant }];
    
            if (newToasts.length > 4) { // Обмеження до 4 сповіщень
                newToasts.shift(); // Видаляємо найстаріше сповіщення
            }
    
            return newToasts;
        });
    
        setTimeout(() => {
            setToasts((currentToasts) => 
                currentToasts.filter(toast => toast.id !== id)
            );
        }, 5000); // 5 секунд на розчинення
    };

    useEffect(() => {
        let interval: any;

        if (isCooldown) {
            interval = setInterval(() => {
                setCooldownTime(prevTime => {
                    if (prevTime <= 1) {
                        setIsCooldown(false);
                        setAttempts(0); // Скидання спроб після завершення таймера
                        clearInterval(interval);
                        return 15; // Скидання часу очікування
                    }
                    return prevTime - 1;
                });
            }, 1000); // Зменшення кожну секунду
        }

        return () => clearInterval(interval); // Очистка інтервалу при розмонтуванні
    }, [isCooldown]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
   
        if (isCooldown) {
            addToast(`Please wait ${cooldownTime} seconds before trying again.`, 'warning');
            return;
        }
   
        if (attempts >= 3) {
            setIsCooldown(true);
            setCooldownTime(15);
            setAttempts(attempts + 1); // Обов'язкове збільшення спроби перед таймером
            return;
        }
   
        const formData = { name, email, message };
   
        try {
            const response = await fetch('https://localhost:7242/api/Contact/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), 
            });
   
            if (response.ok) {
                addToast('Message sent successfully.', 'success');
                setAttempts(attempts + 1);
            } else {
                addToast('Failed to send message.', 'danger');
            }
        } catch (error) {
            addToast('Error: ' + error, 'danger');
        }
    };   
   
    return(
        <div className={s.contact_section}>
            <Row>
                <h1 className={s.heading}>
                    Розкажи щось <strong className={s.green}>нам</strong>
                </h1>
            </Row>
            <Row>
                <Col md={6} className={s.contact_form}>
                    <div onSubmit={handleSubmit}>
                            <p className={s.label}>Як тебе звати?</p>
                            <input
                                type="text"
                                placeholder="Василь"
                                className={s.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <p className={s.label}>Голубина пошта</p>
                            <input
                                type="email"
                                placeholder="курлик ?"
                                className={s.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <p className={s.label}>Щось цікаве</p>
                            <textarea
                                rows={5}
                                placeholder="Ось тут можна"
                                className={s.input}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}/>
                        <button className={s.sumbit_button}>
                            Лети
                        </button>
                    </div>

                    <div className={s.contact_info}>
                        <h3 className={s.info_heading}>Наша інформація</h3>
                        <p className={s.info_text}><strong>Номер:</strong> +380733666360</p>
                        <p className={s.info_text}><strong>Голубина пошта:</strong> nazarkrravets@gmail.com</p>
                        <div className={s.social_links}>
                            <a href="https://t.me/direector" className={s.social_icon}>
                                <SiTelegram/>
                            </a>
                            <a href="https://www.instagram.com/naz_kravets" className={s.social_icon}>
                                <SiInstagram/>
                            </a>
                            <a href="https://www.linkedin.com/in/nazar-kravets-086812230/" className={s.social_icon}>
                                <SiLinkedin/>
                            </a>
                        </div>
                    </div>
                </Col>
            </Row>
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
                {toasts.map(toast => (
                    <Toast key={toast.id} bg={toast.variant}>
                        <Toast.Body>{toast.message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </div>
    );
}

export default Contact;