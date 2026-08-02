import { useState } from 'react'
import TaskCard from './TaskCard.jsx'
import { bucketOf, DAY_FULL_TH, MONTH_TH } from '../data.js'

const CHIPS = [
  { label: 'ทั้งหมด', k: 'all' },
  { label: 'เลยกำหนด', k: 'overdue' },
  { label: 'ด่วน', k: 'high' },
]

export default function TodayScreen({ tasks, toggles, onToggleTask, onOpenTask, onAdd, go }) {
  const [filter, setFilter] = useState('all')

  const now = new Date()
  const dateLine = `${DAY_FULL_TH[now.getDay()]} ${now.getDate()} ${MONTH_TH[now.getMonth()]}`

  const overdue = tasks.filter((t) => bucketOf(t) === 'overdue')
  const todayAll = tasks.filter((t) => bucketOf(t) === 'today')
  const later = tasks.filter((t) => bucketOf(t) === 'later')

  const openToday = [...overdue, ...todayAll].filter((t) => !t.done).length
  const totalToday = overdue.length + todayAll.length
  const doneToday = totalToday - openToday
  const pct = totalToday ? Math.round((doneToday / totalToday) * 100) : 100

  let todayList = todayAll
  if (filter === 'overdue') todayList = []
  if (filter === 'high') todayList = todayAll.filter((t) => t.pri === 'high')

  const showOverdue = overdue.length > 0 && filter !== 'high'
  const allDone = openToday === 0 || (filter === 'overdue' && overdue.length === 0)
  const emptyTitle =
    filter === 'overdue' && overdue.length === 0 && openToday > 0
      ? 'ไม่มีงานเลยกำหนดเลย'
      : 'ครบทุกงานแล้ว'
  const emptyBody =
    filter === 'overdue' && overdue.length === 0 && openToday > 0
      ? 'ตามงานทันหมด ขอชื่นชมจากใจ'
      : 'ปิดครบทุกข้อของวันนี้ จะนอนต่อ จะดูซีรีส์ หรือจะเพิ่มงานใหม่ก็ตามสบาย'

  return (
    <div className="screen">
      <div className="screen-head" style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div className="eyebrow">{dateLine}</div>
          <h1 className="h-display">
            {openToday === 0 ? 'ว่างแล้ว สบายตัว' : `วันนี้มี ${openToday} อย่างที่รออยู่`}
          </h1>
        </div>
        <button type="button" className="btn btn-icon" onClick={() => go('settings')} aria-label="ตั้งค่า">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
          </svg>
        </button>
      </div>

      <div style={{ padding: '0 22px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px', borderRadius: 26, background: 'var(--color-surface)' }}>
          <div
            className="progress-ring"
            style={{ background: `conic-gradient(var(--color-accent-2-500) ${pct * 3.6}deg, var(--color-neutral-300) 0)` }}
          >
            <div>{pct}%</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-display" style={{ fontSize: 17 }}>
              {pct === 100 ? 'ครบทุกข้อแล้ว' : `ทำไปแล้ว ${doneToday} จาก ${totalToday}`}
            </div>
            <div style={{ fontSize: 13, opacity: 0.65, marginTop: 2 }}>
              {pct === 100
                ? 'วันนี้เก่งเกินโควตา'
                : pct >= 50
                  ? 'เกินครึ่งแล้ว ลุยต่ออีกนิด'
                  : 'เริ่มจากข้อที่ง่ายที่สุดก็ได้นะ'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 22px 12px', display: 'flex', gap: 8 }}>
        {CHIPS.map((c) => (
          <button
            key={c.k}
            type="button"
            className={`chip ${filter === c.k ? 'is-active' : ''}`}
            onClick={() => setFilter(c.k)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="screen-scroll">
        {showOverdue && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="section-head">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-700)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
              </svg>
              <div className="section-label is-accent">เลยกำหนด</div>
              <div className="section-rule" />
            </div>
            {overdue.map((t) => (
              <TaskCard key={t.id} task={t} urgent onToggle={onToggleTask} onOpen={onOpenTask} />
            ))}
          </div>
        )}

        {todayList.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="section-head">
              <div className="section-label">{filter === 'high' ? 'ด่วนวันนี้' : 'วันนี้'}</div>
              <div className="section-rule" />
            </div>
            {todayList.map((t) => (
              <TaskCard key={t.id} task={t} onToggle={onToggleTask} onOpen={onOpenTask} />
            ))}
          </div>
        )}

        {allDone && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 18, padding: '34px 10px 10px' }}>
            <div style={{ position: 'relative', width: 150, height: 120 }}>
              <div style={{ position: 'absolute', left: 12, top: 6, width: 104, height: 104, borderRadius: '50%', background: 'var(--color-accent-2-200)' }} />
              <div style={{ position: 'absolute', right: 6, top: 34, width: 62, height: 62, borderRadius: '50%', background: 'var(--color-accent-200)' }} />
              <div style={{ position: 'absolute', left: 44, top: 36, width: 60, height: 60, borderRadius: '50%', background: 'var(--color-accent-2-500)', display: 'grid', placeItems: 'center' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="font-display" style={{ fontSize: 25, marginBottom: 8 }}>{emptyTitle}</h2>
              <p style={{ fontSize: 14.5, opacity: 0.68, lineHeight: 1.6, textWrap: 'pretty' }}>{emptyBody}</p>
            </div>
            <button type="button" className="btn btn-secondary" style={{ padding: '11px 20px' }} onClick={onAdd}>
              เพิ่มงานใหม่
            </button>
          </div>
        )}

        {later.length > 0 && filter === 'all' && !toggles.focus && (
          <button
            type="button"
            onClick={() => go('all')}
            style={{ border: 'none', cursor: 'pointer', textAlign: 'left', background: 'transparent', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.6, fontSize: 13.5 }}
          >
            <span>อีก {later.length} งานรออยู่วันหลัง</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
