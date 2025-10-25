import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");


  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:1234/api/todos");
      setTodos(res.data);
    } catch (err) {
      toast.error("Failed to load todos 😭");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);


  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Enter a title!");

    try {
      const res = await axios.post("http://localhost:1234/api/todos", {
        title,
      });
      setTodos([...todos, res.data]);
      setTitle("");
      toast.success("Todo added! ✅");
    } catch {
      toast.error("Error adding todo 💀");
    }
  };

 
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:1234/api/todos/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
      toast.info("Todo deleted 🗑️");
    } catch {
      toast.error("Delete failed 💀");
    }
  };

 
  const toggleTodo = async (id) => {
    try {
      const res = await axios.put(`http://localhost:1234/api/todos/${id}`);
      setTodos(todos.map((t) => (t.id === id ? res.data : t)));
    } catch {
      toast.error("Toggle failed 💀");
    }
  };

  return (
    <div className="app">
      <h1>📝 Todo List</h1>

      
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          placeholder="Add a new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      
      <ul className="todo-list">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              className={`todo-item ${todo.completed ? "done" : ""}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <span>{todo.title}</span>
          
              <div className="todo-actions">
                <button
                  className={`toggle-btn ${todo.completed ? "uncomplete" : "complete"}`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.completed ? "✓" : "✓"}
                </button>
          
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <ToastContainer />
    </div>
  );
}

export default App;
