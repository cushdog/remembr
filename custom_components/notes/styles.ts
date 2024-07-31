import { CSSProperties } from 'react';

interface NotesStyles {
  notesContainer: CSSProperties;
  addNoteForm: CSSProperties;
  addNoteInput: CSSProperties;
  addNoteButton: CSSProperties;
  notesList: CSSProperties;
  noteItem: CSSProperties;
  noteContent: CSSProperties;
  deleteButton: CSSProperties;
  emotion: CSSProperties;
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
    alignItems: 'flex-start',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa',
  },
  noteContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginRight: '10px',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    color: '#dc3545',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emotion: {
    fontSize: '0.8em',
    color: '#666',
    marginTop: '5px',
  },
};