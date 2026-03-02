import { POS_LABELS } from '../data/languages'

export default function Flashcard({ card, flipped, onFlip }) {
  return (
    <div className="flashcard" onClick={onFlip}>
      <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`}>
        <div className="flashcard-face flashcard-front">
          <span className="pos-badge">{POS_LABELS[card.pos]}</span>
          <div className="card-word">{card.word2}</div>
          <span className="card-hint">click to flip</span>
        </div>
        <div className="flashcard-face flashcard-back">
          <span className="pos-badge">{POS_LABELS[card.pos]}</span>
          <div className="card-word card-word-kr">{card.word1}</div>
        </div>
      </div>
    </div>
  )
}
