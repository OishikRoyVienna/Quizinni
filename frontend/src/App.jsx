import { useEffect, useState } from 'react'
import Djinn from './Djinn.jsx'
import Backdrop from './Backdrop.jsx'
import Confetti from './Confetti.jsx'
import { getHint, getQuestion, health, sendAnswer, uploadPdf } from './api.js'
import './App.css'

const STEPS = [100, 200, 500, 1000, 2000, 4000, 8000, 16000]
const SAFE = [2, 5] // Sicherheitsstufen (Index)

export default function App() {
  const [status, setStatus] = useState(null) // Antwort von /health
  const [level, setLevel] = useState(0)
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [mood, setMood] = useState('idle')
  const [speech, setSpeech] = useState('Salam! Ich bin der Djinni des Wissens. Lade dein Skript als PDF hoch, und ich verwandle es in Quizfragen!')
  const [busy, setBusy] = useState(false)
  const [jokers, setJokers] = useState({ hint: true, swap: true })
  const [confetti, setConfetti] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    health().then(setStatus).catch(() => setSpeech('Ich erreiche das Backend nicht. Läuft es auf Port 2002?'))
  }, [])

  function say(text, newMood = 'talk', ms = 1500) {
    setSpeech(text)
    setMood(newMood)
    if (ms) setTimeout(() => setMood('idle'), ms)
  }

  async function onUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    say(`Ich lese ${file.name}…`, 'think', 0)
    try {
      const res = await uploadPdf(file)
      setStatus(await health())
      say(`Fertig! ${res.chunks} Abschnitte gelernt. Bereit für die erste Frage?`)
    } catch (err) {
      say(err.message, 'sad', 2500)
    } finally {
      setBusy(false)
    }
  }

  async function nextQuestion(lvl = level) {
    setBusy(true)
    setAnswer('')
    say('Ich suche eine passende Frage raus…', 'think', 0)
    try {
      const q = await getQuestion(lvl + 1)
      setQuestion(q)
      say(q.question)
    } catch (err) {
      say(err.message, 'sad', 2500)
    } finally {
      setBusy(false)
    }
  }

  async function submit() {
    if (!answer.trim()) {
      setError('Gib zuerst eine Antwort ein.')
      return
    }
    setBusy(true)
    say('Hmm, lass mich nachdenken…', 'think', 0)
    try {
      const res = await sendAnswer(question.question, question.answer, answer)
      if (res.verdict === 'richtig') {
        say(res.feedback, 'happy', 1600)
        setConfetti((c) => c + 1)
        const next = Math.min(level + 1, STEPS.length - 1)
        setLevel(next)
        setTimeout(() => nextQuestion(next), 3500)
      } else if (res.verdict === 'teilweise') {
        say(`Fast! ${res.feedback} Du darfst nachbessern.`, 'talk')
      } else if (res.verdict === 'blockiert') {
        say(res.feedback, 'sad', 2500)
      } else {
        const fallback = [...SAFE].reverse().find((s) => s < level) ?? 0
        say(`Leider nicht. ${res.feedback} Zurück auf Stufe ${fallback + 1}.`, 'sad', 3000)
        setLevel(fallback)
        setTimeout(() => nextQuestion(fallback), 5000)
      }
    } catch (err) {
      say(err.message, 'sad', 2500)
    } finally {
      setBusy(false)
    }
  }

  async function useHint() {
    setJokers((j) => ({ ...j, hint: false }))
    setBusy(true)
    say('Moment, ich schau ins Skript…', 'think', 0)
    try {
      const res = await getHint(question.question, question.answer)
      say(`Tipp: ${res.hint}`)
    } finally {
      setBusy(false)
    }
  }

  function useSwap() {
    setJokers((j) => ({ ...j, swap: false }))
    nextQuestion()
  }

  const hasMaterial = status?.sources?.length > 0

  return (
    <div className="app">
      <Backdrop />
      <Confetti trigger={confetti} />
      <header className="topbar">
        <h1>Quizinni</h1>
        <label className="upload">
          {busy ? '…' : 'PDF hochladen'}
          <input type="file" accept="application/pdf" onChange={onUpload} disabled={busy} hidden />
        </label>
      </header>

      <main className="layout">
        <section className="stage">
          <div className="host">
            <Djinn mood={mood} />
            <div className="bubble" key={speech}>{speech}</div>
          </div>

          {question && (
            <div className="question-card">
              <p className="meta">
                Stufe {level + 1} · {question.topic} · {question.source}, S. {question.page}
              </p>
              <p className="question">{question.question}</p>
              <textarea
                rows={3}
                value={answer}
                placeholder="Deine Antwort in eigenen Worten"
                onChange={(e) => { setAnswer(e.target.value); setError('') }}
                disabled={busy}
              />
              {error && <p className="error">{error}</p>}
              <div className="actions">
                <div className="jokers">
                  <button onClick={useHint} disabled={!jokers.hint || busy}>Hinweis</button>
                  <button onClick={useSwap} disabled={!jokers.swap || busy}>Tauschen</button>
                </div>
                <button className="primary" onClick={submit} disabled={busy}>Einloggen</button>
              </div>
            </div>
          )}

          {!question && hasMaterial && (
            <button className="primary start" onClick={() => nextQuestion(0)} disabled={busy}>
              Spiel starten
            </button>
          )}
        </section>

        <aside className="ladder">
          {[...STEPS].reverse().map((pts, ri) => {
            const i = STEPS.length - 1 - ri
            const cls = [i === level && 'current', i < level && 'done', SAFE.includes(i) && 'safe']
              .filter(Boolean).join(' ')
            return (
              <div key={i} className={`step ${cls}`}>
                <span>{i + 1}</span>
                <span>{pts.toLocaleString('de-DE')}</span>
              </div>
            )
          })}
          {status && <p className="sources">Material: {status.sources.join(', ') || '–'}</p>}
        </aside>
      </main>
    </div>
  )
}
