// src/components/TaskEditModal.jsx
import { useState } from 'react';
import API from '../services/api';

export default function TaskEditModal({ task, onClose, onUpdate }) {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put(`/tasks/${task.id}/`, {
        title: form.title,
        description: form.description,
        completed: task.completed,
      });
      onUpdate(res.data);  // Parent ko updated task bhej
      onClose();           // Modal band
    } catch (err) {
      alert('Update failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Edit Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={styles.textarea}
            rows="3"
          />
          <div style={styles.buttons}>
            <button type="submit" disabled={loading} style={styles.saveBtn}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    maxWidth: 500,
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    border: '1px solid #ddd',
    borderRadius: 4,
  },
  textarea: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    border: '1px solid #ddd',
    borderRadius: 4,
    resize: 'vertical',
  },
  buttons: {
    display: 'flex',
    gap: 10,
    justifyContent: 'flex-end',
  },
  saveBtn: {
    padding: '10px 20px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '10px 20px',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
};

