import { useEffect, useMemo, useState } from 'react'
import TodoInput from './components/TodoInput.jsx'
import TodoItem from './components/TodoItem.jsx'
import FilterBar from './components/FilterBar.jsx'

const STORAGE_KEY = 'futuristic-todos-v1'

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const todayLabel = new Intl.DateTimeFormat('th-TH', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())

export default function App() {
  const [todos, setTodos] = useState(loadTodos)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = (text) => {
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text,
        done: false,
        removing: false,
        createdAt: Date.now(),
      },
      ...prev,
    ])
  }

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  const editTodo = (id, text) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)))
  }

  // ตั้งธง removing ก่อนเพื่อให้ animation เล่นจบ แล้วค่อยลบจริง
  const removeTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removing: true } : t)),
    )
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== id))
    }, 320)
  }

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.done)
    if (filter === 'done') return todos.filter((t) => t.done)
    return todos
  }, [todos, filter])

  const remaining = todos.filter((t) => !t.done && !t.removing).length

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Tasks</h1>
        <p className="app-date">{todayLabel}</p>
      </header>

      <TodoInput onAdd={addTodo} />

      <FilterBar filter={filter} onChange={setFilter} remaining={remaining} />

      <ul className="todo-list">
        {visibleTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onEdit={editTodo}
            onRemove={removeTodo}
          />
        ))}
      </ul>

      {visibleTodos.length === 0 && (
        <p className="empty-state">
          {filter === 'done'
            ? 'ยังไม่มีงานที่เสร็จ'
            : filter === 'active'
              ? 'ไม่มีงานค้าง'
              : 'ยังไม่มีงาน — พิมพ์เพิ่มได้ที่ช่องด้านบน'}
        </p>
      )}

      <footer className="app-footer">
        <span className="hint">ดับเบิลคลิกที่ชื่องานเพื่อแก้ไข</span>
      </footer>
    </div>
  )
}
