// Hintergrund: Nachthimmel mit Sternen, Halbmond und Palast-Silhouette.
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * 100,
  y: (Math.sin(i * 78.233) * 12345.6789 % 1 + 1) % 1 * 60,
  r: i % 7 === 0 ? 1.8 : 1,
  delay: (i % 10) * 0.4,
}))

function Arch({ x, y }) {
  return <path d={`M${x} ${y} v-12 a6 6 0 0 1 12 0 v12 Z`} fill="#E8B04A" opacity="0.75" />
}

export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <svg className="backdrop__sky" viewBox="0 0 100 60" preserveAspectRatio="none">
        {STARS.map((s, i) => (
          <circle key={i} className="star" cx={s.x} cy={s.y} r={s.r * 0.12} style={{ animationDelay: `${s.delay}s` }} />
        ))}
      </svg>

      <svg className="backdrop__moon" viewBox="0 0 100 100">
        <mask id="crescent">
          <rect width="100" height="100" fill="#fff" />
          <circle cx="68" cy="40" r="36" fill="#000" />
        </mask>
        <circle cx="50" cy="50" r="40" fill="#F6E7B8" mask="url(#crescent)" />
      </svg>

      <svg className="backdrop__palace" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax slice">
        <g fill="#080f2a">
          {/* Linke Häuser */}
          <rect x="0" y="160" width="300" height="60" />
          <rect x="60" y="130" width="90" height="90" />
          <path d="M70 130 C55 115, 85 100, 105 85 C125 100, 155 115, 140 130 Z" />
          <rect x="200" y="145" width="70" height="75" />
          {/* Minarett links */}
          <rect x="360" y="60" width="22" height="160" />
          <rect x="354" y="100" width="34" height="6" />
          <path d="M356 60 C350 50, 362 40, 371 28 C380 40, 392 50, 386 60 Z" />
          <rect x="370" y="10" width="2" height="20" />
          {/* Hauptpalast */}
          <rect x="420" y="120" width="360" height="100" />
          <path d="M520 120 C470 90, 540 50, 600 15 C660 50, 730 90, 680 120 Z" />
          <rect x="599" y="0" width="2" height="18" />
          <path d="M430 120 C412 104, 440 88, 460 72 C480 88, 508 104, 490 120 Z" />
          <path d="M710 120 C692 104, 720 88, 740 72 C760 88, 788 104, 770 120 Z" />
          {/* Minarett rechts */}
          <rect x="818" y="60" width="22" height="160" />
          <rect x="812" y="100" width="34" height="6" />
          <path d="M814 60 C808 50, 820 40, 829 28 C838 40, 850 50, 844 60 Z" />
          <rect x="828" y="10" width="2" height="20" />
          {/* Rechte Häuser */}
          <rect x="880" y="150" width="320" height="70" />
          <rect x="960" y="120" width="100" height="100" />
          <path d="M970 120 C955 104, 990 90, 1010 74 C1030 90, 1065 104, 1050 120 Z" />
          <rect x="1110" y="140" width="60" height="80" />
        </g>
        {/* Erleuchtete Fenster */}
        {[450, 480, 540, 580, 620, 660, 720, 750].map((x) => <Arch key={x} x={x} y={175} />)}
        {[540, 594, 648].map((x) => <Arch key={x} x={x} y={145} />)}
        <Arch x={99} y={170} />
        <Arch x={229} y={180} />
        <Arch x={1004} y={165} />
        <Arch x={1134} y={185} />
        <Arch x={365} y={90} />
        <Arch x={823} y={90} />
      </svg>
    </div>
  )
}
