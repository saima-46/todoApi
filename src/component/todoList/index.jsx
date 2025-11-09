import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, deleteTodo, fetchTodo, updateTodo } from "../../store/slice/todoSlice";

const TodoList = () => {
  const dispatch = useDispatch();
  const { todos, loading, error } = useSelector((state) => state.todo);

  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    dispatch(fetchTodo());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") return;
    dispatch(addTodo(title));
    setTitle("");
  };

  const handleToggle = (todo) => {
    dispatch(updateTodo({ id: todo.id, todo: todo.todo, completed: !todo.completed }));
  };

  const handleDelete = (id) => {
    dispatch(deleteTodo(id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.todo);
  };

  const saveEdit = (todo) => {
    if (editText.trim() === "") return;
    dispatch(updateTodo({ id: todo.id, todo: editText, completed: todo.completed }));
    setEditingId(null);
    setEditText("");
  };

  if (loading) return <p className="text-center text-blue-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Todo App</h2>

      {/* Add Todo Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a todo"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition"
        >
          Add
        </button>
      </form>

      {/* Todo List */}
      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-4 py-2"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
                className="w-5 h-5 text-indigo-500"
              />

              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    onClick={() => saveEdit(todo)}
                    className="text-green-600 hover:text-green-700 font-medium ml-2"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`${
                      todo.completed ? "line-through text-gray-500" : "text-gray-800"
                    }`}
                  >
                    {todo.todo}
                  </span>
                  <button
                    onClick={() => startEdit(todo)}
                    className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handleDelete(todo.id)}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
