import { useState, useEffect, useRef } from "react";
import Flashcard from "./Flashcard";
import realismPhrases from "../data/realismPhrases.json";

function getParticle(koreanWord, pos) {
  if (pos == 1 || pos == 2) {
    //verb or adj
    return "";
  }
  const lastChar = koreanWord.charAt(koreanWord.length - 1);
  const code = lastChar.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    return (code - 0xac00) % 28 !== 0 ? "이" : "가";
  }
  return "이";
}

function processRealismText(template, card) {
  let text = template;
  console.log(card);
  text = text.replace(/\{word2\}\{이\/가\}/g, () => {
    return `\x01${card.word1 + getParticle(card.word1, card.pos)}\x01`;
  });
  text = text.replace(/\{word1\}/g, `\x01${card.word2}\x01`);
  text = text.replace(/\{word2\}/g, `\x01${card.word1}\x01`);
  const parts = text.split("\x01");
  return parts
    .map((part, i) => ({
      text: part,
      highlight: i % 2 === 1,
    }))
    .filter((p) => p.text);
}

function cardKey(card) {
  return `${card.word1}:${card.word2}`;
}

export default function FlashcardDeck({ cards, name, onShuffle, realismMode }) {
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [exitDirection, setExitDirection] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speechActionsRef = useRef(null);
  const xCountsRef = useRef({});
  const displayCountsRef = useRef({});

  useEffect(() => {
    setDeck([...cards]);
    setIdx(0);
    setKnown([]);
    setUnknown([]);
    setFlipped(false);
    setExitDirection(null);
    setAnimating(false);
  }, [cards, name]);

  const done = idx >= deck.length;
  const card = deck[idx];

  function stopSpeech() {
    if (speechActionsRef.current) speechActionsRef.current.stop();
    setIsSpeaking(false);
  }

  function markKnown() {
    if (animating) return;
    stopSpeech();
    setKnown((k) => [...k, card]);
    setExitDirection("right");
    setAnimating(true);
  }

  function markUnknown() {
    if (animating) return;
    stopSpeech();
    setUnknown((u) => [...u, card]);
    setExitDirection("left");
    setAnimating(true);
    if (realismMode) {
      const key = cardKey(card);
      xCountsRef.current = {
        ...xCountsRef.current,
        [key]:
          (xCountsRef.current && xCountsRef.current[key]
            ? xCountsRef.current[key]
            : 0) + 1,
      };
    }
  }

  function handleAnimationEnd() {
    setExitDirection(null);
    setAnimating(false);
    setFlipped(false);
    setIdx((i) => i + 1);
  }

  function handleShuffle() {
    if (onShuffle) onShuffle();
  }

  function keepStudyingMissed() {
    const shuffled = [...unknown].sort(() => Math.random() - 0.5);
    displayCountsRef.current = { ...xCountsRef.current };
    setDeck(shuffled);
    setIdx(0);
    setKnown([]);
    setUnknown([]);
    setFlipped(false);
  }

  function restart() {
    setDeck([...cards]);
    setIdx(0);
    setKnown([]);
    setUnknown([]);
    setFlipped(false);
    xCountsRef.current = {};
    displayCountsRef.current = {};
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
    );
  }

  if (!card) return null;

  let realismEn = null;
  let realismKr = null;
  if (realismMode && card) {
    const count =
      (displayCountsRef.current && displayCountsRef.current[cardKey(card)]) ||
      0;
    if (count > 0) {
      const phraseIdx = Math.min(count - 1, realismPhrases.length - 1);
      const phrase = realismPhrases[phraseIdx];
      realismEn = processRealismText(phrase.en, card);
      realismKr = processRealismText(phrase.kr, card);
    }
  }

  const cardClass = exitDirection
    ? `card-exit card-exit-${exitDirection}`
    : "card-enter";

  return (
    <div className="deck">
      <div className="deck-header">
        <h2 className="deck-name">{name}</h2>
        <div className="deck-header-right">
          <button
            className="btn-shuffle"
            onClick={handleShuffle}
            title="Shuffle & restart"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </button>
          <span className="deck-progress">
            {idx + 1} / {deck.length}
          </span>
        </div>
      </div>

      <div
        className={cardClass}
        onAnimationEnd={exitDirection ? handleAnimationEnd : undefined}
      >
        <Flashcard
          key={idx}
          card={card}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          realismEn={realismEn}
          realismKr={realismKr}
          speechActionsRef={speechActionsRef}
          onSpeakingChange={setIsSpeaking}
        />
      </div>

      <button
        className={`btn-speak${isSpeaking ? " speaking" : ""}`}
        onClick={() => {
          if (isSpeaking) {
            stopSpeech();
          } else if (speechActionsRef.current) {
            speechActionsRef.current.speak(!flipped);
          }
        }}
        title={isSpeaking ? "Stop" : "Speak"}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      </button>

      <div className="deck-actions">
        <button
          className="btn-action btn-unknown"
          onClick={markUnknown}
          disabled={animating}
          title="Don't know"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <button
          className="btn-action btn-known"
          onClick={markKnown}
          disabled={animating}
          title="Know it"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
