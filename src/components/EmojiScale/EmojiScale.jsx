import EmojiFace from '../EmojiFace/EmojiFace.jsx'
import './EmojiScale.scss'

function EmojiScale({ levels, value, onChange }) {
  return (
    <div className="emoji-scale">
      {levels.map((level) => {
        const isSelected = value === level

        return (
          <button
            type="button"
            key={level}
            className={`emoji-scale-item${isSelected ? ' emoji-scale-item-active' : ''}`}
            onClick={() => onChange(level)}
            aria-pressed={isSelected}
            aria-label={`입덧강도 ${level}`}
          >
            <EmojiFace className="emoji-scale-face" level={level} selected={isSelected} />
            <span className="emoji-scale-label">{level}</span>
          </button>
        )
      })}
    </div>
  )
}

export default EmojiScale
