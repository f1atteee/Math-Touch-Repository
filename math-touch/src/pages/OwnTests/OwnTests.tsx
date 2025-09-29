import { useEffect, useMemo, useState } from "react";
import s from "./OwnTests.module.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";

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

interface TestSubmissionDto {
    TopicId: number;
    SectionName: string;
    Answers: Record<number, string>; // key: questionId, value: JSON string of ids
}

const API_BASE = "https://localhost:7010";

export default function OwnTests() {
    const [questions, setQuestions] = useState<QuestionDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showEditor, setShowEditor] = useState(false);
    const [editing, setEditing] = useState<QuestionDto | null>(null);

    const [sectionId, setSectionId] = useState<number>(1);
    const [sectionName, setSectionName] = useState<string>("Алгебра");
    const [targetScore, setTargetScore] = useState<number>(50);

    const [activeTest, setActiveTest] = useState<QuestionDto[] | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({});
    const [submitting, setSubmitting] = useState(false);

    // read token at call time to ensure freshness

    async function loadQuestions() {
        setLoading(true);
        setError(null);
        try {
            const resp = await fetch(`${API_BASE}/api/questions`, {
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
            const url = isNew ? `${API_BASE}/api/questions` : `${API_BASE}/api/questions/${editing.id}`;
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
            const resp = await fetch(`${API_BASE}/api/questions/${id}`, { method: 'DELETE' });
            if (!resp.ok) throw new Error('Failed to delete');
            await loadQuestions();
        } catch (e: any) {
            setError(e?.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    async function startTest() {
        setError(null);
        setActiveTest(null);
        setSelectedAnswers({});
        try {
            const token = localStorage.getItem('access_token');
            const resp = await fetch(`${API_BASE}/api/testing/start?sectionId=${encodeURIComponent(sectionId)}&sectionName=${encodeURIComponent(sectionName)}&targetScore=${encodeURIComponent(targetScore)}`, {
                headers: {
                    'accept': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });
            if (resp.status === 401) throw new Error('Потрібна авторизація');
            if (!resp.ok) throw new Error('Не вдалося згенерувати тест');
            const data = await resp.json();
            setActiveTest(data);
        } catch (e: any) {
            setError(e?.message || 'Unknown error');
        }
    }

    function toggleAnswer(questionId: number, answerId: number) {
        setSelectedAnswers(prev => {
            const existing = prev[questionId] || [];
            const set = new Set(existing);
            if (set.has(answerId)) set.delete(answerId); else set.add(answerId);
            return { ...prev, [questionId]: Array.from(set) };
        });
    }

    const totalSelectedScore = useMemo(() => {
        if (!activeTest) return 0;
        return activeTest.reduce((acc, q) => acc + q.score, 0);
    }, [activeTest]);

    async function submitTest() {
        if (!activeTest) return;
        setSubmitting(true);
        setError(null);
        try {
            const answersDict: Record<number, string> = {};
            for (const q of activeTest) {
                const qid = Number(q.id);
                const ids = (selectedAnswers[qid] || []);
                answersDict[qid] = JSON.stringify(ids);
            }
            const body: TestSubmissionDto = {
                TopicId: sectionId,
                SectionName: sectionName,
                Answers: answersDict
            };
            const token = localStorage.getItem('access_token');
            const resp = await fetch(`${API_BASE}/api/testing/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            if (resp.status === 401) throw new Error('Потрібна авторизація');
            if (!resp.ok) throw new Error('Не вдалося надіслати тест');
            const result = await resp.json();
            alert(`Тест надіслано. Ваш бал: ${result.totalScore}`);
            setActiveTest(null);
            setSelectedAnswers({});
        } catch (e: any) {
            setError(e?.message || 'Unknown error');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={s.wrapper}>
            <h2>Власні тести</h2>
            {error && <div className={s.error}>{error}</div>}

            <div className={s.controls}>
                <Button variant="success" onClick={openCreate}>Створити питання</Button>
                <div className={s.spacer} />
                <Form className={s.inlineForm}>
                    <Form.Group>
                        <Form.Label>Section Id</Form.Label>
                        <Form.Control type="number" value={sectionId} onChange={(e) => setSectionId(Number(e.target.value))} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Section Name</Form.Label>
                        <Form.Control type="text" value={sectionName} onChange={(e) => setSectionName(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Target Score</Form.Label>
                        <Form.Control type="number" value={targetScore} onChange={(e) => setTargetScore(Number(e.target.value))} />
                    </Form.Group>
                    <Button onClick={startTest}>Почати тест</Button>
                </Form>
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

            {activeTest && (
                <div className={s.testWrapper}>
                    <h3>Тест (питань: {activeTest.length}) — сумарні бали: {totalSelectedScore}</h3>
                    {activeTest.map(q => (
                        <div key={q.id} className={s.questionCard}>
                            <div className={s.qHeader}>
                                <div className={s.qScore}>+{q.score}</div>
                                <div className={s.qText}>{q.text}</div>
                            </div>
                            {q.imageUri && <img className={s.qImage} src={q.imageUri} alt="Question" />}
                            <div className={s.answers}>
                                {q.answerOptions.map(a => (
                                    <label key={a.id} className={s.answerItem}>
                                        <input
                                            type={q.questionTypeId === 1 ? 'radio' : 'checkbox'}
                                            name={`q_${q.id}`}
                                            value={a.id}
                                            checked={(selectedAnswers[q.id as number] || []).includes(a.id as number)}
                                            onChange={() => toggleAnswer(q.id as number, a.id as number)}
                                        />
                                        <span>{a.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className={s.testActions}>
                        <Button onClick={submitTest} disabled={submitting}>{submitting ? 'Надсилання...' : 'Завершити тест'}</Button>
                    </div>
                </div>
            )}
        </div>
    );
}


