'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { styles } from './styles';
import { FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import AiChat from '@/custom_components/ai chat/chat';

interface INote {
  _id: string;
  content: string;
  emotion: string;
  createdAt: Date;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [currentNote, setCurrentNote] = useState<{ content: string, emotion: string }>({ content: '', emotion: '' });
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

      // Set the current note content and emotion
      const newNoteData = data.find((note: INote) => note.content === newNote);
      setCurrentNote({
        content: newNote,
        emotion: newNoteData?.emotion || 'Unknown', // Default to 'Unknown' if not found
      });
      setNewNote('');
      setShowChatModal(true);
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
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note"
          style={styles.addNoteInput}
        />
        <button type="submit" style={styles.addNoteButton}>Add Note</button>
      </form>
      <div style={styles.notesList}>
        {notes.map((note) => (
          <div key={note._id} style={styles.noteItem}>
            <div>
              <span>{note.content}</span>
              <span style={styles.emotion}> - Emotion: {note.emotion}</span>
            </div>
            <button
              onClick={() => deleteNote(note._id)}
              style={styles.deleteButton}
              aria-label="Delete note"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
      <Modal
        isOpen={showChatModal}
        onRequestClose={() => setShowChatModal(false)}
        contentLabel="AI Chat Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '500px',
          },
        }}
      >
        <h2>Would you like to discuss your note with an AI?</h2>
        <p>Your note: {currentNote.content}</p>
        <p>Emotion: {currentNote.emotion}</p>
        <button onClick={() => setShowChatModal(false)}>No, thanks</button>
        <AiChat 
          initialMessage={`The user wrote this note: "${currentNote.content}" with emotion: "${currentNote.emotion}". Discuss it with them.`}
          onClose={() => setShowChatModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Notes;
