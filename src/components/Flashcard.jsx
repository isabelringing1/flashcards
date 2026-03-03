function RealismContent({ parts }) {
  return parts.map((part, i) =>
    part.highlight ? (
      <span key={i} className="realism-highlight">
        {part.text.toLowerCase()}
      </span>
    ) : (
      <span key={i}>{part.text}</span>
    ),
  );
}

export default function Flashcard({
  card,
  flipped,
  onFlip,
  realismEn,
  realismKr,
}) {
  return (
    <div className="flashcard" onClick={onFlip}>
      <div className={`flashcard-inner ${flipped ? "flipped" : ""}`}>
        <div className="flashcard-face flashcard-front">
          {realismEn ? (
            <div className="card-realism">
              <RealismContent parts={realismEn} />
            </div>
          ) : (
            <div className="card-word">{card.word2} </div>
          )}
        </div>
        <div className="flashcard-face flashcard-back">
          {realismKr ? (
            <div className="card-realism card-realism-kr">
              <RealismContent parts={realismKr} />
            </div>
          ) : (
            <div className="card-word card-word-kr">{card.word1}</div>
          )}
        </div>
      </div>
    </div>
  );
}
