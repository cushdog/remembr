'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { styles } from './styles';

interface INote {
  _id: string;
  content: string;
  createdAt: Date;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [newNote, setNewNote] = useState('');
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newNote }),
      });
      if (!response.ok) throw new Error('Failed to add note');
      const data = await response.json();
      setNotes(data);
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ noteId }),
      });
      if (!response.ok) throw new Error('Failed to delete note');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  if (!user) {
    return <div>Please log in to view and add notes.</div>;
  }

  return (
    <div style={styles.notesContainer}>
      <h2>Notes</h2>
      <form onSubmit={addNote} style={styles.addNoteForm}>
        <Input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note"
        />
        <Button type="submit" style={styles.addNoteButton}>Add Note</Button>
      </form>
      <div style={styles.notesList}>
        {notes.map((note) => (
          <div key={note._id} style={styles.noteItem}>
            <span>{note.content}</span>
            <button
              onClick={() => deleteNote(note._id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;