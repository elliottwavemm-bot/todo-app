import { useState } from 'react'

const STEPS = [
  {
    title: 'ค่อยๆ ทำ ทีละอย่าง',
    body: 'รายการงานที่ไม่กดดันคุณ แค่บอกว่าวันนี้มีอะไรรออยู่ แล้วค่อยไล่ทำไปทีละข้อ',
  },
  {
    title: 'จดตอนคิดออก\nทำตอนพร้อม',
    body: 'พิมพ์ชื่องาน เลือกวัน ใส่แท็ก จบใน 5 วินาที ที่เหลือเดี๋ยวแอปเตือนให้เอง',
  },
  {
    title: 'ทำเสร็จแล้วได้ปรบมือ',
    body: 'ทุกครั้งที่ติ๊กเสร็จ เราจะนับสตรีคให้ ไม่ได้ทำก็ไม่เป็นไร พรุ่งนี้เริ่มใหม่ได้',
  },
]

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const last = step === STEPS.length - 1

  return (
    <div className="screen" style={{ padding: 'calc(28px + var(--safe-top)) 30px calc(28px + var(--safe-bottom))' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="font-display" style={{ fontSize: 17, color: 'var(--color-accent-700)' }}>
          ค่อยๆ ทำ
        </div>
        <button type="button" className="btn btn-ghost" style={{ fontSize: 13 }} onClick={onDone}>
          ข้าม
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30 }}>
        <div style={{ position: 'relative', height: 200 }}>
          <div style={{ position: 'absolute', left: 0, top: 14, width: 172, height: 172, borderRadius: '50%', background: 'var(--color-accent-200)' }} />
          <div style={{ position: 'absolute', left: 96, top: 0, width: 132, height: 132, borderRadius: '50%', background: 'var(--color-accent-2-200)' }} />
          <div style={{ position: 'absolute', left: 56, top: 74, width: 118, height: 118, borderRadius: 44, background: 'var(--color-accent-500)', boxShadow: 'var(--shadow-md)', display: 'grid', placeItems: 'center' }}>
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div style={{ position: 'absolute', right: 6, bottom: 8, width: 56, height: 56, borderRadius: '50%', background: 'var(--color-accent-2-500)' }} />
        </div>
        <div>
          <h1 className="font-display" style={{ fontSize: 34, lineHeight: 1.25, marginBottom: 12, whiteSpace: 'pre-line', textWrap: 'pretty' }}>
            {STEPS[step].title}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, opacity: 0.72, textWrap: 'pretty' }}>
            {STEPS[step].body}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ display: 'flex', gap: 7, flex: 1 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                height: 8, borderRadius: 999, transition: '.25s',
                width: i === step ? 26 : 8,
                background: i === step ? 'var(--color-accent)' : 'var(--color-neutral-400)',
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="btn btn-primary"
          style={{ fontSize: 15, padding: '13px 26px' }}
          onClick={() => (last ? onDone() : setStep(step + 1))}
        >
          {last ? 'เริ่มเลย' : 'ต่อไป'}
        </button>
      </div>
    </div>
  )
}
