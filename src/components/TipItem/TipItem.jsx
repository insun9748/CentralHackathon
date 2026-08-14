import './TipItem.scss'

function TipItem({ emoji, title, lines }) {
  return (
    <li className="tip-item">
      <p className="tip-item-title">{emoji} {title}</p>
      <div className="tip-item-desc">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </li>
  )
}

export default TipItem
