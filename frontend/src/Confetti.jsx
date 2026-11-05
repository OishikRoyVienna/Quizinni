import { useEffect, useState } from 'react'

const COLORS = ['#E8B04A', '#FAD38A', '#2FB39A', '#C0392B', '#7A2E6E']

// Bei jeder Änderung von `trigger` regnet es Konfetti.
export default function Confetti({ trigger }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!trigger) return
    setPieces(
      Array.from({ length: 60 }, (_, i) => ({
        id: `${trigger}-${i}`,
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        duration: 1.5 + Math.random() * 1.5,
        delay: Math.random() * 0.4,
      })),
    )
    const t = setTimeout(() => setPieces([]), 3500)
    return () => clearTimeout(t)
  }, [trigger])

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
