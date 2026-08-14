import './FactorList.scss'

function FactorList({ title, subtitle, items, variant, className = '' }) {
  return (
    <div className={`factor-list factor-list-${variant} ${className}`.trim()}>
      <div className="factor-list-header">
        <p className="factor-list-title">{title}</p>
        <p className="factor-list-subtitle">{subtitle}</p>
      </div>
      <ul className="factor-list-items">
        {items.map((item) => (
          <li key={item.rank} className="factor-list-item">
            <span className="factor-list-item-name">
              <span className="factor-list-item-rank">{item.rank}</span>
              <span className="factor-list-item-label">{item.name}</span>
            </span>
            <span className="factor-list-item-detail">{item.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FactorList
