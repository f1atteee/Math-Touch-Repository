import React from 'react';
import s from './Notes.module.scss';

export interface NoteDto {
    id: number;
    userId: string;
    content: string;
    createdAt: string;
    lastUpdatedAt: string | null;
}

interface NoteItemProps {
    note: NoteDto;
    // Додайте функції для видалення та оновлення, якщо вони потрібні
    // onDelete: (id: number) => void;
    // onEdit: (note: NoteDto) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
    // Форматуємо дату для відображення
    const formattedDate = new Date(note.createdAt).toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Заголовок можна сформувати з перших слів контенту, якщо його немає
    const title = note.content.split(' ').slice(0, 5).join(' ') + (note.content.length > 30 ? '...' : '');

    return (
        <div className={s.noteItem}>
            <h3 className={s.noteTitle}>{title}</h3>
            {/* Використовуємо CreatedAt, оскільки у DTO немає окремого title */}
            <p className={s.noteDate}>Створено: {formattedDate}</p> 
            <p className={s.noteContent}>{note.content}</p>
            {/* Тут можна додати кнопки для редагування та видалення */}
            {/* <div className={s.actions}>...</div> */}
        </div>
    );
};

export default NoteItem;