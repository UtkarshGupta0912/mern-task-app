import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  // Create axios config with JWT token in header
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  // useEffect → runs once when component loads (like page load)
  useEffect(() => {
    fetchTasks();
  }, []); // [] = run only once

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/tasks`,
        config
      );
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/tasks`,
        { title },
        config
      );
      setTasks([...tasks, res.data]); // add new task to list
      setTitle('');
    } catch {
      setError('Failed to add task');
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tasks/${task._id}`,
        { completed: !task.completed },
        config
      );
      // update the task in local state
      setTasks(tasks.map(t => t._id === task._id ? res.data : t));
    } catch {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/tasks/${id}`,
        config
      );
      setTasks(tasks.filter(t => t._id !== id)); // remove from list
    } catch {
      setError('Failed to delete task');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <h2 style={{margin:0}}>👋 Hello, {user?.name}</h2>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {/* Add Task Form */}
        <form onSubmit={addTask} style={styles.form}>
          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
          />
          <button style={styles.addBtn} type="submit">Add</button>
        </form>

        {/* Task List */}
        <div>
          {tasks.length === 0 && (
            <p style={{textAlign:'center', color:'#999'}}>No tasks yet. Add one above!</p>
          )}
          {tasks.map(task => (
            <div key={task._id} style={styles.taskItem}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
                style={{marginRight:'10px', cursor:'pointer'}}
              />
              <span style={{
                flex: 1,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#999' : '#333'
              }}>
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task._id)}
                style={styles.deleteBtn}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <p style={styles.count}>
          {tasks.filter(t => !t.completed).length} tasks remaining
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', background:'#f0f2f5', padding:'2rem' },
  card: { background:'white', borderRadius:'10px', padding:'2rem', maxWidth:'600px', margin:'0 auto', boxShadow:'0 2px 10px rgba(0,0,0,0.1)' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' },
  form: { display:'flex', gap:'10px', marginBottom:'1.5rem' },
  input: { flex:1, padding:'10px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'14px' },
  addBtn: { padding:'10px 20px', background:'#4f46e5', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  logoutBtn: { padding:'8px 16px', background:'#ef4444', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  taskItem: { display:'flex', alignItems:'center', padding:'12px', borderRadius:'6px', marginBottom:'8px', background:'#f9f9f9', border:'1px solid #eee' },
  deleteBtn: { background:'none', border:'none', cursor:'pointer', fontSize:'16px' },
  error: { color:'red', marginBottom:'1rem' },
  count: { textAlign:'center', color:'#999', marginTop:'1rem', fontSize:'14px' }
};

export default Dashboard;