import './LineChart.scss'

const WIDTH = 238
const HEIGHT = 90

function LineChart({ points, max, className = '' }) {
  const stepX = WIDTH / (points.length - 1)
  const coords = points.map((point, i) => ({
    x: i * stepX,
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
        <svg className="line-chart-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
          {yTicks.map((tick) => (
            <line
              key={tick}
              className="line-chart-grid-line"
              x1="0"
              x2={WIDTH}
              y1={HEIGHT - (tick / max) * HEIGHT}
              y2={HEIGHT - (tick / max) * HEIGHT}
            />
          ))}
          <path className="line-chart-line" d={linePath} fill="none" />
          {coords.map((c, i) => (
            <circle key={i} className="line-chart-dot" cx={c.x} cy={c.y} r="4" />
          ))}
        </svg>
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
