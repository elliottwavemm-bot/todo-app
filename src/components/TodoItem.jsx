import { useEffect, useRef, useState } from 'react'

export default function TodoItem({ todo, onToggle, onEdit, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const startEdit = () => {
    setDraft(todo.text)
    setEditing(true)
  }

  const commitEdit = () => {
    const text = draft.trim()
    if (text && text !== todo.text) onEdit(todo.id, text)
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(todo.text)
    setEditing(false)
  }

  return (
    <li
      className={[
        'todo-item',
        todo.done ? 'is-done' : '',
        todo.removing ? 'is-removing' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className="todo-check"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.done ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
        aria-pressed={todo.done}
      >
        {todo.done && (
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
            <path
              d="M2.5 8.5 6 12l7.5-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          className="todo-edit-field"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit()
            if (e.key === 'Escape') cancelEdit()
          }}
        />
      ) : (
        <span className="todo-text" onDoubleClick={startEdit} title="ดับเบิลคลิกเพื่อแก้ไข">
          {todo.text}
        </span>
      )}

      <button
        type="button"
        className="todo-delete"
        onClick={() => onRemove(todo.id)}
        aria-label="ลบงาน"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path
            d="M3 3l10 10M13 3L3 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </li>
  )
}
