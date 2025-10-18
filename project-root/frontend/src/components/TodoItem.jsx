import React from "react";
import {motion} from "farmer motion";
import{faTrash, FaCheckcircle, FaRegCircle} from "react-icons/fa";

function TodoItem ( {todo, togggleTodo, deleteTodo}) 
    return (
    <motion.li
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between bg-white shadow p-3 rounded-lg"
    >
      <div
        onClick={() => toggleTodo(todo.id)}
        className="flex items-center gap-3 cursor-pointer"
      >
        {todo.completed ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <FaRegCircle className="text-gray-400" />
        )}
        <span
          className={`${
            todo.completed ? "line-through text-gray-500" : ""
          } text-lg`}
        >
          {todo.title}
        </span>
      </div>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="text-red-500 hover:text-red-700 transition"
      >
        <FaTrash />
      </button>
    </motion.li>
  );
}

export default TodoItem;
