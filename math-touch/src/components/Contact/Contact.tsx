import { useState, useEffect } from "react";
import { 
    Row, Col, 
    Toast, ToastContainer
} from "react-bootstrap";
import s from "./Contact.module.scss";

const TELEGRAM_BOT_TOKEN = "7564716229:AAFHsIOe-TNeyvIwpX2eLfLRtl1PhhTFAW8";
const TELEGRAM_CHAT_IDS = ["651193354"];

interface ToastType { 
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
    const [toasts, setToasts] = useState<ToastType[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false); 

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
        let interval: NodeJS.Timeout | undefined;

        if (isCooldown) {
            interval = setInterval(() => {
                setCooldownTime(prevTime => {
                    if (prevTime <= 1) {
                        setIsCooldown(false);
                        setAttempts(0);
                        if (interval) clearInterval(interval);
                        return 15;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isCooldown]);

    const handleSuccess = () => {
        setName(''); 
        setEmail(''); 
        setMessage('');
        setAttempts(0);
        setIsSubmitting(false);
    };

    const handleAttemptFailure = () => {
        setAttempts(prev => {
            const newAttempts = prev + 1;
            if (newAttempts >= 3) {
                setIsCooldown(true);
                setCooldownTime(15);
            }
            return newAttempts;
        });
        setIsSubmitting(false);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    
        if (isCooldown) {
            addToast(`Зачекайте ${cooldownTime} сек. щоб відправити нове повідомлення.`, 'warning');
            return;
        }

        if (isSubmitting) {
            addToast('Надсилання вже виконується. Зачекайте.', 'info');
            return;
        }

        if (attempts >= 3 && !isCooldown) {
            setIsCooldown(true);
            setCooldownTime(15);
            setAttempts(attempts + 1);
            addToast(`Досягнуто ліміту спроб. Зачекайте ${cooldownTime} сек.`, 'warning');
            return;
        }

        setIsSubmitting(true);
    
        let successCount = 0;
        let errorMessages: string[] = [];

        const telegramMessageText = 
            `📢 *Нове повідомлення з форми контакту:*\n\n` +
            `👤 *Ім'я:* ${name}\n` +
            `📧 *Email:* ${email}\n` +
            `💬 *Повідомлення:*\n${message}`;

        const allPromises: Promise<void>[] = [];

        const telegramPromises = TELEGRAM_CHAT_IDS.map(async (chatId) => {
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
                    errorMessages.push(`Telegram (Chat ID ${chatId}): ${data.description || 'Невідома помилка'}`);
                }
            } catch (networkError) {
                errorMessages.push(`Telegram (Chat ID ${chatId}): Мережева помилка.`);
            }
        });

        allPromises.push(...telegramPromises);
        await Promise.all(allPromises);

        if (successCount > 0) {
            addToast("Повідомлення успішно надіслано! 😊", 'success');
            handleSuccess(); 
        } else {
            const combinedError = errorMessages.join('; ');
            addToast(`Помилка надсилання: ${combinedError || 'Жодне повідомлення не надіслано.'}`, 'danger');
            handleAttemptFailure();
        }

        setIsSubmitting(false);
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
                    <form onSubmit={handleSubmit}>
                        <p className={s.label}>Як тебе звати?</p>
                        <input
                            type="text"
                            placeholder="Ім'я"
                            className={s.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isCooldown || isSubmitting}
                        />
                        <p className={s.label}>Поштова скринька</p>
                        <input
                            type="email"
                            placeholder="Тут введіть вашу пошту"
                            className={s.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isCooldown || isSubmitting}
                        />
                        <p className={s.label}>Повідомлення</p>
                        <textarea
                            rows={5}
                            placeholder="Тут введіть ваше повідомлення"
                            className={s.input}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            disabled={isCooldown || isSubmitting}
                        />
                        <button 
                            type="submit"
                            className={s.sumbit_button}
                            disabled={isCooldown || isSubmitting}
                        >
                            {isSubmitting ? 'Надсилання...' : 
                             isCooldown ? `Зачекайте ${cooldownTime} с.` : 'Лети'}
                        </button>
                    </form>

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