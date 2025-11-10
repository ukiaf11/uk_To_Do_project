import { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import TaskEditModal from '../components/TaskEditModal';   

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState(null);      
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks/');
      setTasks(res.data);
    } catch (err) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const res = await API.post('/tasks/', { title: newTask, description: '' });
    setTasks([...tasks, res.data]);
    setNewTask('');
  };

  const toggleComplete = async (task) => {
    const res = await API.put(`/tasks/${task.id}/`, {
      ...task,
      completed: !task.completed,
    });
    setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}/`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const openEditModal = (task) => {
    setEditTask(task);  
  };

  const closeEditModal = () => {
    setEditTask(null);  
  };

  const updateTaskInList = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>My Tasks</h1>
        <button onClick={logout} style={styles.btn}>Logout</button>
      </div>

      <form onSubmit={addTask} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ padding: 10, width: '70%' }}
        />
        <button type="submit" style={{ ...styles.btn, marginLeft: 10 }}>Add</button>
      </form>

      <div>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              ...styles.task,
              textDecoration: task.completed ? 'line-through' : 'none',
              opacity: task.completed ? 0.6 : 1,
            }}
          >
            <span
              onClick={() => openEditModal(task)}   
              style={{ cursor: 'pointer', flex: 1 }}
            >
              {task.title}
              {task.description && <p style={{ margin: '5px 0', fontSize: 14, color: '#555' }}>{task.description}</p>}
            </span>
            <div>
              <button onClick={() => toggleComplete(task)} style={styles.toggleBtn}>
                {task.completed ? 'Undo' : 'Done'}
              </button>
              <button onClick={() => deleteTask(task.id)} style={styles.deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editTask && (
        <TaskEditModal
          task={editTask}
          onClose={closeEditModal}
          onUpdate={updateTaskInList}
        />
      )}
    </div>
  );
}

const styles = {
  task: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    margin: '8px 0',
    background: '#f8f9fa',
    borderRadius: 8,
    border: '1px solid #e9ecef',
  },
  btn: {
    padding: '8px 16px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  toggleBtn: {
    background: '#007bff',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    marginRight: 5,
    borderRadius: 4,
    cursor: 'pointer',
  },
  deleteBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: 4,
    cursor: 'pointer',
  },
};