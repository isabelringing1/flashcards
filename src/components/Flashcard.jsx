export default function Flashcard({ card, flipped, onFlip }) {
  return (
    <div className="flashcard" onClick={onFlip}>
      <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`}>
        <div className="flashcard-face flashcard-front">
          <div className="card-word">{card.word2}</div>
        </div>
        <div className="flashcard-face flashcard-back">
          <div className="card-word card-word-kr">{card.word1}</div>
        </div>
      </div>
    </div>
  )
}
