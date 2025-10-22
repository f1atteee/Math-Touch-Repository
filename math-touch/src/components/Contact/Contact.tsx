import { useState, useEffect } from "react";
import { 
    Row, Col, 
    Toast, ToastContainer
} from "react-bootstrap";
import { CONTACT_SEND_URL } from "@src/config/api";
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
    const [cooldownTime, setCooldownTime] = useState(15);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const authToken = localStorage.getItem('access_token'); 

    const addToast = (message: string, variant: string) => {
        const id = Date.now();
    
        setToasts((currentToasts) => {
            const newToasts = [...currentToasts, { id, message, variant }];
    
            if (newToasts.length > 4) {
                newToasts.shift();
            }
    
            return newToasts;
        });
    
        setTimeout(() => {
            setToasts((currentToasts) => 
                currentToasts.filter(toast => toast.id !== id)
            );
        }, 5000);
    };

    useEffect(() => {
        let interval: any;

        if (isCooldown) {
            interval = setInterval(() => {
                setCooldownTime(prevTime => {
                    if (prevTime <= 1) {
                        setIsCooldown(false);
                        setAttempts(0);
                        clearInterval(interval);
                        return 15;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isCooldown]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
   
        if (isCooldown) {
            addToast(`${cooldownTime} сек. щоб відправити нове повідомлення.`, 'warning');
            return;
        }
   
        if (attempts >= 3) {
            setIsCooldown(true);
            setCooldownTime(15);
            setAttempts(attempts + 1);
            return;
        }
   
        const formData = { name, email, message };
   
        try {
            const response = await fetch(CONTACT_SEND_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`, 
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
                                placeholder="Ім'я"
                                className={s.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <p className={s.label}>Поштова скринька</p>
                            <input
                                type="email"
                                placeholder="Тут введіть вашу пошту"
                                className={s.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <p className={s.label}>Повідомлення</p>
                            <textarea
                                rows={5}
                                placeholder="Тут введіть ваше повідомлення"
                                className={s.input}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}/>
                        <button className={s.sumbit_button}>
                            Лети
                        </button>
                    </div>

                    <div className={s.contact_info}>
                        <h3 className={s.info_heading}>Наша інформація</h3>
                        <p className={s.info_text}><strong>Поштова скринька:</strong> nazarkrravets@gmail.com</p>
                        <p className={s.info_text}><strong>Поштова скринька:</strong> oliakravets0@gmail.com</p>
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