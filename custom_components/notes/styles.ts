import { CSSProperties } from 'react';

interface NotesStyles {
  notesContainer: CSSProperties;
  addNoteForm: CSSProperties;
  addNoteInput: CSSProperties;
  addNoteButton: CSSProperties;
  notesList: CSSProperties;
  noteItem: CSSProperties;
  deleteButton: CSSProperties;
}

export const styles: NotesStyles = {
  notesContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  addNoteForm: {
    display: 'flex',
    marginBottom: '20px',
  },
  addNoteInput: {
    flexGrow: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px 0 0 4px',
  },
  addNoteButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
  },
  notesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  noteItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    fontSize: '16px',
    lineHeight: 1,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};