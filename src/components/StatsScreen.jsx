import { addDaysISO, todayISO, dowOf, DOW_TH, FOLDER_DEFS, diffDays } from '../data.js'

export default function StatsScreen({ tasks, doneLog }) {
  const today = todayISO()

  // สตรีค: จำนวันติดกันที่ปิดงานได้อย่างน้อย 1 งาน (นับถอยหลังจากวันนี้)
  let streak = 0
  for (let i = 0; ; i++) {
    const iso = addDaysISO(today, -i)
    if ((doneLog[iso] || 0) > 0) streak++
    else if (i === 0) continue // วันนี้ยังไม่ปิดงานก็ยังไม่ตัดสตรีคของเมื่อวาน
    else break
    if (i > 365) break
  }

  // % งานสัปดาห์นี้ (งานที่ due ภายใน ±7 วัน)
  const weekTasks = tasks.filter((t) => Math.abs(diffDays(t.due)) <= 7)
  const weekDone = weekTasks.filter((t) => t.done).length
  const weekPct = weekTasks.length ? Math.round((weekDone / weekTasks.length) * 100) : 0

  // แท่ง 7 วันล่าสุดจาก log การปิดงาน
  const bars = Array.from({ length: 7 }, (_, i) => {
    const iso = addDaysISO(today, i - 6)
    return { n: doneLog[iso] || 0, dow: DOW_TH[dowOf(iso)], isToday: i === 6 }
  })
  const maxBar = Math.max(1, ...bars.map((b) => b.n))
  const avg = (bars.reduce((a, b) => a + b.n, 0) / 7).toFixed(1)

  // แบ่งตามหมวด
  const catRows = FOLDER_DEFS.map((f) => {
    const items = tasks.filter((t) => t.tag === f.name)
    const done = items.filter((t) => t.done).length
    return {
      name: f.name, color: f.dot, n: items.length,
      pct: items.length ? Math.round((done / items.length) * 100) : 0,
    }
  })
  const topCat = [...catRows].sort((a, b) => b.pct - a.pct)[0]
  const lowCat = [...catRows].sort((a, b) => a.pct - b.pct)[0]

  return (
    <div className="screen">
      <div className="screen-head">
        <h1 className="h-display" style={{ marginTop: 0 }}>ความคืบหน้า</h1>
      </div>

      <div className="screen-scroll" style={{ gap: 14 }}>
        <div style={{ display: 'flex', gap: 11 }}>
          <div style={{ flex: 1, padding: 18, borderRadius: 28, background: 'var(--color-accent-500)', color: 'var(--color-bg)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5" />
            </svg>
            <div className="font-display" style={{ fontSize: 36, lineHeight: 1.1, marginTop: 10 }}>{streak}</div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>วันติดกันที่ปิดงานได้</div>
          </div>
          <div style={{ flex: 1, padding: 18, borderRadius: 28, background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{
              width: 82, height: 82, borderRadius: '50%', display: 'grid', placeItems: 'center',
              background: `conic-gradient(var(--color-accent-500) ${weekPct * 3.6}deg, var(--color-neutral-300) 0)`,
            }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--color-surface)', display: 'grid', placeItems: 'center' }} className="font-display">
                <span style={{ fontSize: 18 }}>{weekPct}%</span>
              </div>
            </div>
            <div style={{ fontSize: 12.5, opacity: 0.65, textAlign: 'center' }}>งานที่ปิดได้สัปดาห์นี้</div>
          </div>
        </div>

        <div style={{ padding: '20px 18px', borderRadius: 28, background: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="font-display" style={{ fontSize: 17, whiteSpace: 'nowrap' }}>7 วันล่าสุด</div>
            <div style={{ fontSize: 12.5, opacity: 0.6, whiteSpace: 'nowrap' }}>เฉลี่ย {avg} งาน/วัน</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 9, height: 120 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: 11, opacity: 0.55, fontWeight: 600 }}>{b.n}</div>
                <div style={{
                  width: '100%', borderRadius: 999,
                  height: `${10 + (b.n / maxBar) * 72}px`,
                  background: b.isToday ? 'var(--color-accent-500)' : 'var(--color-accent-2-400)',
                }} />
                <div style={{ fontSize: 11, opacity: 0.55 }}>{b.dow}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 18px', borderRadius: 28, background: 'var(--color-accent-2-100)' }}>
          <div className="font-display" style={{ fontSize: 17, marginBottom: 14 }}>แบ่งตามหมวด</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {catRows.map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 66, flex: 'none', fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                <div style={{ flex: 1, height: 10, borderRadius: 999, background: 'rgba(32,30,29,.08)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 999, width: `${c.pct}%`, background: c.color }} />
                </div>
                <div style={{ width: 34, textAlign: 'right', fontSize: 12.5, opacity: 0.6 }}>{c.n}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, fontSize: 13.5, lineHeight: 1.6, opacity: 0.75, textWrap: 'pretty' }}>
            {topCat.n > 0
              ? `หมวด${topCat.name}คืบหน้าสุดในตอนนี้ ส่วนหมวด${lowCat.name}ยังเงียบอยู่ ลองเริ่มจากงานเล็กๆ สักข้อก็นับแล้วนะ`
              : 'ยังไม่มีข้อมูลพอ ลองเพิ่มงานแล้วค่อยๆ ปิดดูสักสองสามข้อ'}
          </div>
        </div>
      </div>
    </div>
  )
}
