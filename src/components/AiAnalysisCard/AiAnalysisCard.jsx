import checkDone from '../../assets/Home/img/ai-check-done.svg'
import checkPending from '../../assets/Home/img/ai-check-pending.svg'
import './AiAnalysisCard.scss'

function AiAnalysisCard({ fields, revealedCount, done, editable = false, onChange, className = '' }) {
  const total = fields.length

  return (
    <div className={`ai-analysis-card ${className}`.trim()}>
      <div className="ai-analysis-header">
        {done ? (
          <>
            <img src={checkDone} alt="" className="ai-analysis-header-icon" />
            <span className="ai-analysis-header-done">분석 완료 {total}/{total}</span>
          </>
        ) : (
          <span className="ai-analysis-header-progress">원문기록 분석중... {revealedCount}/{total}</span>
        )}
      </div>

      <ul className="ai-analysis-list">
        {fields.map((field, index) => {
          const isDone = done || index < revealedCount
          const isEditingRow = isDone && editable
          return (
            <li key={field.id} className={`ai-analysis-item${isDone ? ' is-done' : ''}`}>
              <span className="ai-analysis-item-label">{field.label}</span>
              {isEditingRow ? (
                field.options ? (
                  <select
                    className="ai-analysis-item-input"
                    value={field.value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="ai-analysis-item-input"
                    value={field.value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                  />
                )
              ) : (
                <span className="ai-analysis-item-value">{isDone ? field.value : '...'}</span>
              )}
              <img
                src={isDone ? checkDone : checkPending}
                alt=""
                className="ai-analysis-item-check"
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default AiAnalysisCard
