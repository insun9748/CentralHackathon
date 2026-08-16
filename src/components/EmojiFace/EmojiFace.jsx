import { emojiFaces } from '../EmojiScale/faces.js'
import './EmojiFace.scss'

const NATIVE_SIZE = 46

function EmojiFace({ level, selected = false, size = NATIVE_SIZE, className = '' }) {
  const face = selected ? emojiFaces[level].selected : emojiFaces[level].default
  const scale = size / NATIVE_SIZE

  return (
    <span className={`emoji-face ${className}`.trim()} style={{ width: size, height: size }}>
      <span className="emoji-face-scaler" style={{ transform: `scale(${scale})` }}>
        <img className="emoji-face-bg" src={face.bg} alt="" />
        {face.layers.map((layer, i) => {
          const style = {
            top: `${layer.top}%`,
            left: `${layer.left}%`,
            width: `${layer.size[0]}px`,
            height: `${layer.size[1]}px`,
            transform: layer.transform,
          }

          if (layer.path) {
            const [vw, vh] = layer.path.viewBox
            return (
              <svg key={i} className="emoji-face-layer" style={style} viewBox={`0 0 ${vw} ${vh}`}>
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

          return <img key={i} className="emoji-face-layer" src={layer.src} alt="" style={style} />
        })}
      </span>
    </span>
  )
}

export default EmojiFace
