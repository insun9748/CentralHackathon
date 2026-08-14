import { emojiFaces } from './faces'
import './EmojiScale.scss'

function EmojiScale({ levels, value, onChange }) {
  return (
    <div className="emoji-scale">
      {levels.map((level) => {
        const isSelected = value === level
        const face = isSelected ? emojiFaces[level].selected : emojiFaces[level].default

        return (
          <button
            type="button"
            key={level}
            className={`emoji-scale-item${isSelected ? ' emoji-scale-item-active' : ''}`}
            onClick={() => onChange(level)}
            aria-pressed={isSelected}
            aria-label={`입덧강도 ${level}`}
          >
            <span className="emoji-scale-face">
              <img className="emoji-scale-face-bg" src={face.bg} alt="" />
              {face.layers.map((layer, i) => {
                const style = {
                  top: `${layer.top}%`,
                  left: `${layer.left}%`,
                  // Render at the SVG's exact native size (1:1, undistorted) so every
                  // layer's authored stroke-width (0.7) renders the same across levels —
                  // stretching a thin layer's box independently thickens its stroke.
                  width: `${layer.size[0]}px`,
                  height: `${layer.size[1]}px`,
                  transform: layer.transform,
                }

                if (layer.path) {
                  const [vw, vh] = layer.path.viewBox
                  return (
                    <svg
                      key={i}
                      className="emoji-scale-face-layer"
                      style={style}
                      viewBox={`0 0 ${vw} ${vh}`}
                    >
                      <path
                        d={layer.path.d}
                        stroke={layer.path.stroke}
                        strokeWidth="0.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  )
                }

                return <img key={i} className="emoji-scale-face-layer" src={layer.src} alt="" style={style} />
              })}
            </span>
            <span className="emoji-scale-label">{level}</span>
          </button>
        )
      })}
    </div>
  )
}

export default EmojiScale
