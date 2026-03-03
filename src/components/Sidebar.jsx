import { useState } from 'react'
import { createPortal } from 'react-dom'

const DIFF_LETTER = { EASY: 'E', INTERMEDIATE: 'I', ADVANCED: 'A' }
const DIFF_CLASS = { EASY: 'diff-easy', INTERMEDIATE: 'diff-inter', ADVANCED: 'diff-adv' }

function SetButton({ set, onClick }) {
  const [tooltipPos, setTooltipPos] = useState(null)
  const tooltipContent = set.cards.map(c => `${c.word1} → ${c.word2}`).join('\n')

  function handleMouseEnter(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.top
    const flipUp = spaceBelow < 320
    setTooltipPos({
      left: rect.right + 8,
      ...(flipUp
        ? { bottom: window.innerHeight - rect.bottom }
        : { top: rect.top }),
    })
  }

  return (
    <button
      className="sidebar-item"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setTooltipPos(null)}
    >
      <span className="sidebar-item-name">{set.name}</span>
      {set.difficulty && (
        <span className={`diff-badge ${DIFF_CLASS[set.difficulty]}`}>
          {DIFF_LETTER[set.difficulty]}
        </span>
      )}
      {tooltipPos && createPortal(
        <div
          className="sidebar-tooltip"
          style={{
            display: 'block',
            position: 'fixed',
            top: tooltipPos.top,
            bottom: tooltipPos.bottom,
            left: tooltipPos.left,
          }}
        >
          {tooltipContent}
        </div>,
        document.body
      )}
    </button>
  )
}

export default function Sidebar({
  currentSet,
  onPracticeWeekly,
  onRemix,
  onRandom,
  previousSets,
  allSets,
  onSelectSet,
  hasRemixSets,
  realismMode,
  onToggleRealism,
}) {
  const grouped = {}
  for (const set of allSets) {
    if (!grouped[set.theme]) grouped[set.theme] = []
    grouped[set.theme].push(set)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Flashcards</div>

      <div className="sidebar-section">
        <button
          className="btn-primary full-width"
          onClick={onPracticeWeekly}
          disabled={!currentSet}
        >
          Practice This Week's Set
        </button>
        {hasRemixSets && (
          <button
            className="btn-secondary full-width"
            onClick={onRemix}
          >
            Remix
          </button>
        )}
        <button
          className="btn-secondary full-width"
          onClick={onRandom}
        >
          Random Set
        </button>
        <label className="toggle-row" onClick={onToggleRealism}>
          <span className="toggle-label">Realism Mode</span>
          <span className={`toggle-switch ${realismMode ? 'toggle-on' : ''}`}>
            <span className="toggle-knob" />
          </span>
        </label>
      </div>

      {previousSets.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">Previous Sets</h3>
          <div className="sidebar-list">
            {previousSets.map((item, i) => (
              <SetButton
                key={`${item.setId}-${i}`}
                set={item.set}
                onClick={() => onSelectSet(item.set)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="sidebar-section">
        <h3 className="sidebar-title">All Sets</h3>
        <div className="sidebar-list">
          {Object.entries(grouped).map(([theme, sets]) => (
            <div key={theme} className="sidebar-group">
              <h4 className="sidebar-theme">{theme}</h4>
              {sets.map((set) => (
                <SetButton
                  key={set.id}
                  set={set}
                  onClick={() => onSelectSet(set)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
