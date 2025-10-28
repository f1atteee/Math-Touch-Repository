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

interface QuestionTypeDto {
    id: number;
    name: string;
}

interface QuestionDto {
    id?: number;
    text: string;
    score: number;
    imageUri?: string | null;
    questionTypeId: number;
    questionTypeName: string;
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
    const [questionTypes, setQuestionTypes] = useState<QuestionTypeDto[]>([]);
    const [shouldInitializeNew, setShouldInitializeNew] = useState(false);

    async function loadQuestions() {
        setLoading(true);
        setError(null);
        try {
            const resp = await fetch(`${QUESTIONS_BASE_URL}`, {
                headers: { 'accept': 'application/json' }
            });
            if (!resp.ok) throw new Error('Не вдалося завантажити питання');
            const data = await resp.json();
            setQuestions(data);
        } catch (e: any) {
            setError(e?.message || 'Невідома помилка завантаження питань');
        } finally {
            setLoading(false);
        }
    }

    async function loadQuestionTypes() {
        try {
            const resp = await fetch(`${QUESTIONS_BASE_URL}/types`, { 
                headers: { 'accept': 'application/json' }
            });
            if (!resp.ok) throw new Error('Не вдалося завантажити типи питань');
            const data: QuestionTypeDto[] = await resp.json();
            setQuestionTypes(data);
        } catch (e: any) {
            console.error('Помилка завантаження типів питань:', e);
            setError('Помилка завантаження типів питань.');
        }
    }

    useEffect(() => { 
        loadQuestions(); 
        loadQuestionTypes();
    }, []);

    useEffect(() => {
        if (shouldInitializeNew && questionTypes.length > 0) {
            setEditing(newBlankQuestion(questionTypes));
            setShowEditor(true);
            setShouldInitializeNew(false);
        }
    }, [shouldInitializeNew, questionTypes]);


    function newBlankQuestion(types: QuestionTypeDto[]): QuestionDto {
        const defaultType = types.length > 0 ? types[0] : { id: 1, name: "Одиночний вибір" };
        return {
            text: "",
            score: 1,
            imageUri: null,
            questionTypeId: defaultType.id,
            questionTypeName: defaultType.name,
            idSection: 1,
            sectionName: "Алгебра",
            answerOptions: [
                { text: "", isCorrect: true },
                { text: "", isCorrect: false }
            ]
        };
    }

    function openCreate() {
        setError(null);
        if (questionTypes.length === 0) {
            setShouldInitializeNew(true); 
            return;
        }
        setEditing(newBlankQuestion(questionTypes));
        setShowEditor(true);
    }

    function openEdit(q: QuestionDto) {
        setError(null);
        const editingQuestion: QuestionDto = JSON.parse(JSON.stringify(q)); 
        const type = questionTypes.find(t => t.id === editingQuestion.questionTypeId);
        editingQuestion.questionTypeName = type ? type.name : 'Невідомий тип'; 

        setEditing(editingQuestion);
        setShowEditor(true);
    }

    function closeEditor() {
        setShowEditor(false);
        setEditing(null);
        setError(null);
        setShouldInitializeNew(false);
    }

