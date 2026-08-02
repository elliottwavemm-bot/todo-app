import { PRI, timeLabel } from '../data.js'

export function CheckButton({ done, onClick, size = 27 }) {
  return (
    <button
      type="button"
      className={`task-check ${done ? 'is-done' : ''}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      aria-label={done ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
      aria-pressed={done}
    >
      <svg width={size / 2} height={size / 2} viewBox="0 0 24 24" fill="none"
        stroke="var(--color-bg)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </button>
  )
}

export default function TaskCard({ task, urgent = false, showPriDot = true, onToggle, onOpen }) {
  const subN = task.subs.length
  const subDone = task.subs.filter((s) => s.done).length
  return (
    <div className={`task-card ${urgent ? 'is-urgent' : ''}`}>
      <CheckButton done={task.done} onClick={() => onToggle(task.id)} />
      <button type="button" className="task-main" onClick={() => onOpen(task.id)}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <div className={`task-title ${task.done ? 'is-done' : ''}`} style={{ flex: 1 }}>
            {task.title}
          </div>
          {showPriDot && !urgent && (
            <span className="pri-dot" style={{ marginTop: 6, background: PRI[task.pri].color }} />
          )}
        </div>
        <div className="task-meta">
          {urgent ? (
            <span className="time-pill">{timeLabel(task)}</span>
          ) : (
            <span>{timeLabel(task)}</span>
          )}
          <span>#{task.tag}</span>
          {subN > 0 && <span>งานย่อย {subDone}/{subN}</span>}
          {task.repeat && <span>↻ {task.repeat}</span>}
        </div>
      </button>
    </div>
  )
}
