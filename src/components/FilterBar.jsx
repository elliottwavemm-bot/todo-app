const FILTERS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'active', label: 'ยังไม่เสร็จ' },
  { key: 'done', label: 'เสร็จแล้ว' },
]

export default function FilterBar({ filter, onChange, remaining }) {
  return (
    <div className="filter-bar">
      <div className="filter-group" role="tablist" aria-label="กรองรายการงาน">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            className={`filter-button ${filter === key ? 'is-active' : ''}`}
            onClick={() => onChange(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <span className="remaining-count">
        เหลือ <strong>{remaining}</strong>
      </span>
    </div>
  )
}
