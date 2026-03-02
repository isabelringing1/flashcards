import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'flashcards_state'

function getISOWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function pickRandomSet(sets, excludeIds, alsoExcludeId) {
  const excluded = new Set([...excludeIds, alsoExcludeId].filter(Boolean))
  let available = sets.filter(s => !excluded.has(s.id))
  if (available.length === 0) {
    available = alsoExcludeId ? sets.filter(s => s.id !== alsoExcludeId) : sets
  }
  if (available.length === 0) available = sets
  return available[Math.floor(Math.random() * available.length)]
}

export default function useWeekly(languageData) {
  const [state, setState] = useState(() => loadState())
  const [needsNewSet, setNeedsNewSet] = useState(false)
  const [proposedSet, setProposedSet] = useState(null)

  const currentWeek = getISOWeekKey()

  useEffect(() => {
    if (!state || state.currentWeek !== currentWeek) {
      const usedIds = [
        ...(state?.history || []).map(h => h.setId),
        state?.currentSetId,
      ].filter(Boolean)
      const set = pickRandomSet(languageData.sets, usedIds, null)
      setProposedSet(set)
      setNeedsNewSet(true)
    }
  }, [])

  const confirmSet = useCallback(() => {
    const history = []
    if (state?.currentSetId) {
      history.push(...(state.history || []), { week: state.currentWeek, setId: state.currentSetId })
    } else if (state?.history) {
      history.push(...state.history)
    }

    const newState = {
      language: languageData.code,
      currentWeek,
      currentSetId: proposedSet.id,
      history,
    }

    setState(newState)
    saveState(newState)
    setNeedsNewSet(false)

    return proposedSet
  }, [state, proposedSet, currentWeek, languageData.code])

  const reroll = useCallback(() => {
    const usedIds = [
      ...(state?.history || []).map(h => h.setId),
      state?.currentSetId,
    ].filter(Boolean)
    const set = pickRandomSet(languageData.sets, usedIds, proposedSet?.id)
    setProposedSet(set)
  }, [state, proposedSet, languageData.sets])

  const currentSet = state ? languageData.sets.find(s => s.id === state.currentSetId) : null

  const previousSets = (state?.history || [])
    .map(h => ({ ...h, set: languageData.sets.find(s => s.id === h.setId) }))
    .filter(h => h.set)
    .reverse()

  return {
    needsNewSet,
    proposedSet,
    confirmSet,
    reroll,
    currentSet,
    previousSets,
    allSets: languageData.sets,
  }
}
