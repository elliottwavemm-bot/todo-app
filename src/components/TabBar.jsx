const ICONS = {
  today: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" />
      <path d="m4.9 4.9 1.4 1.4" /><path d="m17.7 17.7 1.4 1.4" /><path d="M2 12h2" />
      <path d="M20 12h2" /><path d="m6.3 17.7-1.4 1.4" /><path d="m19.1 4.9-1.4 1.4" />
    </svg>
  ),
  all: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z" />
    </svg>
  ),
  week: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4" /><path d="M16 3v4" /><path d="M3 11h18" />
    </svg>
  ),
  stats: (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 20V11" /><path d="M12 20V4" /><path d="M19 20v-6" />
    </svg>
  ),
}

const TABS = [
  { key: 'today', label: 'วันนี้' },
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'week', label: 'สัปดาห์' },
  { key: 'stats', label: 'สถิติ' },
]

export default function TabBar({ screen, go, onAdd }) {
  const tab = (t) => (
    <button
      key={t.key}
      type="button"
      className={`tab-btn ${screen === t.key ? 'is-active' : ''}`}
      onClick={() => go(t.key)}
    >
      {ICONS[t.key]}
      <span>{t.label}</span>
    </button>
  )
  return (
    <div className="tabbar-wrap">
      <div className="tabbar">
        {tab(TABS[0])}
        {tab(TABS[1])}
        <div style={{ flex: 'none', width: 64, display: 'flex', justifyContent: 'center' }}>
          <button type="button" className="tab-fab" onClick={onAdd} aria-label="เพิ่มงานใหม่">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5v14" />
            </svg>
          </button>
        </div>
        {tab(TABS[2])}
        {tab(TABS[3])}
      </div>
    </div>
  )
}
