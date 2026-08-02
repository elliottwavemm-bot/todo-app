// ค่าคงที่และ date helpers ของแอป "ค่อยๆ ทำ"

export const PRAISE = [
  'เก่งมาก ไปดื่มน้ำสักแก้ว',
  'ปิดได้อีกหนึ่ง ชีวิตดีขึ้น 3%',
  'ขอปรบมือให้เบาๆ',
  'ตัวจริงเรื่องปิดงาน',
  'อีกนิดเดียวก็ว่างแล้ว',
]

export const PRI = {
  high: { label: 'ด่วน', color: 'var(--color-accent-600)' },
  mid: { label: 'ปกติ', color: 'var(--color-accent-2-600)' },
  low: { label: 'ชิลๆ', color: 'var(--color-neutral-500)' },
}

export const REPEATS = ['', 'ทุกวัน', 'ทุกอาทิตย์', 'ทุกเดือน']
export const TAGS = ['เรียน', 'งานกลุ่ม', 'ชีวิต', 'สุขภาพ', 'ชิล']

export const FOLDER_DEFS = [
  { name: 'เรียน', dot: 'var(--color-accent-500)', bg: 'var(--color-accent-100)' },
  { name: 'งานกลุ่ม', dot: 'var(--color-accent-2-600)', bg: 'var(--color-accent-2-100)' },
  { name: 'ชีวิต', dot: 'var(--color-neutral-600)', bg: 'var(--color-neutral-100)' },
  { name: 'สุขภาพ', dot: 'var(--color-accent-2-500)', bg: 'var(--color-accent-2-100)' },
]

export const DOW_TH = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
export const DAY_FULL_TH = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์']
export const MONTH_TH = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]
export const MONTH_TH_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
]

export function toISO(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayISO() {
  return toISO(new Date())
}

export function addDaysISO(iso, n) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return toISO(d)
}

// จำนวนวันจากวันนี้ถึง due (ลบ = เลยกำหนด)
export function diffDays(dueISO) {
  const a = new Date(todayISO() + 'T00:00:00')
  const b = new Date(dueISO + 'T00:00:00')
  return Math.round((b - a) / 86400000)
}

export function dowOf(iso) {
  return new Date(iso + 'T00:00:00').getDay()
}

export function dateNumOf(iso) {
  return new Date(iso + 'T00:00:00').getDate()
}

// ป้ายเวลาที่มนุษย์อ่าน เช่น "เลยมาแล้ว 1 วัน" / "19:00" / "พรุ่งนี้ 09:00" / "พุธ 5 ส.ค."
export function timeLabel(task) {
  const d = diffDays(task.due)
  if (d < 0) return d === -1 ? 'เลยมาแล้ว 1 วัน' : `เลยมาแล้ว ${-d} วัน`
  if (d === 0) return task.hour
  if (d === 1) return `พรุ่งนี้ ${task.hour}`
  const date = new Date(task.due + 'T00:00:00')
  if (d < 7) return `${DAY_FULL_TH[date.getDay()]} ${task.hour}`
  return `${date.getDate()} ${MONTH_TH_SHORT[date.getMonth()]}`
}

export function bucketOf(task) {
  const d = diffDays(task.due)
  if (d < 0 && !task.done) return 'overdue'
  if (d <= 0) return 'today'
  return 'later'
}

// offset ถึงวันศุกร์ที่จะถึง (อย่างน้อยพรุ่งนี้)
export function toFriday() {
  const dow = new Date().getDay()
  const n = (5 - dow + 7) % 7
  return n === 0 ? 7 : n
}

let seedId = 1
const seed = (offset, hour, title, pri, tag, repeat, done, subs = []) => ({
  id: 'seed-' + seedId++,
  title, pri, tag, repeat, done, subs, hour,
  due: addDaysISO(todayISO(), offset),
  remind: true,
  createdAt: Date.now(),
})

export function makeSeed() {
  seedId = 1
  return [
    seed(-1, '23:59', 'ส่งงานกลุ่มวิชา Marketing', 'high', 'งานกลุ่ม', '', false, [
      { t: 'รวมสไลด์ของทุกคน', done: true },
      { t: 'ทักเพื่อนที่ยังไม่ส่ง', done: false },
    ]),
    seed(0, '19:00', 'อ่านสรุปสถิติ บทที่ 4', 'high', 'เรียน', '', false, [
      { t: 'อ่าน 4.1–4.3', done: true },
      { t: 'ทำแบบฝึกหัด', done: false },
      { t: 'จดสูตรลงการ์ด', done: false },
    ]),
    seed(0, '11:00', 'ตอบเมลอาจารย์ที่ปรึกษา', 'mid', 'เรียน', '', false),
    seed(0, '18:00', 'ซักผ้า ก่อนจะไม่เหลืออะไรใส่', 'low', 'ชีวิต', 'ทุกอาทิตย์', false),
    seed(0, '17:30', 'วิ่งรอบสนาม 3 รอบ', 'mid', 'สุขภาพ', 'จ. พ. ศ.', true),
    seed(1, '09:00', 'เตรียมสไลด์พรีเซนต์ Final', 'high', 'เรียน', '', false, [
      { t: 'ร่างโครงเรื่อง', done: false },
    ]),
    seed(3, '12:00', 'จ่ายค่าหอ', 'mid', 'ชีวิต', 'ทุกเดือน', false),
    seed(6, '21:00', 'ดูซีรีส์ที่ดองไว้ (ภารกิจสำคัญ)', 'low', 'ชิล', '', false),
    seed(2, '20:00', 'สรุปรีดดิ้งวิชาสื่อสารมวลชน', 'mid', 'เรียน', '', false),
  ]
}
