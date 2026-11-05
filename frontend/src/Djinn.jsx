// Maskottchen: der Djinni des Wissens. mood: idle | happy | sad | think | talk
export default function Djinn({ mood = 'idle' }) {
  const skin = '#2FB39A'
  const skinDark = '#1D8C78'
  const gold = '#E8B04A'
  const goldDark = '#BA7517'
  const ink = '#14213D'

  return (
    <svg className={`djinn djinn--${mood}`} viewBox="0 0 220 270" role="img" aria-label="Djinni des Wissens">
      {/* Oberkörper, Rauchschweif und Kopf: schwebt über der Lampe */}
      <g className="djinn__spirit">
        <g className="djinn__tail">
          <path
            d="M105 170 C80 190, 90 215, 125 212 C160 209, 170 225, 182 228 C165 232, 150 222, 128 224 C85 228, 62 195, 95 165 Z"
            fill="#5DCAA5"
            opacity="0.9"
          />
        </g>

        {/* Arme (drehen sich um die Schulter) */}
        <g className="djinn__arm djinn__arm--l">
          <ellipse cx="62" cy="148" rx="12" ry="28" transform="rotate(25 62 148)" fill={skinDark} />
          <ellipse cx="57" cy="165" rx="11" ry="4" fill={gold} />
          <circle cx="54" cy="174" r="10" fill={skin} />
        </g>
        <g className="djinn__arm djinn__arm--r">
          <ellipse cx="158" cy="148" rx="12" ry="28" transform="rotate(-25 158 148)" fill={skinDark} />
          <ellipse cx="163" cy="165" rx="11" ry="4" fill={gold} />
          <circle cx="166" cy="174" r="10" fill={skin} />
        </g>

        {/* Oberkörper mit Weste */}
        <path d="M75 120 C70 150, 85 175, 110 180 C135 175, 150 150, 145 120 C135 110, 85 110, 75 120 Z" fill={skin} />
        <path d="M75 120 C72 145, 82 165, 98 175 L100 122 Z" fill="#7A2E6E" stroke={gold} strokeWidth="2" />
        <path d="M145 120 C148 145, 138 165, 122 175 L120 122 Z" fill="#7A2E6E" stroke={gold} strokeWidth="2" />
        <circle cx="110" cy="150" r="3" fill={gold} />

        {/* Kopf */}
        <path d="M82 80 L64 66 L84 94 Z" fill={skin} />
        <path d="M138 80 L156 66 L136 94 Z" fill={skin} />
        <circle cx="73" cy="90" r="4" fill="none" stroke={gold} strokeWidth="2" />
        <ellipse cx="110" cy="84" rx="30" ry="33" fill={skin} />

        {/* Augenbrauen */}
        <g className="djinn__brow djinn__brow--l">
          <path d="M90 70 Q98 65 105 70" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
        <g className="djinn__brow djinn__brow--r">
          <path d="M115 70 Q122 65 130 70" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>

        {/* Augen */}
        <ellipse cx="98" cy="82" rx="7" ry="8" fill="#fff" />
        <ellipse cx="122" cy="82" rx="7" ry="8" fill="#fff" />
        <g className="djinn__pupil">
          <circle cx="99" cy="83" r="3.5" fill={ink} />
          <circle cx="123" cy="83" r="3.5" fill={ink} />
        </g>
        <rect className="djinn__lid" x="90" y="73" width="16" height="18" rx="8" fill={skin} />
        <rect className="djinn__lid" x="114" y="73" width="16" height="18" rx="8" fill={skin} />

        {/* Nase, Schnurrbart, Mund, Spitzbart */}
        <path d="M110 86 Q114 93 109 95" stroke={skinDark} strokeWidth="2" fill="none" />
        <path className="djinn__mouth-smile" d="M100 106 Q110 114 120 106" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path className="djinn__mouth-sad" d="M100 110 Q110 102 120 110" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse className="djinn__mouth-open" cx="110" cy="107" rx="6" ry="5" fill={ink} />
        <path d="M95 99 C100 94, 106 95, 110 98 C114 95, 120 94, 125 99 C120 100, 114 100, 110 101 C106 100, 100 100, 95 99 Z" fill={ink} />
        <path d="M104 114 L110 128 L116 114 Z" fill={ink} />

        {/* Turban mit Edelstein und Feder */}
        <path d="M110 50 C105 35, 112 20, 122 12 C119 27, 117 40, 113 50 Z" fill="#7A2E6E" />
        <path d="M77 68 C70 40, 98 28, 110 30 C122 28, 150 40, 143 68 C126 60, 94 60, 77 68 Z" fill="#F4E9D8" />
        <path d="M80 60 C98 52, 122 52, 140 60" stroke={gold} strokeWidth="3" fill="none" />
        <circle cx="110" cy="54" r="7" fill={gold} />
        <circle cx="110" cy="54" r="4.5" fill="#C0392B" />

        {/* Funkeln bei richtiger Antwort */}
        <g className="djinn__sparkles" fill={gold}>
          <path d="M40 60 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" />
          <path d="M178 50 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" />
          <path d="M185 110 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z" />
        </g>
      </g>

      {/* Wunderlampe */}
      <g className="djinn__lamp">
        <path d="M70 238 C45 230, 45 256, 68 252" stroke={gold} strokeWidth="6" fill="none" />
        <path d="M150 240 L186 224 L180 236 L152 252 Z" fill={gold} />
        <ellipse cx="110" cy="245" rx="48" ry="16" fill={gold} />
        <ellipse cx="96" cy="240" rx="14" ry="4" fill="#FAD38A" />
        <ellipse cx="110" cy="230" rx="22" ry="7" fill={goldDark} />
        <circle cx="110" cy="222" r="5" fill={goldDark} />
        <ellipse cx="110" cy="261" rx="22" ry="6" fill={goldDark} />
      </g>
    </svg>
  )
}
