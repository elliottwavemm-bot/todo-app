import { useState } from 'react'

export default function TodoInput({ onAdd }) {
  const [value, setValue] = useState('')

  const submit = () => {
    const text = value.trim()
    if (!text) return
    onAdd(text)
    setValue('')
  }

  return (
    <div className="todo-input">
      <input
        type="text"
        className="todo-input-field"
        placeholder="เพิ่มงานใหม่…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
        }}
        autoFocus
      />
      <button
        type="button"
        className="todo-input-button"
        onClick={submit}
        disabled={!value.trim()}
        aria-label="เพิ่มงาน"
      >
        เพิ่ม
      </button>
    </div>
  )
}
