"use client"
import { useState, useMemo } from "react"
import Icon from "./Icon"
import { useGamification } from "../GamificationContext"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const DOW = ["M", "T", "W", "T", "F", "S", "S"]

function dateKey(y, m, d) { return `${y}-${m + 1}-${d}` }
function isSameDate(a, b) { return a?.getFullYear() === b?.getFullYear() && a?.getMonth() === b?.getMonth() && a?.getDate() === b?.getDate() }

/**
 * InteractiveCalendar
 * Props:
 *  - builtinEvents: array of { day (1-31 in current month OR date string), type: class|due|event|personal, title, time }
 *  - tone: "pink" | "purple" | "lime" | "ink" | "white" (card color)
 *  - compact: boolean (smaller padding for dashboard)
 *  - showAdd: boolean (show add event form)
 */
export default function InteractiveCalendar({
  builtinEvents = [],
  tone = "pink",
  compact = false,
  showAdd = true,
}) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [selectedKey, setSelectedKey] = useState(dateKey(now.getFullYear(), now.getMonth(), now.getDate()))
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", type: "class", time: "" })

  const { personalEvents, addPersonalEvent, removePersonalEvent } = useGamification()

  // Normalize builtin events to dateKey form when day is a number in the current view month
  const eventsByKey = useMemo(() => {
    const map = {}
    function add(ev, dateKey) {
      if (!map[dateKey]) map[dateKey] = []
      map[dateKey].push(ev)
    }
    builtinEvents.forEach((ev) => {
      if (typeof ev.day === "number") {
        add(ev, dateKey(viewYear, viewMonth, ev.day))
      } else if (ev.date) {
        const d = new Date(ev.date)
        add(ev, dateKey(d.getFullYear(), d.getMonth(), d.getDate()))
      }
    })
    personalEvents.forEach((ev) => {
      if (ev.date) {
        const d = new Date(ev.date)
        add({ ...ev, type: ev.type || "personal", user: true }, dateKey(d.getFullYear(), d.getMonth(), d.getDate()))
      }
    })
    return map
  }, [builtinEvents, personalEvents, viewYear, viewMonth])

  // Build calendar cells
  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    // Monday-first (JS getDay: Sun=0..Sat=6)
    let startDow = firstDay.getDay() - 1
    if (startDow < 0) startDow = 6
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const result = []
    for (let i = 0; i < startDow; i++) result.push({ empty: true, key: `e${i}` })
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ day: d, key: dateKey(viewYear, viewMonth, d) })
    }
    return result
  }, [viewYear, viewMonth])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }
  function goToday() {
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
    setSelectedKey(dateKey(now.getFullYear(), now.getMonth(), now.getDate()))
  }

  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate())
  const selectedEvents = eventsByKey[selectedKey] || []

  function handleAdd(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    // Parse date from selectedKey
    const [y, m, d] = selectedKey.split("-").map(Number)
    const iso = new Date(y, m - 1, d, form.time ? parseInt(form.time.split(":")[0]) : 12, form.time ? parseInt(form.time.split(":")[1]) : 0).toISOString()
    addPersonalEvent({ date: iso, title: form.title.trim(), type: form.type, time: form.time || "12:00", user: true })
    setForm({ title: "", type: "class", time: "" })
    setShowForm(false)
  }

  const toneCard = {
    pink: "pink", purple: "purple", lime: "lime", ink: "ink", yellow: "yellow", white: "",
  }[tone]

  const onDark = tone === "ink" || tone === "purple" || tone === "pink"
  const textCol = onDark ? "#fff" : "var(--ink)"

  return (
    <div className={`card ${toneCard}`} style={{ padding: compact ? 18 : 26, color: textCol }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{
          width: compact ? 38 : 44, height: compact ? 38 : 44, borderRadius: 14,
          background: onDark ? "#fff" : "var(--ink)", color: onDark ? "var(--ink)" : "var(--lime)",
          border: "2.5px solid var(--ink)", display: "inline-flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="calendar" size={compact ? 18 : 22} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: compact ? 14 : 15 }}>
            {MONTHS[viewMonth]} {viewYear}
          </div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Tap a day to see events</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={prevMonth} aria-label="Previous month" className="cal-nav" style={navBtn(onDark)}>
            <Icon name="chevron-left" size={16} />
          </button>
          <button onClick={goToday} aria-label="Today" className="cal-nav" style={{ ...navBtn(onDark), fontSize: 10, fontFamily: "var(--font-head)", fontWeight: 800 }}>
            TODAY
          </button>
          <button onClick={nextMonth} aria-label="Next month" className="cal-nav" style={navBtn(onDark)}>
            <Icon name="chevron-right" size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6, textAlign: "center" }}>
        {DOW.map((d, i) => <div key={i} style={{ padding: 4 }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((c) => {
          if (c.empty) return <div key={c.key} />
          const evs = eventsByKey[c.key] || []
          const first = evs[0]
          const isToday = c.key === todayKey
          const isSelected = c.key === selectedKey
          let bg = "#fff", col = "var(--ink)"
          if (first) {
            bg = eventColor(first.type)
            col = eventTextColor(first.type)
          }
          return (
            <button
              key={c.key}
              onClick={() => setSelectedKey(c.key)}
              className="cal-cell"
              style={{
                background: bg,
                color: col,
                outline: isSelected ? "3px solid var(--ink)" : isToday ? "2px dashed var(--ink)" : "none",
                outlineOffset: isSelected ? 1 : 0,
                position: "relative",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <span style={{ fontWeight: 800 }}>{c.day}</span>
              {evs.length > 1 && (
                <span style={{ position: "absolute", bottom: 3, right: 4, fontSize: 9, fontWeight: 900 }}>
                  +{evs.length - 1}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        <Legend color="var(--lime)" label="Class" dark={onDark} />
        <Legend color="var(--pink)" label="Due" dark={onDark} />
        <Legend color="var(--purple)" label="Event" dark={onDark} />
        <Legend color="var(--yellow)" label="Personal" dark={onDark} />
      </div>

      {/* Selected day events */}
      <div style={{ marginTop: 16, borderTop: onDark ? "2px solid rgba(255,255,255,0.2)" : "2px solid var(--ink)", paddingTop: 14 }}>
        <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: compact ? 13 : 14, marginBottom: 10 }}>
          {selectedKey === todayKey ? "Today" : formatKey(selectedKey)} ({selectedEvents.length})
        </div>
        {selectedEvents.length === 0 && (
          <p style={{ fontSize: 13, opacity: 0.85, marginBottom: 10 }}>No events planned. Tap Add to schedule something.</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {selectedEvents.map((ev, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              borderRadius: 12,
              border: "2px solid var(--ink)",
              background: eventColor(ev.type),
              color: ev.type === "due" || ev.type === "event" ? "#fff" : "var(--ink)",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ink)", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 13 }}>{ev.title}</div>
                <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>{formatTime(ev.time)}</div>
              </div>
              {ev.user && (
                <button onClick={() => removePersonalEvent(ev.id)} aria-label="Remove" style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  color: "inherit", fontWeight: 900, fontSize: 14, padding: "0 4px",
                }}>
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        {showAdd && (
          <>
            {!showForm ? (
              <button onClick={() => setShowForm(true)} className="btn btn-sm" style={{ marginTop: 12, fontSize: 12, padding: "8px 14px" }}>
                <Icon name="plus" size={13} /> Add Event
              </button>
            ) : (
              <form onSubmit={handleAdd} style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  className="input"
                  placeholder="Event title (e.g. Study Python)"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{ padding: "10px 14px", fontSize: 13, margin: 0 }}
                  autoFocus
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="input"
                    style={{ padding: "10px 12px", fontSize: 13, margin: 0, flex: 1 }}
                  >
                    <option value="class">Class</option>
                    <option value="due">Deadline</option>
                    <option value="event">Event</option>
                    <option value="personal">Personal</option>
                  </select>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="input"
                    style={{ padding: "10px 12px", fontSize: 13, margin: 0, width: 120 }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="submit" className="btn btn-lime btn-sm" style={{ fontSize: 12, flex: 1, cursor: "pointer" }}>Save</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-sm" style={{ fontSize: 12, cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function navBtn(onDark) {
  return {
    width: 30, height: 30, borderRadius: 10,
    border: "2px solid var(--ink)",
    background: onDark ? "rgba(255,255,255,0.12)" : "#fff",
    color: "inherit",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
  }
}

function eventColor(type) {
  if (type === "class") return "var(--lime)"
  if (type === "due") return "var(--pink)"
  if (type === "event") return "var(--purple)"
  if (type === "personal") return "var(--yellow)"
  return "var(--yellow)"
}
function eventTextColor(type) {
  if (type === "due" || type === "event" || type === "purple") return "#fff"
  return "var(--ink)"
}

function Legend({ color, label, dark }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 10, height: 10, background: color, border: "2px solid var(--ink)", borderRadius: 3 }} />
      {label}
    </span>
  )
}

function formatKey(k) {
  const [y, m, d] = k.split("-").map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
}

function formatTime(t) {
  if (!t) return ""
  const [hStr, mStr] = t.split(":")
  let h = parseInt(hStr), m = parseInt(mStr)
  if (isNaN(h)) return t
  const suffix = h >= 12 ? "pm" : "am"
  h = h % 12 || 12
  return `${h}:${(mStr || "00").padStart(2, "0")} ${suffix}`
}
