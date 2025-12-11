import { useState, useEffect, useCallback } from "react";
import { Modal, Button, Container, Form, Toast, ToastContainer, Spinner } from "react-bootstrap";
import s from "./ContactModal.module.scss";

const TELEGRAM_BOT_TOKEN = "7564716229:AAFHsIOe-TNeyvIwpX2eLfLRtl1PhhTFAW8";
const TELEGRAM_CHAT_IDS = ["651193354", "555605999", "5153074745"];

interface ToastType {
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
    const [cooldownTime, setCooldownTime] = useState(15);
    const [toasts, setToasts] = useState<ToastType[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addToast = useCallback((message: string, variant: string) => {
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
    }, []);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isCooldown && cooldownTime > 0) {
            timer = setTimeout(() => {
                setCooldownTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (cooldownTime === 0) {
            setIsCooldown(false);
            setAttempts(0);
        }

        return () => { if (timer) clearTimeout(timer); };
    }, [isCooldown, cooldownTime]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedMessage = message.trim();

        if (!trimmedName || !trimmedEmail || !trimmedMessage) {
            addToast("Заповни усі поля.", 'warning');
            return;
        }
    
        if (isCooldown) {
            addToast(`Будь ласка зачекайте ${cooldownTime} сек. перед тим як надіслати знову.`, 'warning');
            return;
        }

        if (attempts >= 3) {
            setIsCooldown(true);
            setCooldownTime(15);
            addToast("Забагато спроб, спробуй пізніше", 'danger');
            return;
        }
        
        setIsSubmitting(true);
        
        const telegramMessageText = `📧 *Нове повідомлення зворотного зв'язку*\n\n` + 
                                    `👤 *Ім'я:* ${trimmedName}\n` + 
                                    `✉️ *Email:* ${trimmedEmail}\n\n` + 
                                    `📝 *Повідомлення:*\n${trimmedMessage}`;
        
        let successCount = 0;
        let errorMessages: string[] = [];

        try {
            const sendPromises = TELEGRAM_CHAT_IDS.map(async (chatId) => {
                const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
                const payload = {
                    chat_id: chatId,
                    text: telegramMessageText,
                    parse_mode: 'Markdown',
                };

                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
            
                    const data = await response.json();
            
                    if (response.ok && data.ok) {
                        successCount++;
                    } else {
                        errorMessages.push(`Chat ID ${chatId}: ${data.description || 'Невідома помилка'}`);
                    }
                } catch (networkError) {
                    errorMessages.push(`Chat ID ${chatId}: Мережева помилка.`);
                }
            });

            await Promise.all(sendPromises);

            if (successCount > 0) {
                addToast("Повідомлення успішно надіслано 😊", 'success');
                setName(''); setEmail(''); setMessage('');
                setAttempts(0);
                handleClose();
            } else {
                setAttempts(prev => prev + 1);
                const combinedError = errorMessages.join('; ');
                addToast(`Помилка надсилання: ${combinedError || 'Жодне повідомлення не надіслано.'}`, 'danger');
            }
        } catch (error) {
            setAttempts(prev => prev + 1);
            addToast(`Error: Непередбачена помилка при відправці.`, 'danger');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSubmitDisabled = isCooldown || isSubmitting || !name.trim() || !email.trim() || !message.trim();

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton className="p-3"> 
                    <Modal.Title>
                        <span style={{ color: '#45624E', marginRight: '10px' }}>✉️</span> Зворотній зв'язок
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <Container fluid className={s.contact_section}>
                        <div className={s.contact_form}>
                            <Form onSubmit={handleSubmit} >
                                <Form.Group controlId="formName" className="mb-3">
                                    <Form.Label className={s.label}>Ім'я</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ваше ім'я"
                                        className={s.input}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail" className="mb-3">
                                    <Form.Label className={s.label}>Поштова скринька</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="your.email@example.com"
                                        className={s.input}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Ми ніколи не поділимося вашою електронною поштою.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group controlId="formMessage" className="mb-4">
                                    <Form.Label className={s.label}>Текст повідомлення</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Ваше повідомлення..."
                                        className={s.input}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button 
                                    type="submit" 
                                    className={s.sumbit_button}
                                    disabled={isSubmitDisabled}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                            Надсилаємо...
                                        </>
                                    ) : isCooldown ? (
                                        `Спробуйте через ${cooldownTime} сек. (Спроб: ${attempts}/3)`
                                    ) : (
                                        'Надіслати'
                                    )}
                                </Button>
                                {(attempts > 0 && attempts < 3) && (
                                    <p className="text-center mt-2 text-danger">
                                        Помилка. Залишилося спроб: {3 - attempts}.
                                    </p>
                                )}
                            </Form>
                        </div>
                    </Container>
                </Modal.Body>
            </Modal>
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
                {toasts.map(toast => (
                    <Toast key={toast.id} bg={toast.variant} onClose={() => setToasts(current => current.filter(t => t.id !== toast.id))} delay={5000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">{toast.variant.charAt(0).toUpperCase() + toast.variant.slice(1)}</strong>
                        </Toast.Header>
                        <Toast.Body className={toast.variant === 'success' || toast.variant === 'danger' ? 'text-white' : ''}>{toast.message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </>
    );
}

export default ContactModal;