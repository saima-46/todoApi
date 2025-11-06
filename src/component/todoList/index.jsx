import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo, deleteTodo, fetchTodo, updateTodo } from '../../store/slice/todoSlice'

const TodoList = () => {
  const dispatch = useDispatch()
  const { todos, loading, error } = useSelector((state) => state.todo)

  const [title, setTitle] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    dispatch(fetchTodo())
  }, [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim() === "") return
    dispatch(addTodo(title))
    setTitle("")
  }

  const handleToggle = (todo) => {
    dispatch(updateTodo({ id: todo.id, todo: todo.todo, completed: !todo.completed }))
  }

  const handleDelete = (id) => {
    dispatch(deleteTodo(id))
  }

  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.todo)
  }

  const saveEdit = (todo) => {
    if (editText.trim() === "") return
    dispatch(updateTodo({ id: todo.id, todo: editText, completed: todo.completed }))
    setEditingId(null)
    setEditText("")
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>Todo App</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a todo"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
            />

            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(todo)}>Save</button>
              </>
            ) : (
              <>
                {todo.todo}
                <button onClick={() => startEdit(todo)}>Edit</button>
              </>
            )}

            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
