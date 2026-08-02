import { useState } from 'react'
import TaskCard from './TaskCard.jsx'
import { FOLDER_DEFS, bucketOf } from '../data.js'

export default function AllScreen({ tasks, toggles, onToggleTask, onOpenTask }) {
  const [query, setQuery] = useState('')
  const [folder, setFolder] = useState(null)

  const q = query.trim()
  let list = tasks
  if (toggles.focus) list = list.filter((t) => bucketOf(t) !== 'later')
  if (folder) list = list.filter((t) => t.tag === folder)
  if (q) list = list.filter((t) => t.title.includes(q) || t.tag.includes(q))

  const folders = FOLDER_DEFS.map((f) => {
    const items = tasks.filter((t) => t.tag === f.name)
    const done = items.filter((t) => t.done).length
    return {
      ...f,
      active: folder === f.name,
      count: `${done}/${items.length} เสร็จแล้ว`,
      pct: items.length ? Math.round((done / items.length) * 100) : 0,
    }
  })

  return (
    <div className="screen">
      <div className="screen-head">
        <h1 className="h-display" style={{ margin: '0 0 12px' }}>งานทั้งหมด</h1>
        <div className="search-bar">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, flex: 'none' }}>
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            placeholder="ค้นหางาน… เช่น สไลด์"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="screen-scroll" style={{ gap: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginBottom: 22 }}>
          {folders.map((f) => (
            <button
              key={f.name}
              type="button"
              onClick={() => setFolder(f.active ? null : f.name)}
              style={{
                cursor: 'pointer', textAlign: 'left',
                border: '2.5px solid', padding: '15px 16px', borderRadius: 26,
                display: 'flex', flexDirection: 'column', gap: 11,
                background: f.active ? f.bg : 'var(--color-surface)',
                borderColor: f.active ? f.dot : 'transparent',
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center', background: f.dot }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z" />
                </svg>
              </div>
              <div>
                <div className="font-display" style={{ fontSize: 16 }}>{f.name}</div>
                <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>{f.count}</div>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: 'rgba(32,30,29,.1)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 999, width: `${f.pct}%`, background: f.dot }} />
              </div>
            </button>
          ))}
        </div>

        <div className="section-head" style={{ marginBottom: 11 }}>
          <div className="section-label">
            {folder ? `#${folder}` : `ทุกงาน ${list.length} รายการ`}
          </div>
          <div className="section-rule" />
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: 12.5, padding: '4px 8px', opacity: folder || q ? 1 : 0, pointerEvents: folder || q ? 'auto' : 'none' }}
            onClick={() => { setFolder(null); setQuery('') }}
          >
            ล้างตัวกรอง
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {list.map((t) => (
            <TaskCard key={t.id} task={t} onToggle={onToggleTask} onOpen={onOpenTask} />
          ))}
        </div>

        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '36px 20px', opacity: 0.6, fontSize: 14.5 }}>
            ไม่เจองานที่ตรงเลย ลองพิมพ์สั้นลงหน่อย
          </div>
        )}
      </div>
    </div>
  )
}
