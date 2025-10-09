import { useMemo, useState } from "react";
import s from "./OwnTests.module.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { TESTING_START_URL, TESTING_SUBMIT_URL } from "@src/config/api";

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

export default function TestTakingPage() {
    const [activeTest, setActiveTest] = useState<QuestionDto[] | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sectionId, setSectionId] = useState<number>(1);
    const [sectionName, setSectionName] = useState<string>("Алгебра");
    const [targetScore, setTargetScore] = useState<number>(50);

    async function startTest() {
        setError(null);
        setActiveTest(null);
        setSelectedAnswers({});
        try {
            const token = localStorage.getItem('access_token');
            const resp = await fetch(`${TESTING_START_URL}?sectionId=${encodeURIComponent(sectionId)}&sectionName=${encodeURIComponent(sectionName)}&targetScore=${encodeURIComponent(targetScore)}`, {
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
            const body = {
                TopicId: sectionId,
                SectionName: sectionName,
                Answers: answersDict
            };
            const token = localStorage.getItem('access_token');
            const resp = await fetch(`${TESTING_SUBMIT_URL}`, {
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
            <h3>Тест (питань: {activeTest?.length}) — сумарні бали: {totalSelectedScore}</h3>
            {error && <div className={s.error}>{error}</div>}
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

            {activeTest && (
                <div className={s.testWrapper}>
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