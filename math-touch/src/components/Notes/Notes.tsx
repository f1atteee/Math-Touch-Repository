import { useState, useEffect, useCallback } from 'react';
import s from './Notes.module.scss';
import NoteItem, { NoteDto } from './NoteItem'; 
import { USER_NOTES_URL } from '../../config/api'; 

const Notes = () => {
    // Змінено на 'access_token', як у вашому прикладі
    const authToken = localStorage.getItem('access_token'); 

    const [notes, setNotes] = useState<NoteDto[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Новий стан для форми створення нотатки
    const [newNoteContent, setNewNoteContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    // --- Функція для отримання нотаток (зроблена useCallback для чистоти) ---
    const fetchNotes = useCallback(async () => {
        if (!authToken) {
            setError('Authorization required. Please log in.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(USER_NOTES_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`, 
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('Session expired or unauthorized. Redirecting to login...');
                }
                const errorData = await response.text();
                throw new Error(`Failed to fetch notes: ${response.status} - ${errorData}`);
            }

            const data = await response.json() as NoteDto[]; 
            setNotes(data);

        } catch (error) {
            console.error('Error fetching notes:', error);
            setError('Failed to load notes. Please check the network connection.');
        } finally {
            setLoading(false);
        }
    }, [authToken]); 

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]); 

    // --- Функція для збереження нової нотатки ---
    const handleSaveNote = async () => {
        if (!newNoteContent.trim()) {
            setSaveError('Нотатка не може бути порожньою.');
            return;
        }

        if (!authToken) {
            setSaveError('Користувач не авторизований.');
            return;
        }

        setIsSaving(true);
        setSaveError('');

        try {
            const contentToSend = newNoteContent.trim(); // Отримуємо чистий рядок

            const response = await fetch(USER_NOTES_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                // !!! КЛЮЧОВА ЗМІНА: Надсилаємо сам рядок, обгорнутий у JSON
                body: JSON.stringify(contentToSend), 
            });

            if (!response.ok) {
                // Додамо кращу обробку помилки для користувача
                let errorMessage = `Failed to save note: ${response.status}`;
                try {
                    const errorJson = await response.json();
                    if (errorJson.title) {
                        errorMessage = errorJson.title; // Якщо ASP.NET Core повертає ProblemDetails
                    } else if (typeof errorJson === 'string' && errorJson.length < 200) {
                        errorMessage = errorJson;
                    }
                } catch {
                    // Якщо не JSON, використовуємо текстове повідомлення
                    const errorText = await response.text();
                    errorMessage += ` - ${errorText.substring(0, 50)}...`;
                }
                throw new Error(errorMessage);
            }

            const savedNote = await response.json() as NoteDto;
            
            // Оновлюємо список нотаток новим елементом
            setNotes(prevNotes => [savedNote, ...prevNotes]);
            
            // Очищаємо форму
            setNewNoteContent('');
            
        } catch (error) {
            console.error('Error saving note:', error);
            // Відображаємо більш точну помилку, якщо вона є в об'єкті error
            setSaveError(error instanceof Error ? error.message : 'Не вдалося зберегти нотатку. Спробуйте пізніше.');
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- Рендеринг ---

    if (loading) {
        return <div className={s.loading}>Завантаження нотаток...</div>;
    }
    
    if (error) {
        return <div className={s.error}>Помилка: {error}</div>;
    }
    
    const hasNotes = notes && notes.length > 0;

    return (
        <div className={s.pageOffset}> 
            <div className={s.notesContainer}>
                <h2>Мої Нотатки</h2>
                
                {/* --- ФОРМА СТВОРЕННЯ НОТАТКИ --- */}
                <div className={s.createForm}>
                    <textarea
                        className={s.textarea}
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Введіть текст нової нотатки..."
                        rows={4}
                        disabled={isSaving}
                    />
                    {saveError && <p className={s.errorText}>{saveError}</p>}
                    <button
                        className={s.addNoteButton}
                        onClick={handleSaveNote}
                        disabled={isSaving || !newNoteContent.trim()}
                    >
                        {isSaving ? 'Збереження...' : 'Зберегти нотатку'}
                    </button>
                </div>
                {/* ----------------------------- */}

                <div className={s.notesList}>
                    {hasNotes ? (
                        notes.map(note => (
                            <NoteItem key={note.id} note={note} />
                        ))
                    ) : (
                        <div className={s.emptyState}>У вас ще немає жодної нотатки. Створіть першу!</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notes;