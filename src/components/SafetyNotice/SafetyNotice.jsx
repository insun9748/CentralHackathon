import warningIcon from '../../assets/Report/img/warning-icon.svg'
import './SafetyNotice.scss'

function SafetyNotice({ className = '' }) {
  return (
    <div className={`safety-notice ${className}`.trim()}>
      <div className="safety-notice-header">
        <img src={warningIcon} alt="" />
        <span>의료 안전 안내</span>
      </div>
      <p className="safety-notice-text">
        반복적인 구토, 수분 섭취 불가, 극심한 어지러움이 지속되는 경우에는 즉시 의료기관에 상담하세요. 이
        리포트는 진단·처방을 대체하지 않습니다.
      </p>
    </div>
  )
}

export default SafetyNotice
