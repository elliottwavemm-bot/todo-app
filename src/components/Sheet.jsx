import { PRI, REPEATS, TAGS } from '../data.js'

const WHEN_OPTS = [
  { k: 'today', label: 'วันนี้' },
  { k: 'tomorrow', label: 'พรุ่งนี้' },
  { k: 'week', label: 'ศุกร์นี้' },
  { k: 'someday', label: 'ไว้ก่อน' },
]

export default function Sheet({ draft, editing, onPatch, onClose, onSave, onDelete }) {
  return (
    <div className="sheet-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="sheet">
        <div className="sheet-grip"><span /></div>

        <div style={{ padding: '8px 24px 4px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 className="font-display" style={{ fontSize: 23, flex: 1 }}>
            {editing ? 'แก้ไขงาน' : 'เพิ่มงานใหม่'}
          </h2>
          <button type="button" className="btn btn-icon" style={{ width: 36, height: 36 }} onClick={onClose} aria-label="ปิด">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="sheet-body">
          <input
            className="sheet-title-input"
            placeholder="จะทำอะไรดี…"
            value={draft.title}
            onChange={(e) => onPatch('title', e.target.value)}
            autoFocus={!editing}
          />

          {!editing && (
            <div>
              <div className="sheet-label">เมื่อไหร่</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {WHEN_OPTS.map((o) => (
                  <button
                    key={o.k}
                    type="button"
                    className={`opt-pill ${draft.when === o.k ? 'is-on' : ''}`}
                    onClick={() => onPatch('when', o.k)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="sheet-label">ระดับความสำคัญ</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['high', 'mid', 'low'].map((k) => {
                const on = draft.pri === k
                return (
                  <button
                    key={k}
                    type="button"
                    className={`opt-pill tone-${k} ${on ? 'is-on' : ''}`}
                    style={{ flex: 1, borderRadius: 22, padding: '11px 8px' }}
                    onClick={() => onPatch('pri', k)}
                  >
                    <span className="pri-dot" style={{ background: on ? 'var(--color-bg)' : PRI[k].color }} />
                    {PRI[k].label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="sheet-label">แท็ก</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`opt-pill tone-sage ${draft.tag === t ? 'is-on' : ''}`}
                  onClick={() => onPatch('tag', t)}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="sheet-label">งานย่อย</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {draft.subs.map((sub, i) => (
                <div key={i} className="sub-row">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-neutral-500)', flex: 'none' }} />
                  <input
                    value={sub.t}
                    placeholder="ขั้นตอนย่อย"
                    onChange={(e) =>
                      onPatch('subs', draft.subs.map((x, j) => (j === i ? { ...x, t: e.target.value } : x)))
                    }
                  />
                  <button
                    type="button"
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 2, opacity: 0.45 }}
                    onClick={() => onPatch('subs', draft.subs.filter((_, j) => j !== i))}
                    aria-label="ลบขั้นตอนย่อย"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="sub-add"
                onClick={() => onPatch('subs', [...draft.subs, { t: '', done: false }])}
              >
                + เพิ่มขั้นตอนย่อย
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <div className="setting-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flex: 'none' }}>
                <path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" />
              </svg>
              <div style={{ flex: 1, fontWeight: 600, fontSize: 14.5 }}>ทำซ้ำ</div>
              <button
                type="button"
                className="btn"
                style={{ background: 'var(--color-accent-200)', color: 'var(--color-accent-800)', fontSize: 13, padding: '7px 14px' }}
                onClick={() => {
                  const i = REPEATS.indexOf(draft.repeat)
                  onPatch('repeat', REPEATS[(i + 1) % REPEATS.length])
                }}
              >
                {draft.repeat || 'ไม่ซ้ำ'}
              </button>
            </div>
            <div className="setting-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flex: 'none' }}>
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <div style={{ flex: 1, fontWeight: 600, fontSize: 14.5 }}>เตือนล่วงหน้า 30 นาที</div>
              <button
                type="button"
                className={`switch ${draft.remind ? 'is-on' : ''}`}
                onClick={() => onPatch('remind', !draft.remind)}
                aria-pressed={draft.remind}
                aria-label="เตือนล่วงหน้า"
              >
                <span />
              </button>
            </div>
          </div>

          {editing && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ color: 'var(--color-accent-700)', padding: 10 }}
              onClick={onDelete}
            >
              ลบงานนี้
            </button>
          )}
        </div>

        <div className="sheet-actions">
          <button type="button" className="btn btn-secondary" style={{ padding: '14px 20px' }} onClick={onClose}>
            ไว้ก่อน
          </button>
          <button type="button" className="btn btn-primary" style={{ flex: 1, fontSize: 15, padding: 14 }} onClick={onSave}>
            {editing ? 'บันทึกการแก้ไข' : 'จดไว้เลย'}
          </button>
        </div>
      </div>
    </div>
  )
}
