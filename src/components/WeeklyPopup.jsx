import { POS_LABELS } from '../data/languages'

export default function WeeklyPopup({ set, onConfirm, onReroll }) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <h2>This Week's Set</h2>
          <p className="popup-set-name">{set.name}</p>
        </div>

        <div className="popup-words">
          {set.cards.map((card, i) => (
            <div key={i} className="popup-row">
              <span className="popup-word-kr">{card.word1}</span>
              <span className="popup-pos">{POS_LABELS[card.pos]}</span>
              <span className="popup-word-en">{card.word2}</span>
            </div>
          ))}
        </div>

        <div className="popup-actions">
          <button className="btn-secondary" onClick={onReroll}>
            Roll New Set
          </button>
          <button className="btn-primary" onClick={onConfirm}>
            Start Practicing
          </button>
        </div>
      </div>
    </div>
  )
}
