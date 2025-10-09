import { useEffect, useState } from "react";
import s from "./OwnTests.module.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { QUESTIONS_BASE_URL } from "@src/config/api";

interface AnswerOptionDto {
    id?: number;
    text: string;
    isCorrect: boolean;
}

interface QuestionDto {
    id?: number;
    text: string;
    score: number;
    imageUri?: string | null;
    questionTypeId: number;
    idSection: number;
    sectionName: string;
    answerOptions: AnswerOptionDto[];
}

export default function QuestionEditorPage() {
    const [questions, setQuestions] = useState<QuestionDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [editing, setEditing] = useState<QuestionDto | null>(null);

    async function loadQuestions() {
        setLoading(true);
        setError(null);
        try {
            const resp = await fetch(`${QUESTIONS_BASE_URL}`, {
                headers: { 'accept': 'application/json' }
            });
            if (!resp.ok) throw new Error('Failed to load questions');
            const data = await resp.json();
            setQuestions(data);
        } catch (e: any) {
            setError(e?.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadQuestions(); }, []);

    function newBlankQuestion(): QuestionDto {
        return {
            text: "",
            score: 1,
            imageUri: null,
            questionTypeId: 1,
            idSection: 1,
            sectionName: "Алгебра",
            answerOptions: [
                { text: "", isCorrect: true },
                { text: "", isCorrect: false }
            ]
        };
    }

    function openCreate() {
        setEditing(newBlankQuestion());
        setShowEditor(true);
    }

    function openEdit(q: QuestionDto) {
        setEditing(JSON.parse(JSON.stringify(q)));
        setShowEditor(true);
    }

    function closeEditor() {
        setShowEditor(false);
        setEditing(null);
    }

    async function saveQuestion() {
        if (!editing) return;
        setLoading(true);
        try {
            const isNew = !editing.id;
            const url = isNew ? `${QUESTIONS_BASE_URL}` : `${QUESTIONS_BASE_URL}/${editing.id}`;
            const method = isNew ? 'POST' : 'PUT';
            const resp = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    text: editing.text,
                    score: editing.score,
                    imageUri: editing.imageUri,
                    questionTypeId: editing.questionTypeId,
                    idSection: editing.idSection,
                    sectionName: editing.sectionName,
                    answerOptions: editing.answerOptions
                })
            });
            if (!resp.ok) throw new Error('Failed to save question');
            await loadQuestions();
            closeEditor();
        } catch (e: any) {
            setError(e?.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    async function deleteQuestion(id: number) {
        if (!confirm('Видалити питання?')) return;
        setLoading(true);
        try {
            const resp = await fetch(`${QUESTIONS_BASE_URL}/${id}`, { method: 'DELETE' });
            if (!resp.ok) throw new Error('Failed to delete');
            await loadQuestions();
        } catch (e: any) {
            setError(e?.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={s.wrapper}>
            <h2>Редагування Питань</h2>
            {error && <div className={s.error}>{error}</div>}

            <div className={s.controls}>
                <Button variant="success" onClick={openCreate}>Створити питання</Button>
            </div>

            <Table striped bordered hover size="sm" className={s.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Текст</th>
                        <th>Бали</th>
                        <th>Секція</th>
                        <th>Тип</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map(q => (
                        <tr key={q.id}>
                            <td>{q.id}</td>
                            <td>{q.text}</td>
                            <td>{q.score}</td>
                            <td>{q.sectionName} ({q.idSection})</td>
                            <td>{q.questionTypeId}</td>
                            <td>
                                <Button size="sm" onClick={() => openEdit(q)}>Редагувати</Button>{' '}
                                <Button size="sm" variant="danger" onClick={() => deleteQuestion(q.id!)}>Видалити</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showEditor} onHide={closeEditor} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editing?.id ? 'Редагувати питання' : 'Нове питання'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editing && (
                        <Form>
                            <Form.Group className={s.field}>
                                <Form.Label>Текст</Form.Label>
                                <Form.Control as="textarea" rows={3} value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} />
                            </Form.Group>
                            <Form.Group className={s.field}>
                                <Form.Label>Бали</Form.Label>
                                <Form.Control type="number" value={editing.score} onChange={(e) => setEditing({ ...editing, score: Number(e.target.value) })} />
                            </Form.Group>
                            <Form.Group className={s.field}>
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control type="text" value={editing.imageUri || ''} onChange={(e) => setEditing({ ...editing, imageUri: e.target.value })} />
                            </Form.Group>
                            <Form.Group className={s.field}>
                                <Form.Label>Тип питання (id)</Form.Label>
                                <Form.Control type="number" value={editing.questionTypeId} onChange={(e) => setEditing({ ...editing, questionTypeId: Number(e.target.value) })} />
                            </Form.Group>
                            <Form.Group className={s.field}>
                                <Form.Label>Section Id</Form.Label>
                                <Form.Control type="number" value={editing.idSection} onChange={(e) => setEditing({ ...editing, idSection: Number(e.target.value) })} />
                            </Form.Group>
                            <Form.Group className={s.field}>
                                <Form.Label>Section Name</Form.Label>
                                <Form.Control type="text" value={editing.sectionName} onChange={(e) => setEditing({ ...editing, sectionName: e.target.value })} />
                            </Form.Group>

                            <div className={s.answerHeader}>Варіанти відповідей</div>
                            {editing.answerOptions.map((opt, idx) => (
                                <div key={idx} className={s.answerRow}>
                                    <Form.Check type="checkbox" checked={opt.isCorrect} onChange={(e) => {
                                        const list = [...editing.answerOptions];
                                        list[idx] = { ...list[idx], isCorrect: e.target.checked };
                                        setEditing({ ...editing, answerOptions: list });
                                    }} />
                                    <Form.Control type="text" value={opt.text} onChange={(e) => {
                                        const list = [...editing.answerOptions];
                                        list[idx] = { ...list[idx], text: e.target.value };
                                        setEditing({ ...editing, answerOptions: list });
                                    }} />
                                    <Button variant="outline-danger" size="sm" onClick={() => {
                                        const list = editing.answerOptions.filter((_, i) => i !== idx);
                                        setEditing({ ...editing, answerOptions: list });
                                    }}>×</Button>
                                </div>
                            ))}
                            <Button size="sm" onClick={() => setEditing({ ...editing, answerOptions: [...editing.answerOptions, { text: "", isCorrect: false }] })}>Додати варіант</Button>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditor}>Закрити</Button>
                    <Button variant="primary" onClick={saveQuestion} disabled={loading}>{loading ? 'Збереження...' : 'Зберегти'}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}