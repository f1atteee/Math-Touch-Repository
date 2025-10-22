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
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
    const formattedDate = new Date(note.createdAt).toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const title = note.content.split(' ').slice(0, 5).join(' ') + (note.content.length > 30 ? '...' : '');

    return (
        <div className={s.noteItem}>
            <h3 className={s.noteTitle}>{title}</h3>
            <p className={s.noteDate}>Створено: {formattedDate}</p> 
            <p className={s.noteContent}>{note.content}</p>
        </div>
    );
};

export default NoteItem;