import { useState } from "react";
import { Modal, Button, Container, Row, Col, Form, Toast, ToastContainer } from "react-bootstrap";
import s from "./ContactModal.module.scss";

interface Toast {
    id: number;
    message: string;
    variant: string;
}

function ContactModal({ show, handleClose }: { show: boolean; handleClose: () => void }) {
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

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
   
        if (isCooldown) {
            addToast(`Please wait ${cooldownTime} seconds before trying again.`, 'warning');
            return;
        }
   
        if (attempts >= 3) {
            setIsCooldown(true);
            setCooldownTime(15);
            return;
        }
   
        const formData = { name, email, message };
   
        try {
            const response = await fetch('http://localhost:8083/api/Contact/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), 
            });
   
            if (response.ok) {
                addToast('Message sent successfully.', 'success');
                setAttempts(attempts + 1);
                handleClose(); // Закрити модальне вікно після успішного відправлення
            } else {
                addToast('Failed to send message.', 'danger');
            }
        } catch (error) {
            addToast('Error: ' + error, 'danger');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Зворотній зв'язок</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className={s.contact_section}>
                    <Row>
                        <Col md={12} className={s.contact_form}>
                            <Form onSubmit={handleSubmit} >
                                <Form.Group controlId="formName">
                                    <Form.Label className={s.label}>Ім'я</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Тут введіть ваше ім'я"
                                        className={s.input}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail">
                                    <Form.Label className={s.label}>Поштова скринька</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Тут введіть вашу пошту"
                                        className={s.input}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formMessage">
                                    <Form.Label className={s.label}>Текст повідомлення</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        placeholder="Тут введіть ваше повідомлення"
                                        className={s.input}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </Form.Group>
                                <Button type="submit" className={s.sumbit_button}>
                                    Надіслати
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
                <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
                    {toasts.map(toast => (
                        <Toast key={toast.id} bg={toast.variant}>
                            <Toast.Body>{toast.message}</Toast.Body>
                        </Toast>
                    ))}
                </ToastContainer>
            </Modal.Body>
        </Modal>
    );
}

export default ContactModal;