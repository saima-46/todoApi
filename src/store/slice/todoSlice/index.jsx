import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//  Fetch all todos
export const fetchTodo = createAsyncThunk("todo/fetch", async () => {
  const req = await fetch("https://dummyjson.com/todos");
  const res = await req.json();
  return res.todos;
});

//  Add new todo
export const addTodo = createAsyncThunk("todo/add", async (title) => {
  const req = await fetch("https://dummyjson.com/todos/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      todo: title,
      completed: false,
      userId: 1,
    }),
  });
  const res = await req.json();
  return res;
});

//  Update todo (can change text or completed)
export const updateTodo = createAsyncThunk(
  "todo/updateTodo",
  async ({ id, todo, completed }) => {
    const req = await fetch(`https://dummyjson.com/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        todo,
        completed,
      }),
    });
    const res = await req.json();
    return res;
  }
);

// Delete todo
export const deleteTodo = createAsyncThunk("todo/deleteTodo", async (id) => {
  const res = await fetch(`https://dummyjson.com/todos/${id}`, { method: "DELETE" });
  const data = await res.json();
  return data.id;
});

//  Slice
export const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodo.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch todos";
      })

      // Add todo
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload);
      })

      //  Update todo (text or completed)
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          // update only changed fields
          state.todos[index] = {
            ...state.todos[index],
            todo: action.payload.todo,
            completed: action.payload.completed,
          };
        }
      })

      // Delete todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t.id !== action.payload);
      });
  },
});

export default todoSlice;
