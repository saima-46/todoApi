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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col items-center py-16 px-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl transition-transform duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          📝 Modern <span className="text-blue-600">Todo App</span>
        </h2>

        {/* Add Todo Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all font-semibold"
          >
            Add Task
          </button>
        </form>

        {/* Todo List */}
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />

                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span
                    className={`text-lg ${
                      todo.completed ? "line-through text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {todo.todo}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {editingId === todo.id ? (
                  <button
                    onClick={() => saveEdit(todo)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(todo)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-lg"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
