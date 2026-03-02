import { useState, useCallback, useEffect } from 'react'
import { getLanguage } from './data/languages'
import useWeekly from './hooks/useWeekly'
import Sidebar from './components/Sidebar'
import FlashcardDeck from './components/FlashcardDeck'
import WeeklyPopup from './components/WeeklyPopup'

const DEFAULT_LANGUAGE = 'kr'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function App() {
  const languageData = getLanguage(DEFAULT_LANGUAGE)
  const weekly = useWeekly(languageData)
  const [activeDeck, setActiveDeck] = useState(null)
  const [activeDeckName, setActiveDeckName] = useState('')
  const [deckKey, setDeckKey] = useState(0)

  const loadSet = useCallback((set, name) => {
    setActiveDeck([...set.cards])
    setActiveDeckName(name || set.name)
  }, [])

  const loadWeeklySet = useCallback(() => {
    if (weekly.currentSet) {
      loadSet(weekly.currentSet, `This Week: ${weekly.currentSet.name}`)
    }
  }, [weekly.currentSet, loadSet])

  const loadRemix = useCallback(() => {
    const allCards = []
    if (weekly.currentSet) allCards.push(...weekly.currentSet.cards)
    for (const prev of weekly.previousSets) {
      allCards.push(...prev.set.cards)
    }
    if (allCards.length === 0) return
    setActiveDeck(shuffle(allCards))
    setActiveDeckName('Remix')
  }, [weekly.currentSet, weekly.previousSets])

  const loadRandom = useCallback(() => {
    const sets = weekly.allSets
    if (sets.length === 0) return
    const set = sets[Math.floor(Math.random() * sets.length)]
    loadSet(set, set.name)
  }, [weekly.allSets, loadSet])

  const handleShuffle = useCallback(() => {
    if (activeDeck) {
      setActiveDeck(shuffle(activeDeck))
      setDeckKey((k) => k + 1)
    }
  }, [activeDeck])

  // Auto-load weekly set on mount if confirmed and no deck active
  useEffect(() => {
    if (weekly.currentSet && !weekly.needsNewSet && !activeDeck) {
      loadSet(weekly.currentSet, `This Week: ${weekly.currentSet.name}`)
    }
  }, [weekly.currentSet, weekly.needsNewSet])

  function handleConfirmWeekly() {
    const set = weekly.confirmSet()
    if (set) loadSet(set, `This Week: ${set.name}`)
  }

  const hasRemixSets = (weekly.currentSet ? 1 : 0) + weekly.previousSets.length >= 2

  return (
    <div className="app">
      {weekly.needsNewSet && weekly.proposedSet && (
        <WeeklyPopup
          set={weekly.proposedSet}
          onConfirm={handleConfirmWeekly}
          onReroll={weekly.reroll}
        />
      )}
      <Sidebar
        currentSet={weekly.currentSet}
        onPracticeWeekly={loadWeeklySet}
        onRemix={loadRemix}
        onRandom={loadRandom}
        previousSets={weekly.previousSets}
        allSets={weekly.allSets}
        onSelectSet={(set) => loadSet(set)}
        hasRemixSets={hasRemixSets}
      />
      <main className="main">
        {activeDeck && activeDeck.length > 0 ? (
          <FlashcardDeck
            key={`${activeDeckName}-${deckKey}`}
            cards={activeDeck}
            name={activeDeckName}
            onShuffle={handleShuffle}
          />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">&#x1F0CF;</div>
            <p>Select a set to start practicing</p>
          </div>
        )}
      </main>
    </div>
  )
}
