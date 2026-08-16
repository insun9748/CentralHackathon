import { useNavigate } from 'react-router-dom'
import FactorList from '../FactorList/FactorList.jsx'
import SafetyNotice from '../SafetyNotice/SafetyNotice.jsx'
import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg'
import './FactorDetailPage.scss'

function FactorDetailPage({ title, descriptionLines, variant, topFactors, otherFactorsTitle, otherFactors }) {
  const navigate = useNavigate()

  return (
    <div className="factor-detail-wrap">
      <header className="factor-detail-header">
        <img
          src={arrowLeftIcon}
          alt="뒤로가기"
          className="factor-detail-back-btn"
          onClick={() => navigate(-1)}
        />
        <h2 className="factor-detail-title">{title}</h2>
      </header>

      <p className="factor-detail-desc">
        {descriptionLines.map((line, i) => (
          <span key={i}>
            {line}
            {i < descriptionLines.length - 1 && <br />}
          </span>
        ))}
      </p>

      <FactorList
        className="factor-detail-card"
        variant={variant}
        title={topFactors.title}
        subtitle={topFactors.subtitle}
        items={topFactors.items}
      />

      <FactorList
        className="factor-detail-card"
        variant="plain"
        title={otherFactorsTitle}
        items={otherFactors}
      />

      <SafetyNotice />
    </div>
  )
}

export default FactorDetailPage
