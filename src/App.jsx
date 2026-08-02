import { useEffect, useRef, useState } from 'react'
import { makeSeed, PRAISE, todayISO, addDaysISO, toFriday } from './data.js'
import Onboarding from './components/Onboarding.jsx'
import TodayScreen from './components/TodayScreen.jsx'
import AllScreen from './components/AllScreen.jsx'
import WeekScreen from './components/WeekScreen.jsx'
import StatsScreen from './components/StatsScreen.jsx'
import SettingsScreen from './components/SettingsScreen.jsx'
import TabBar from './components/TabBar.jsx'
import Sheet from './components/Sheet.jsx'

const STORE = 'kaui-tam-v1'

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE)
    const s = raw ? JSON.parse(raw) : {}
    return {
      tasks: Array.isArray(s.tasks) ? s.tasks : makeSeed(),
      toggles: { morning: true, focus: false, sound: true, ...s.toggles },
      theme: s.theme || 'cream',
      onboarded: !!s.onboarded,
      firstUse: s.firstUse || todayISO(),
      doneLog: s.doneLog || {},
    }
  } catch {
    return {
      tasks: makeSeed(),
      toggles: { morning: true, focus: false, sound: true },
      theme: 'cream',
      onboarded: false,
      firstUse: todayISO(),
      doneLog: {},
    }
  }
}

// เสียงป๊อกเบาๆ ตอนติ๊กเสร็จ
function playTick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(660, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(990, ctx.currentTime + 0.08)
    g.gain.setValueAtTime(0.12, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
    o.connect(g).connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.2)
    o.onended = () => ctx.close()
  } catch {
    /* ไม่มีเสียงก็ไม่เป็นไร */
  }
}

export default function App() {
  const [store, setStore] = useState(loadStore)
  const [screen, setScreen] = useState(() => (loadStore().onboarded ? 'today' : 'onboard'))
  const [sheet, setSheet] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify(store))
  }, [store])

  useEffect(() => {
    document.documentElement.dataset.theme = store.theme
  }, [store.theme])

  const say = (msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }

  const patchStore = (patch) => setStore((s) => ({ ...s, ...patch }))

  const go = (s) => {
    setScreen(s)
    setSheet(null)
  }

  const toggleTask = (id) => {
    setStore((s) => {
      let praised = false
      const tasks = s.tasks.map((t) => {
        if (t.id !== id) return t
        if (!t.done) praised = true
        return { ...t, done: !t.done }
      })
      const doneLog = { ...s.doneLog }
      const key = todayISO()
      if (praised) {
        doneLog[key] = (doneLog[key] || 0) + 1
        if (s.toggles.sound) playTick()
        say(PRAISE[Math.floor(Math.random() * PRAISE.length)])
      } else {
        doneLog[key] = Math.max(0, (doneLog[key] || 0) - 1)
      }
      return { ...s, tasks, doneLog }
    })
  }

  const openSheet = (id) => {
    const t = id ? store.tasks.find((x) => x.id === id) : null
    setEditingId(id || null)
    setSheet(
      t
        ? {
            title: t.title, pri: t.pri, tag: t.tag,
            when: whenOf(t), subs: t.subs.map((x) => ({ ...x })),
            repeat: t.repeat, remind: t.remind !== false,
          }
        : { title: '', pri: 'mid', tag: 'เรียน', when: 'today', subs: [], repeat: '', remind: true },
    )
  }

  const whenOf = (t) => {
    const diff = Math.round(
      (new Date(t.due + 'T00:00:00') - new Date(todayISO() + 'T00:00:00')) / 86400000,
    )
    if (diff <= 0) return 'today'
    if (diff === 1) return 'tomorrow'
    if (diff <= toFriday()) return 'week'
    return 'someday'
  }

  const saveSheet = () => {
    const d = sheet
    const title = (d.title || '').trim() || 'งานที่ยังไม่ได้ตั้งชื่อ'
    const dueMap = {
      today: 0,
      tomorrow: 1,
      week: toFriday(),
      someday: 7,
    }
    if (editingId) {
      setStore((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === editingId
            ? { ...t, title, pri: d.pri, tag: d.tag, repeat: d.repeat, remind: d.remind, subs: d.subs.filter((x) => x.t.trim()) }
            : t,
        ),
      }))
      say('แก้ให้แล้ว')
    } else {
      const due = addDaysISO(todayISO(), dueMap[d.when])
      const task = {
        id: crypto.randomUUID(),
        title, pri: d.pri, tag: d.tag, repeat: d.repeat, remind: d.remind,
        subs: d.subs.filter((x) => x.t.trim()),
        done: false, hour: '20:00', due, createdAt: Date.now(),
      }
      setStore((s) => ({ ...s, tasks: [...s.tasks, task] }))
      setScreen(dueMap[d.when] === 0 ? 'today' : 'all')
      say('จดไว้ให้แล้ว ค่อยๆ ทำนะ')
    }
    setSheet(null)
    setEditingId(null)
  }

  const deleteTask = () => {
    if (!editingId) return
    setStore((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== editingId) }))
    setSheet(null)
    setEditingId(null)
    say('ลบให้แล้ว')
  }

  const resetData = () => {
    patchStore({ tasks: makeSeed() })
    say('คืนค่างานตัวอย่างแล้ว')
  }

  const finishOnboard = () => {
    patchStore({ onboarded: true })
    go('today')
  }

  const common = {
    tasks: store.tasks,
    toggles: store.toggles,
    onToggleTask: toggleTask,
    onOpenTask: openSheet,
    go,
  }

  return (
    <div className="app">
      {screen === 'onboard' && <Onboarding onDone={finishOnboard} />}
      {screen === 'today' && <TodayScreen {...common} onAdd={() => openSheet(null)} />}
      {screen === 'all' && <AllScreen {...common} />}
      {screen === 'week' && <WeekScreen {...common} />}
      {screen === 'stats' && <StatsScreen tasks={store.tasks} doneLog={store.doneLog} />}
      {screen === 'settings' && (
        <SettingsScreen
          store={store}
          onPatch={patchStore}
          onReset={resetData}
          onReplayOnboard={() => go('onboard')}
          go={go}
        />
      )}

      {toast && (
        <div className="toast-wrap">
          <div className="toast">{toast}</div>
        </div>
      )}

      {sheet && (
        <Sheet
          draft={sheet}
          editing={!!editingId}
          onPatch={(k, v) => setSheet((s) => ({ ...s, [k]: v }))}
          onClose={() => { setSheet(null); setEditingId(null) }}
          onSave={saveSheet}
          onDelete={deleteTask}
        />
      )}

      {screen !== 'onboard' && (
        <TabBar screen={screen} go={go} onAdd={() => openSheet(null)} />
      )}
    </div>
  )
}
