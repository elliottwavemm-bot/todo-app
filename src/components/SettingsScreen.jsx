import { diffDays } from '../data.js'

const TOGGLE_DEFS = [
  { key: 'morning', label: 'สรุปงานตอนเช้า', desc: 'ส่งรายการของวันให้ตอน 8 โมง' },
  { key: 'focus', label: 'โหมดโฟกัส', desc: 'ซ่อนงานของวันอื่น เหลือแต่วันนี้' },
  { key: 'sound', label: 'เสียงตอนติ๊กเสร็จ', desc: 'เสียงเบาๆ ที่ทำให้อยากติ๊กอีก' },
]

const THEMES = [
  { key: 'cream', name: 'ครีม', swatch: '#f5ead8' },
  { key: 'clay', name: 'ดินเผา', swatch: '#d67f48' },
  { key: 'sage', name: 'เซจ', swatch: '#8fa073' },
]

export default function SettingsScreen({ store, onPatch, onReset, onReplayOnboard, go }) {
  const daysUsed = Math.max(1, -diffDays(store.firstUse) + 1)

  return (
    <div className="screen">
      <div className="screen-head" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="button" className="btn btn-icon" onClick={() => go('today')} aria-label="กลับ">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="font-display" style={{ fontSize: 26 }}>ตั้งค่า</h1>
      </div>

      <div className="screen-scroll" style={{ paddingTop: 6, gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 28, background: 'var(--color-surface)' }}>
          <div className="font-display" style={{ width: 52, height: 52, borderRadius: '50%', flex: 'none', background: 'var(--color-accent-2-400)', display: 'grid', placeItems: 'center', fontSize: 20, color: 'var(--color-bg)' }}>
            ค
          </div>
          <div style={{ flex: 1 }}>
            <div className="font-display" style={{ fontSize: 18 }}>ค่อยๆ ทำ</div>
            <div style={{ fontSize: 12.5, opacity: 0.6, marginTop: 1 }}>
              ใช้มาแล้ว {daysUsed} วัน · ทำเสร็จช้าก็ยังนับว่าเสร็จ
            </div>
          </div>
        </div>

        <div style={{ borderRadius: 28, background: 'var(--color-surface)', overflow: 'hidden' }}>
          {TOGGLE_DEFS.map((t, i) => (
            <div
              key={t.key}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px',
                borderBottom: i < TOGGLE_DEFS.length - 1 ? '1px solid var(--color-divider)' : 'none',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{t.label}</div>
                <div style={{ fontSize: 12.5, opacity: 0.6, marginTop: 2, textWrap: 'pretty' }}>{t.desc}</div>
              </div>
              <button
                type="button"
                className={`switch ${store.toggles[t.key] ? 'is-on' : ''}`}
                onClick={() => onPatch({ toggles: { ...store.toggles, [t.key]: !store.toggles[t.key] } })}
                aria-pressed={store.toggles[t.key]}
                aria-label={t.label}
              >
                <span />
              </button>
            </div>
          ))}
        </div>

        <div style={{ padding: 18, borderRadius: 28, background: 'var(--color-accent-100)' }}>
          <div className="font-display" style={{ fontSize: 16, marginBottom: 12 }}>โทนแอป</div>
          <div style={{ display: 'flex', gap: 9 }}>
            {THEMES.map((th) => (
              <button
                key={th.key}
                type="button"
                onClick={() => onPatch({ theme: th.key })}
                style={{
                  flex: 1, cursor: 'pointer', padding: '11px 8px', borderRadius: 20,
                  border: '2.5px solid',
                  borderColor: store.theme === th.key ? 'var(--color-accent)' : 'var(--color-divider)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  background: 'var(--color-bg)',
                }}
              >
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: th.swatch, border: '1px solid var(--color-divider)' }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{th.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <button type="button" className="btn btn-secondary" style={{ padding: 13 }} onClick={onReplayOnboard}>
            ดูวิธีใช้อีกครั้ง
          </button>
          <button type="button" className="btn btn-ghost" style={{ padding: 13 }} onClick={onReset}>
            รีเซ็ตงานตัวอย่าง
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: 12, opacity: 0.45, paddingTop: 4 }}>
          ค่อยๆ ทำ · เวอร์ชัน 1.0 · ทำเสร็จช้าก็ยังนับว่าเสร็จ
        </div>
      </div>
    </div>
  )
}
