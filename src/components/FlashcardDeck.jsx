import { useState, useEffect } from 'react'
import Flashcard from './Flashcard'

export default function FlashcardDeck({ cards, name }) {
  const [deck, setDeck] = useState([])
  const [idx, setIdx] = useState(0)
  const [known, setKnown] = useState([])
  const [unknown, setUnknown] = useState([])
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setDeck([...cards])
    setIdx(0)
    setKnown([])
    setUnknown([])
    setFlipped(false)
  }, [cards, name])

  const done = idx >= deck.length
  const card = deck[idx]

  function markKnown() {
    setKnown((k) => [...k, card])
    setFlipped(false)
    setIdx((i) => i + 1)
  }

  function markUnknown() {
    setUnknown((u) => [...u, card])
    setFlipped(false)
    setIdx((i) => i + 1)
  }

  function keepStudyingMissed() {
    const shuffled = [...unknown].sort(() => Math.random() - 0.5)
    setDeck(shuffled)
    setIdx(0)
    setKnown([])
    setUnknown([])
    setFlipped(false)
  }

  function restart() {
    setDeck([...cards])
    setIdx(0)
    setKnown([])
    setUnknown([])
    setFlipped(false)
  }

  if (done && deck.length > 0) {
    return (
      <div className="deck-done">
        <h2>Set Complete!</h2>
        <div className="deck-done-stats">
          <div className="stat stat-known">
            <span className="stat-num">{known.length}</span>
            <span className="stat-label">Known</span>
          </div>
          <div className="stat stat-unknown">
            <span className="stat-num">{unknown.length}</span>
            <span className="stat-label">To Review</span>
          </div>
        </div>
        <div className="deck-done-actions">
          {unknown.length > 0 && (
            <button className="btn-primary" onClick={keepStudyingMissed}>
              Keep Studying Missed Words
            </button>
          )}
          <button className="btn-secondary" onClick={restart}>
            Restart
          </button>
        </div>
      </div>
    )
  }

  if (!card) return null

  return (
    <div className="deck">
      <div className="deck-header">
        <h2 className="deck-name">{name}</h2>
        <span className="deck-progress">
          {idx + 1} / {deck.length}
        </span>
      </div>

      <Flashcard
        key={idx}
        card={card}
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
      />

      <div className="deck-actions">
        <button
          className="btn-action btn-unknown"
          onClick={markUnknown}
          title="Don't know"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <button
          className="btn-action btn-known"
          onClick={markKnown}
          title="Know it"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((idx) / deck.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
