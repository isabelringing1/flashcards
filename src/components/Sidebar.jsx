export default function Sidebar({
  currentSet,
  onPracticeWeekly,
  onRemix,
  previousSets,
  allSets,
  onSelectSet,
  hasRemixSets,
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
        <button
          className="btn-secondary full-width"
          onClick={onRemix}
          disabled={!hasRemixSets}
        >
          Remix
        </button>
      </div>

      {previousSets.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">Previous Sets</h3>
          <div className="sidebar-list">
            {previousSets.map((item, i) => (
              <button
                key={`${item.setId}-${i}`}
                className="sidebar-item"
                onClick={() => onSelectSet(item.set)}
              >
                {item.set.name}
              </button>
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
                <button
                  key={set.id}
                  className="sidebar-item"
                  onClick={() => onSelectSet(set)}
                >
                  {set.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
