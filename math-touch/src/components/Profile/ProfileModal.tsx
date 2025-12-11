import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAuth, UserDto } from "@src/context/AuthContext";
import s from "./ProfileModal.module.scss";

interface Props {
    show: boolean;
    handleClose: () => void;
}

const ProfileModal = ({ show, handleClose }: Props) => {
    const { user, updateUser, refreshUser } = useAuth();
    const [form, setForm] = useState<UserDto | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (show) {
            if (!user) {
                refreshUser();
            } else {
                setForm(user);
            }
        }
    }, [show, user, refreshUser]);

    function setField<K extends keyof UserDto>(key: K, value: UserDto[K]) {
        if (!form) return;
        setForm({ ...form, [key]: value });
    }

    const onSave = async () => {
        if (!form) return;
        setSaving(true);
        const updated = await updateUser(form);
        setSaving(false);
        if (updated) {
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Профіль користувача</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!form ? (
                    <div>Завантаження...</div>
                ) : (
                    <Form>
                        <Form.Group className={s.group} controlId="pm_userName">
                            <Form.Label>Логін</Form.Label>
                            <Form.Control type="text" value={form.userName} onChange={(e) => setField('userName', e.target.value)} />
                        </Form.Group>
                        <Form.Group className={s.group} controlId="pm_email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} />
                        </Form.Group>
                        <Form.Group className={s.group} controlId="pm_firstName">
                            <Form.Label>Ім'я</Form.Label>
                            <Form.Control type="text" value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} />
                        </Form.Group>
                        <Form.Group className={s.group} controlId="pm_lastName">
                            <Form.Label>Прізвище</Form.Label>
                            <Form.Control type="text" value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} />
                        </Form.Group>
                        <Form.Group className={s.group} controlId="pm_patronymic">
                            <Form.Label>По-батькові</Form.Label>
                            <Form.Control type="text" value={form.patronymic} onChange={(e) => setField('patronymic', e.target.value)} />
                        </Form.Group>
                        <Form.Group className={s.group} controlId="pm_phone">
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
                        </Form.Group>
                        <Form.Group className={s.group} controlId="pm_rphone">
                            <Form.Label>Резервний телефон</Form.Label>
                            <Form.Control type="tel" value={form.rezervPhone} onChange={(e) => setField('rezervPhone', e.target.value)} />
                        </Form.Group>
                        <Form.Group className={s.group} controlId="pm_teacher">
                            <Form.Check type="checkbox" label="Я вчитель" checked={form.isTeacher} onChange={(e) => setField('isTeacher', e.target.checked)} />
                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Закрити</Button>
                <Button variant="primary" onClick={onSave} disabled={saving}>{saving ? 'Збереження...' : 'Зберегти'}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProfileModal;