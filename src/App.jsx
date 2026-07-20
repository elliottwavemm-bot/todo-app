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

const today = new Date()
const dateLabel = new Intl.DateTimeFormat('th-TH', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(today)
const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const todayIndex = today.getDay()

function SunOrnament() {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <circle cx="20" cy="20" r="4.5" />
        <g strokeLinecap="round">
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6
            const long = i % 3 === 0
            const r1 = 7
            const r2 = long ? 17 : 12
            return (
              <line
                key={i}
                x1={20 + r1 * Math.cos(a)}
                y1={20 + r1 * Math.sin(a)}
                x2={20 + r2 * Math.cos(a)}
                y2={20 + r2 * Math.sin(a)}
              />
            )
          })}
        </g>
      </g>
    </svg>
  )
}

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
    <div className="sheet">
      <header className="masthead">
        <h1 className="app-title">Daily Tasks</h1>
        <div className="ornament">
          <SunOrnament />
        </div>
      </header>

      <div className="date-row">
        <span className="date-label">
          DATE : <span className="date-value">{dateLabel}</span>
        </span>
        <span className="day-letters" aria-label="วันในสัปดาห์">
          {DAY_LETTERS.map((d, i) => (
            <span key={i} className={i === todayIndex ? 'is-today' : ''}>
              {d}
            </span>
          ))}
        </span>
      </div>

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
              : 'ยังไม่มีงานสำหรับวันนี้ — เขียนเพิ่มได้ที่บรรทัดด้านบน'}
        </p>
      )}

      <footer className="sheet-footer">
        <span className="hint">ดับเบิลคลิกที่ชื่องานเพื่อแก้ไข</span>
      </footer>
    </div>
  )
}
