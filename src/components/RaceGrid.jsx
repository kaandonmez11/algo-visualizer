import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Play, Square, RotateCcw, GitCommitHorizontal } from 'lucide-react'
import RacePanel from './RacePanel'
import AlgoDropdown, { ALGORITHMS } from './AlgoDropdown'
import { useLanguage, T } from '../i18n/LanguageContext'

const DEFAULT_ALGOS = ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Heap Sort']

// grid-cols and grid-rows for each count
const GRID_CLS = {
  1: 'grid-cols-1 grid-rows-1',
  2: 'grid-cols-2 grid-rows-1',
  3: 'grid-cols-3 grid-rows-1',
  4: 'grid-cols-2 grid-rows-2',
}

const RaceGrid = forwardRef(function RaceGrid({ initialArray, delay }, ref) {
  const { t } = useLanguage()
  const [count,       setCount]       = useState(2)
  const [algos,       setAlgos]       = useState(DEFAULT_ALGOS)
  const [status,      setStatus]      = useState('idle')   // idle | running | paused | done
  const [timelineMax, setTimelineMax] = useState(0)
  const [timelinePos, setTimelinePos] = useState(0)

  const panelRefs    = useRef([null, null, null, null])
  const finishedRef  = useRef(new Set())
  const countRef     = useRef(count)
  useEffect(() => { countRef.current = count }, [count])

  // ── Live timeline update while running ──────────────────────────────────────
  useEffect(() => {
    if (status !== 'running') return
    const id = setInterval(() => {
      const n = countRef.current
      const refs = panelRefs.current.slice(0, n)
      // allMax covers finished panels too (slider range), activeMax only non-finished (cursor position)
      const allMax    = Math.max(0, ...refs.map(r => r?.historyLength() ?? 0))
      const activeMax = Math.max(0, ...refs.map((r, i) =>
        finishedRef.current.has(i) ? 0 : (r?.historyLength() ?? 0)
      ))
      setTimelineMax(allMax)
      setTimelinePos(activeMax)
    }, 120)
    return () => clearInterval(id)
  }, [status])

  // ── Panel finish callback ────────────────────────────────────────────────────
  const handleFinished = useCallback((idx) => {
    finishedRef.current.add(idx)
    const n = countRef.current

    // Birincisi bitince diğerleri duraklatılır
    panelRefs.current.slice(0, n).forEach((r, i) => {
      if (i !== idx) r?.pause()
    })

    const allDone = finishedRef.current.size >= n
    setStatus(allDone ? 'done' : 'paused')

    setTimeout(() => {
      const max = Math.max(0, ...panelRefs.current.slice(0, n).map(r => r?.historyLength() ?? 0))
      setTimelineMax(max)
      setTimelinePos(max)
    }, 0)
  }, [])   // uses countRef, not count — stable reference

  // ── Race controls ────────────────────────────────────────────────────────────
  function startRace() {
    panelRefs.current.forEach(r => r?.stop())
    finishedRef.current = new Set()
    setTimelineMax(0)
    setTimelinePos(0)
    setStatus('running')
    // start after a tick so stop() state updates flush
    setTimeout(() => {
      panelRefs.current.slice(0, count).forEach(r => r?.start())
    }, 0)
  }

  function resumeRace() {
    panelRefs.current.slice(0, count).forEach((r, i) => {
      if (finishedRef.current.has(i)) {
        const histLen = r?.historyLength() ?? 0
        if (timelinePos < histLen - 1) {
          // Timeline, bu panelin done frame'inden önceye sarıldı → yeniden çalıştır
          finishedRef.current.delete(i)
          r?.resumeFrom(timelinePos)
        } else {
          // Done frame'inde veya sonrasında → sadece done görselini göster
          r?.scrubTo(Infinity)
        }
      } else {
        r?.resumeFrom(timelinePos)
      }
    })

    setStatus('running')
  }

  function pauseRace() {
    panelRefs.current.slice(0, count).forEach((r, i) => {
      if (!finishedRef.current.has(i)) r?.pause()
    })
    setStatus('paused')
  }

  function resetRace() {
    panelRefs.current.forEach(r => r?.stop())
    finishedRef.current = new Set()
    setStatus('idle')
    setTimelineMax(0)
    setTimelinePos(0)
  }

  function changeCount(n) {
    resetRace()
    setCount(n)
  }

  function setAlgo(i, algo) {
    setAlgos(prev => { const next = [...prev]; next[i] = algo; return next })
  }

  function handleScrub(e) {
    const step = Number(e.target.value)
    setTimelinePos(step)
    panelRefs.current.slice(0, count).forEach(r => r?.scrubTo(step))
  }

  useImperativeHandle(ref, () => ({
    pause() { if (status === 'running') pauseRace() },
  }))

  const isRunning = status === 'running'
  const isPaused  = status === 'paused'
  const isDone    = status === 'done'
  const isIdle    = status === 'idle'

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-2">

      {/* ── Controls row ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap shrink-0">

        {/* Count selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 shrink-0"><T k="algorithmCount" /></span>
          {[2, 3, 4].map(n => (
            <button key={n} onClick={() => changeCount(n)}
              className={`w-7 h-7 rounded-md text-xs font-semibold border transition-all duration-150
                ${count === n
                  ? 'bg-[#6177a9]/30 border-[#6177a9]/60 text-[#8fa3c8]'
                  : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-slate-300'}`}>
              {n}
            </button>
          ))}
        </div>

        {/* Algorithm dropdowns — same component as single mode */}
        <div className="flex items-center gap-2 flex-wrap">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-[11px] text-slate-600 font-medium shrink-0">{i + 1}.</span>
              <AlgoDropdown
                value={algos[i]}
                onChange={algo => setAlgo(i, algo)}
                disabled={isRunning}
                compact
              />
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="ml-auto flex gap-2 shrink-0">
          {isRunning && (
            <button onClick={pauseRace}
              className="h-8 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold border
                bg-[#ed6b69]/20 border-[#ed6b69]/50 text-[#f29190]
                hover:bg-[#ed6b69]/30 active:scale-95 transition-all duration-200">
              <Square size={11} /> <T k="stop" />
            </button>
          )}
          {(isPaused || isDone) && (
            <button onClick={resetRace}
              className="h-8 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold border
                bg-white/5 border-white/10 text-slate-400
                hover:bg-white/10 hover:text-slate-200 active:scale-95 transition-all duration-200">
              <RotateCcw size={11} /> <T k="restart" />
            </button>
          )}
          {isPaused && (
            <button onClick={resumeRace}
              className="h-8 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold border
                bg-[#47b8ad]/20 border-[#47b8ad]/50 text-[#72cec5]
                hover:bg-[#47b8ad]/30 active:scale-95 transition-all duration-200">
              <Play size={11} /> <T k="resume" />
            </button>
          )}
          {(isIdle || isDone) && (
            <button onClick={startRace}
              className="h-8 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold border
                bg-[#6177a9]/20 border-[#6177a9]/50 text-[#8fa3c8]
                hover:bg-[#6177a9]/30 active:scale-95 transition-all duration-200">
              <Play size={11} /> {isDone ? <T k="restartRace" /> : <T k="startRace" />}
            </button>
          )}
        </div>
      </div>

      {/* ── Panel grid ────────────────────────────────────────────────── */}
      <div className={`grid gap-2 flex-1 min-h-0 ${GRID_CLS[count]}`}>
        {Array.from({ length: count }, (_, i) => (
          <RacePanel
            key={`${i}-${algos[i]}`}
            ref={el => { panelRefs.current[i] = el }}
            algorithm={algos[i]}
            initialArray={initialArray}
            delay={delay}
            onFinished={() => handleFinished(i)}
          />
        ))}
      </div>

      {/* ── Color legend ──────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-4 px-1">
        <span className="flex items-center gap-1 text-xs text-slate-700"><span className="w-2 h-2 rounded-sm bg-[#f8c23c]/60" /> <T k="comparing" /></span>
        <span className="flex items-center gap-1 text-xs text-slate-700"><span className="w-2 h-2 rounded-sm bg-[#ed6b69]/60" /> <T k="swapping" /></span>
        <span className="flex items-center gap-1 text-xs text-slate-700"><span className="w-2 h-2 rounded-sm bg-[#47b8ad]/60" /> <T k="sorted" /></span>
      </div>

      {/* ── Timeline — always visible at bottom ───────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 px-3 py-2 rounded-lg
        bg-white/[0.03] border border-white/[0.06]">
        <GitCommitHorizontal size={14} className="text-slate-600 shrink-0" />
        <input
          type="range"
          min={0}
          max={Math.max(1, timelineMax)}
          value={timelinePos}
          disabled={isRunning}
          onChange={handleScrub}
          className="timeline-slider flex-1"
        />
        <span className="text-[11px] text-slate-600 font-mono shrink-0 tabular-nums w-24 text-right">
          {timelinePos.toLocaleString()} / {timelineMax.toLocaleString()}
        </span>
      </div>
    </div>
  )
})

export default RaceGrid