    async function saveQuestion() {
        if (!editing) return;
        
        // --- ВАЛІДАЦІЯ ---
        if (!editing.text.trim()) {
            setError("Текст питання не може бути порожнім.");
            return;
        }
        if (editing.score <= 0) {
            setError("Бали мають бути більше нуля.");
            return;
        }
        if (editing.answerOptions.length < 2) {
            setError("Питання повинно мати принаймні два варіанти відповіді.");
            return;
        }
        const correctOptions = editing.answerOptions.filter(o => o.isCorrect).length;
        if (correctOptions === 0) {
            setError("Питання повинно мати хоча б одну правильну відповідь.");
            return;
        }
        
        // Перевірка, щоб questionTypeId був числом. Завдяки новій логіці це майже гарантовано.
        if (!editing.questionTypeId) {
            setError("Не визначено тип питання.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const isNew = !editing.id;
            const url = isNew ? `${QUESTIONS_BASE_URL}` : `${QUESTIONS_BASE_URL}/${editing.id}`;
            const method = isNew ? 'POST' : 'PUT';

            // Формуємо payload, який відповідає QuestionCreateUpdateDto
            const payload = {
                text: editing.text,
                score: editing.score,
                imageUri: editing.imageUri,
                questionTypeId: editing.questionTypeId, // Тепер завжди коректне число
                idSection: editing.idSection,
                sectionName: editing.sectionName,
                answerOptions: editing.answerOptions // Містить id для існуючих або не містить для нових
            };
            
            console.log('Saving question with payload:', payload);

            const resp = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (resp.status === 400) {
                const body = await resp.json();
                throw new Error(body.title || 'Помилка валідації на сервері');
            }
            if (!resp.ok) throw new Error('Не вдалося зберегти питання');
            
            await loadQuestions(); 
            closeEditor();
        } catch (e: any) {
            setError(e?.message || 'Невідома помилка збереження');
        } finally {
            setLoading(false);
        }
    }

    async function deleteQuestion(id: number) {
        if (!confirm('Видалити питання? Ця дія незворотна!')) return;
        setLoading(true);
        setError(null);
        try {
            const resp = await fetch(`${QUESTIONS_BASE_URL}/${id}`, { method: 'DELETE' });
            if (!resp.ok) throw new Error('Не вдалося видалити питання');
            await loadQuestions();
        } catch (e: any) {
            setError(e?.message || 'Невідома помилка видалення');
        } finally {
            setLoading(false);
        }
    }

    // --- РЕНДЕРИНГ ---

    return (
        <div className={s.wrapper}>
            <h2>Редагування Питань</h2>
            {error && <div className={s.error}>⚠️ Помилка: {error}</div>}

            <div className={s.controls}>
                <Button variant="success" onClick={openCreate} disabled={loading || questionTypes.length === 0}>
                    {questionTypes.length === 0 ? 'Завантаження типів...' : 'Створити питання'}
                </Button>
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
                    {loading ? (
                        <tr><td colSpan={6}>Завантаження...</td></tr>
                    ) : (
                        questions.map(q => (
                            <tr key={q.id}>
                                <td>{q.id}</td>
                                <td>{q.text}</td>
                                <td>{q.score}</td>
                                <td>{q.sectionName} ({q.idSection})</td>
                                <td>
                                    {questionTypes.find(t => t.id === q.questionTypeId)?.name || q.questionTypeId}
                                </td>
                                <td>
                                    <Button size="sm" onClick={() => openEdit(q)}>Редагувати</Button>{' '}
                                    <Button size="sm" variant="danger" onClick={() => deleteQuestion(q.id!)}>Видалити</Button>
                                </td>
                            </tr>
                        ))
                    )}
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
                            
                            {/* ПОЛЕ: Вибір типу питання */}
                            <Form.Group className={s.field}>
                                <Form.Label>Тип питання</Form.Label>
                                <Form.Select 
                                    value={editing.questionTypeId} 
                                    onChange={(e) => {
                                        const newTypeId = Number(e.target.value);
                                        const type = questionTypes.find(t => t.id === newTypeId);
                                        setEditing({ 
                                            ...editing, 
                                            questionTypeId: newTypeId, 
                                            questionTypeName: type ? type.name : editing.questionTypeName 
                                        });
                                    }}>
                                    {questionTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </Form.Select>
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
                                    <Form.Check 
                                        type="checkbox" 
                                        checked={opt.isCorrect} 
                                        onChange={(e) => {
                                            const list = [...editing.answerOptions];
                                            list[idx] = { ...list[idx], isCorrect: e.target.checked };
                                            setEditing({ ...editing, answerOptions: list });
                                        }} 
                                    />
                                    <Form.Control 
                                        type="text" 
                                        value={opt.text} 
                                        onChange={(e) => {
                                            const list = [...editing.answerOptions];
                                            list[idx] = { ...list[idx], text: e.target.value };
                                            setEditing({ ...editing, answerOptions: list });
                                        }} 
                                    />
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm" 
                                        onClick={() => {
                                            const list = editing.answerOptions.filter((_, i) => i !== idx);
                                            setEditing({ ...editing, answerOptions: list });
                                        }}>×</Button>
                                </div>
                            ))}
                            <Button 
                                size="sm" 
                                onClick={() => setEditing({ ...editing, answerOptions: [...editing.answerOptions, { text: "", isCorrect: false }] })}>
                                Додати варіант
                            </Button>
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