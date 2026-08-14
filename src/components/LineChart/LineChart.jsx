import './LineChart.scss'

const WIDTH = 238
const HEIGHT = 90

function LineChart({ points, max, className = '' }) {
  const slotWidth = WIDTH / points.length
  const coords = points.map((point, i) => ({
    x: slotWidth * (i + 0.5),
    y: HEIGHT - (point.value / max) * HEIGHT,
  }))
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ')
  const yTicks = Array.from({ length: max + 1 }, (_, i) => max - i)

  return (
    <div className={`line-chart ${className}`.trim()}>
      <div className="line-chart-plot">
        <div className="line-chart-y-axis">
          {yTicks.map((tick) => (
            <span key={tick} className="line-chart-y-label">{tick}</span>
          ))}
        </div>
        <div className="line-chart-svg-wrap">
          <svg className="line-chart-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
            <line className="line-chart-axis-line" x1="0" x2="0" y1="0" y2={HEIGHT} />
            <line className="line-chart-axis-line" x1="0" x2={WIDTH} y1={HEIGHT} y2={HEIGHT} />
            <path className="line-chart-line" d={linePath} fill="none" />
          </svg>
          {coords.map((c, i) => (
            <span
              key={i}
              className="line-chart-dot"
              style={{ left: `${(c.x / WIDTH) * 100}%`, top: `${(c.y / HEIGHT) * 100}%` }}
            />
          ))}
        </div>
      </div>
      <div className="line-chart-x-axis">
        {points.map((point) => (
          <div key={point.label} className="line-chart-x-label">
            <p className="line-chart-x-label-main">{point.label}</p>
            <p className="line-chart-x-label-range">{point.range}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LineChart
