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

  // Load todos
  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/todos");
      setTodos(res.data);
    } catch (err) {
      toast.error("Failed to load todos 😭");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Enter a title!");

    try {
      const res = await axios.post("http://localhost:5000/api/todos", {
        title,
      });
      setTodos([...todos, res.data]);
      setTitle("");
      toast.success("Todo added! ✅");
    } catch {
      toast.error("Error adding todo 💀");
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
      toast.info("Todo deleted 🗑️");
    } catch {
      toast.error("Delete failed 💀");
    }
  };

  // Toggle completed
  const toggleTodo = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.map((t) => (t.id === id ? res.data : t)));
    } catch {
      toast.error("Toggle failed 💀");
    }
  };

  return (
    <div className="app">
      <h1>📝 Todo List</h1>

      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          placeholder="Add a new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {/* Todo List */}
      <ul className="todo-list">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              className={`todo-item ${todo.completed ? "done" : ""}`}
              onClick={() => toggleTodo(todo.id)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <span>{todo.title}</span>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTodo(todo.id);
                }}
              >
                <FaTrash />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <ToastContainer />
    </div>
  );
}

export default App;
