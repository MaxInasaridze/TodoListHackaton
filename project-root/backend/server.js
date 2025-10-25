import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());


const dataPath = path.join(__dirname, "data", "data.json");


if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify([]));
}


const readTodos = () => {
  const data = fs.readFileSync(dataPath, "utf8") || "[]";
  return JSON.parse(data);
};

const writeTodos = (todos) => {
  fs.writeFileSync(dataPath, JSON.stringify(todos, null, 2));
};


app.get("/api/todos", (req, res) => {
  try {
    const todos = readTodos();
    res.status(200).json(todos);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/todos", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const todos = readTodos();
  const newTodo = {
    id: uuidv4(), 
    title,
    completed: false,
  };

  todos.push(newTodo);
  writeTodos(todos);

  res.status(201).json(newTodo);
});


app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todo.completed = !todo.completed;
  writeTodos(todos);

  res.status(200).json(todo);
});


app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const filtered = todos.filter((t) => t.id !== id);

  if (filtered.length === todos.length) {
    return res.status(404).json({ error: "Todo not found" });
  }

  writeTodos(filtered);
  res.status(200).json({ message: "Todo deleted" });
});


const PORT = process.env.PORT || 1234;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));