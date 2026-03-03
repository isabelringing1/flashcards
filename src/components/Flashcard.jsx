import { useSpeech } from "react-text-to-speech";
import { useEffect } from "react";

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

const highlightStyle = {
  style: {
    backgroundColor: "rgba(107, 138, 205, 0.3)",
    borderRadius: "4px",
    padding: "0 2px",
    color: "#fbbf24",
  },
};

export default function Flashcard({
  card,
  flipped,
  onFlip,
  realismEn,
  realismKr,
  speechActionsRef,
  onSpeakingChange,
}) {
  const frontText = realismEn
    ? realismEn.map((p, i) => p.highlight ? p.text.toLowerCase() : p.text).join("")
    : card.word2;
  const backText = realismKr
    ? realismKr.map((p) => p.text).join("")
    : card.word1;

  const {
    Text: FrontText,
    speechStatus: frontStatus,
    start: startFront,
    stop: stopFront,
  } = useSpeech({
    text: frontText,
    lang: "en-US",
    highlightText: true,
    highlightMode: "word",
    highlightProps: highlightStyle,
  });

  const {
    Text: BackText,
    speechStatus: backStatus,
    start: startBack,
    stop: stopBack,
  } = useSpeech({
    text: backText,
    lang: "ko-KR",
    highlightText: true,
    highlightMode: "word",
    highlightProps: highlightStyle,
  });

  const isSpeaking = frontStatus === "started" || backStatus === "started";

  useEffect(() => {
    if (onSpeakingChange) onSpeakingChange(isSpeaking);
  }, [isSpeaking, onSpeakingChange]);

  useEffect(() => {
    if (speechActionsRef) {
      speechActionsRef.current = {
        speak: (front) => {
          stopFront();
          stopBack();
          if (front) startFront();
          else startBack();
        },
        stop: () => {
          stopFront();
          stopBack();
        },
      };
    }
  }, [startFront, stopFront, startBack, stopBack, speechActionsRef]);

  const frontSpeaking = frontStatus === "started";
  const backSpeaking = backStatus === "started";
  return (
    <div className="flashcard" onClick={onFlip}>
      <div className={`flashcard-inner ${flipped ? "flipped" : ""}`}>
        <div className="flashcard-face flashcard-front">
          {realismEn ? (
            <div className="card-realism" style={{ fontSize: realismEn.map((p) => p.text).join("").length > 150 ? "24px" : "36px" }}>
              {frontSpeaking ? (
                <FrontText />
              ) : (
                <RealismContent parts={realismEn} />
              )}
            </div>
          ) : (
            <div className="card-word">
              <FrontText />
            </div>
          )}
        </div>
        <div className="flashcard-face flashcard-back">
          {realismKr ? (
            <div className="card-realism card-realism-kr" style={{ fontSize: realismEn.map((p) => p.text).join("").length > 150 ? "36px" : "42px" }}>
              {backSpeaking ? (
                <BackText />
              ) : (
                <RealismContent parts={realismKr} />
              )}
            </div>
          ) : (
            <div className="card-word card-word-kr">
              <BackText />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
