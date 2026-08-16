import { useState } from 'react'
import EmojiFace from '../EmojiFace/EmojiFace.jsx'
import './LineChart.scss'

const WIDTH = 238
const HEIGHT = 90
const GUIDE_LINE_HEIGHT = 149
const EMOJI_SIZE = 17
const MAX_EMOJI_LEVEL = 5
const TOOLTIP_OFFSET = 8

function LineChart({ points, max, className = '' }) {
  const [activeIndex, setActiveIndex] = useState(null)

  const slotWidth = WIDTH / points.length
  const coords = points.map((point, i) => ({
    x: slotWidth * (i + 0.5),
    y: HEIGHT - (point.value / max) * HEIGHT,
  }))
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ')
  const yTicks = Array.from({ length: max + 1 }, (_, i) => max - i)

  const handleDotClick = (index) => {
    setActiveIndex((current) => (current === index ? null : index))
  }

  const activePoint = activeIndex !== null ? points[activeIndex] : null
  const activeCoord = activeIndex !== null ? coords[activeIndex] : null
  const activeLeft = activeCoord ? `${(activeCoord.x / WIDTH) * 100}%` : null
  const activeTop = activeCoord ? `${(activeCoord.y / HEIGHT) * 100}%` : null

  // 툴팁이 차트 밖으로 잘리지 않도록, 점의 위치에 따라 좌/우·위/아래로 방향을 바꿔서 붙임.
  // 뾰족한(각진) 모서리를 점 쪽으로 둬서 말풍선이 그 점을 가리키는 것처럼 보이게 함.
  const anchorRight = activeCoord ? activeCoord.x / WIDTH <= 0.5 : true
  const anchorBelow = activeCoord ? activeCoord.y / HEIGHT <= 0.5 : true
  const ROUND = '10px'
  const SQUARE = '0'
  // 순서: top-left top-right bottom-right bottom-left
  const borderRadius = [
    anchorRight && anchorBelow ? SQUARE : ROUND, // top-left
    !anchorRight && anchorBelow ? SQUARE : ROUND, // top-right
    !anchorRight && !anchorBelow ? SQUARE : ROUND, // bottom-right
    anchorRight && !anchorBelow ? SQUARE : ROUND, // bottom-left
  ].join(' ')
  const tooltipStyle = activeCoord
    ? {
        left: activeLeft,
        top: activeTop,
        transform: `translate(${anchorRight ? `${TOOLTIP_OFFSET}px` : `calc(-100% - ${TOOLTIP_OFFSET}px)`}, ${
          anchorBelow ? `${TOOLTIP_OFFSET}px` : `calc(-100% - ${TOOLTIP_OFFSET}px)`
        })`,
        borderRadius,
      }
    : null

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

          {activeCoord && (
            <span
              className="line-chart-guide"
              style={{ left: activeLeft, height: `${GUIDE_LINE_HEIGHT}px` }}
            />
          )}

          {coords.map((c, i) => (
            <button
              key={i}
              type="button"
              className={`line-chart-dot${activeIndex === i ? ' line-chart-dot-active' : ''}`}
              style={{ left: `${(c.x / WIDTH) * 100}%`, top: `${(c.y / HEIGHT) * 100}%` }}
              onClick={() => handleDotClick(i)}
              aria-label={`${points[i].label} 입덧강도 ${points[i].value}`}
            />
          ))}

          {activeCoord && (
            <span className="line-chart-emoji" style={{ left: activeLeft, top: activeTop }}>
              <EmojiFace
                level={Math.min(MAX_EMOJI_LEVEL, Math.max(0, Math.round(activePoint.value)))}
                selected
                size={EMOJI_SIZE}
              />
            </span>
          )}

          {activeCoord && (activePoint.avgIntensity !== undefined || activePoint.mainCause) && (
            <span className="line-chart-tooltip" style={tooltipStyle}>
              {activePoint.avgIntensity !== undefined && (
                <span className="line-chart-tooltip-row">
                  <span className="line-chart-tooltip-label">평균입덧 강도</span>
                  <span className="line-chart-tooltip-value line-chart-tooltip-value-mint">
                    {activePoint.avgIntensity}
                  </span>
                </span>
              )}
              {activePoint.mainCause && (
                <span className="line-chart-tooltip-row">
                  <span className="line-chart-tooltip-label">주요 원인</span>
                  <span className="line-chart-tooltip-value line-chart-tooltip-value-red">
                    {activePoint.mainCause}
                  </span>
                </span>
              )}
            </span>
          )}
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
