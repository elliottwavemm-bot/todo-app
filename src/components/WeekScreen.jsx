import { useState } from 'react'
import { CheckButton } from './TaskCard.jsx'
import { addDaysISO, todayISO, dowOf, dateNumOf, DOW_TH, DAY_FULL_TH, MONTH_TH, MONTH_TH_SHORT } from '../data.js'

export default function WeekScreen({ tasks, onToggleTask, onOpenTask }) {
  const [selected, setSelected] = useState(0)
  const base = todayISO()
  const now = new Date()

  const days = Array.from({ length: 7 }, (_, i) => {
    const iso = addDaysISO(base, i)
    return {
      i, iso,
      dow: DOW_TH[dowOf(iso)],
      num: dateNumOf(iso),
      load: tasks.filter((t) => t.due === iso).length,
    }
  })

  const sel = days[selected]
  const dayTasks = tasks
    .filter((t) => t.due === sel.iso)
    .sort((a, b) => a.hour.localeCompare(b.hour))

  const selDate = new Date(sel.iso + 'T00:00:00')
  const dayTitle =
    (selected === 0 ? 'วันนี้' : 'วัน' + DAY_FULL_TH[selDate.getDay()]) +
    ` ${selDate.getDate()} ${MONTH_TH_SHORT[selDate.getMonth()]}`

  return (
    <div className="screen">
      <div className="screen-head">
        <div className="eyebrow">{MONTH_TH[now.getMonth()]} {now.getFullYear() + 543}</div>
        <h1 className="h-display">สัปดาห์นี้</h1>
      </div>

      <div style={{ padding: '0 16px 16px', display: 'flex', gap: 5 }}>
        {days.map((d) => {
          const active = d.i === selected
          return (
            <button
              key={d.i}
              type="button"
              onClick={() => setSelected(d.i)}
              style={{
                flex: 1, cursor: 'pointer', border: 'none', padding: '11px 0 9px',
                borderRadius: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                background: active ? 'var(--color-accent)' : d.i === 0 ? 'var(--color-surface)' : 'transparent',
                color: active ? 'var(--color-bg)' : 'var(--color-text)',
                transition: 'background .15s ease',
              }}
            >
              <span style={{ fontSize: 11, opacity: 0.75, fontWeight: 600 }}>{d.dow}</span>
              <span className="font-display" style={{ fontSize: 17 }}>{d.num}</span>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: d.load === 0 ? 'transparent' : active ? 'color-mix(in srgb, var(--color-bg) 80%, transparent)' : 'var(--color-accent-500)',
              }} />
            </button>
          )
        })}
      </div>

      <div className="screen-scroll" style={{ paddingTop: 6, gap: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginBottom: 14 }}>
          <h2 className="font-display" style={{ fontSize: 20, whiteSpace: 'nowrap' }}>{dayTitle}</h2>
          {dayTasks.length > 0 && (
            <span style={{ fontSize: 13, opacity: 0.6, whiteSpace: 'nowrap' }}>{dayTasks.length} งาน</span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {dayTasks.map((t) => (
            <div key={t.id} style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 52, flex: 'none', textAlign: 'right', paddingTop: 15 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, opacity: 0.75 }}>{t.hour}</div>
              </div>
              <div style={{
                flex: 1, display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 24,
                background: t.pri === 'high' ? 'var(--color-accent-100)' : 'var(--color-surface)',
              }}>
                <CheckButton done={t.done} onClick={() => onToggleTask(t.id)} size={25} />
                <button type="button" className="task-main" onClick={() => onOpenTask(t.id)}>
                  <div className={`task-title ${t.done ? 'is-done' : ''}`} style={{ fontSize: 15 }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                    #{t.tag}{t.repeat ? ` ↻ ${t.repeat}` : ''}
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>

        {dayTasks.length === 0 && (
          <div style={{ marginTop: 14, padding: '30px 22px', borderRadius: 28, background: 'var(--color-accent-2-100)', textAlign: 'center' }}>
            <div className="font-display" style={{ fontSize: 19, marginBottom: 6 }}>วันนี้ว่างสนิท</div>
            <div style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.6 }}>
              จะนอนกลางวันก็ไม่มีใครว่า (แต่ถ้าจะอ่านหนังสือก็ดีนะ)
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
