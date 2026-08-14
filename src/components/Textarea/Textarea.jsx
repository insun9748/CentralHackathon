import './Textarea.scss'

function Textarea({ value, onChange, placeholderMain, placeholderHint, children, className = '' }) {
  return (
    <div className={`textarea-wrap ${className}`.trim()}>
      <textarea className="textarea-field" value={value} onChange={onChange} />
      {!value && (
        <div className="textarea-placeholder">
          <p className="textarea-placeholder-main">{placeholderMain}</p>
          {placeholderHint && <p className="textarea-placeholder-hint">{placeholderHint}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export default Textarea
