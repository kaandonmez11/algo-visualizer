import { useState, useRef, useEffect } from 'react'
import { Play, Square, RotateCcw, Volume2, VolumeX, Shuffle, Swords, GitCommitHorizontal } from 'lucide-react'
import CanvasRenderer from './components/CanvasRenderer'
import RaceGrid from './components/RaceGrid'
import AlgoDropdown, { ALGORITHMS } from './components/AlgoDropdown'
import { audioManager } from './utils/audioManager'

// ── Array generation ──────────────────────────────────────────────────────────
function makeRandom(n)   { return Array.from({ length: n }, () => Math.floor(Math.random() * n) + 1) }
function makeReversed(n) { return Array.from({ length: n }, (_, i) => n - i) }
function makeNearlySorted(n) {
  const a = Array.from({ length: n }, (_, i) => i + 1)
  const swaps = Math.max(1, Math.floor(n * 0.05))
  for (let k = 0; k < swaps; k++) {
    const i = Math.floor(Math.random() * n), j = Math.floor(Math.random() * n)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function parseCustom(input) {
  const nums = input.split(',').map(s => Number(s.trim())).filter(n => Number.isFinite(n) && n > 0)
  return nums.length > 0 ? nums : null
}
function buildArray(size, type, customInput) {
  if (type === 'custom') return parseCustom(customInput) ?? makeRandom(size)
  if (type === 'reversed') return makeReversed(size)
  if (type === 'nearly')   return makeNearlySorted(size)
  return makeRandom(size)
}

const WIKI_URLS = {
  'Bubble Sort':          'https://en.wikipedia.org/wiki/Bubble_sort',
  'Selection Sort':       'https://en.wikipedia.org/wiki/Selection_sort',
  'Insertion Sort':       'https://en.wikipedia.org/wiki/Insertion_sort',
  'Merge Sort':           'https://en.wikipedia.org/wiki/Merge_sort',
  'Quick Sort':           'https://en.wikipedia.org/wiki/Quicksort',
  'Heap Sort':            'https://en.wikipedia.org/wiki/Heapsort',
  'Radix Sort':           'https://en.wikipedia.org/wiki/Radix_sort',
  'Shell Sort':           'https://en.wikipedia.org/wiki/Shellsort',
  'Cocktail Shaker Sort': 'https://en.wikipedia.org/wiki/Cocktail_shaker_sort',
  'Gnome Sort':           'https://en.wikipedia.org/wiki/Gnome_sort',
  'Bitonic Sort':         'https://en.wikipedia.org/wiki/Bitonic_sort',
  'Pancake Sort':         'https://en.wikipedia.org/wiki/Pancake_sorting',
  'Comb Sort':            'https://en.wikipedia.org/wiki/Comb_sort',
  'Odd-Even Sort':        'https://en.wikipedia.org/wiki/Odd%E2%80%93even_sort',
  'Bogo Sort':            'https://en.wikipedia.org/wiki/Bogosort',
}

const ARRAY_TYPES = [
  { value: 'random',   label: 'Rastgele' },
  { value: 'reversed', label: 'Ters Sıralı' },
  { value: 'nearly',   label: 'Neredeyse Sıralı' },
]

function SliderWithInput({ label, sliderValue, onSliderChange, inputValue, onInputChange, onCommit, sliderMin, sliderMax, unit = '' }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[180px]">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="range" min={sliderMin} max={sliderMax} value={Math.min(sliderValue, sliderMax)}
          onChange={e => onSliderChange(Number(e.target.value))}
          className="flex-1 cursor-pointer"
        />
        <div className="h-9 flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden
          focus-within:border-[#6177a9]/60 focus-within:ring-1 focus-within:ring-[#6177a9]/20 transition-all duration-200">
          <input
            type="number" value={inputValue}
            onChange={e => onInputChange(e.target.value)}
            onBlur={onCommit}
            onKeyDown={e => e.key === 'Enter' && onCommit()}
            className="w-16 h-full px-2 text-sm text-center text-slate-200 bg-transparent outline-none"
          />
          {unit && <span className="pr-2 text-xs text-slate-500 select-none">{unit}</span>}
        </div>
      </div>
    </div>
  )
}

function StatPill({ label, value, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-600 text-xs">{label}</span>
      <span className={`text-xs font-mono font-semibold ${color}`}>{value ?? '—'}</span>
    </div>
  )
}

export default function App() {
  const [arraySize,      setArraySize]      = useState(100)
  const [delay,          setDelay]          = useState(50)
  const [arraySizeInput, setArraySizeInput] = useState('100')
  const [delayInput,     setDelayInput]     = useState('50')
  const [arrayType,      setArrayType]      = useState('random')
  const [customInput,    setCustomInput]    = useState('')
  const [selectedAlgo,   setSelectedAlgo]   = useState(ALGORITHMS[0])
  const [isMuted,        setIsMuted]        = useState(false)
  const [isReady,        setIsReady]        = useState(false)
  const [stats,          setStats]          = useState(null)
  const [sortStatus,     setSortStatus]     = useState('idle') // idle | running | paused | done
  const [timelineMax,    setTimelineMax]    = useState(0)
  const [timelinePos,    setTimelinePos]    = useState(0)

  const [mode,       setMode]       = useState('single')
  const [raceArray,  setRaceArray]  = useState(() => makeRandom(100))
  const [slideClass, setSlideClass] = useState('')

  const raceGridRef = useRef(null)

  function switchMode(newMode) {
    if (newMode === mode) return
    if (mode === 'single' && sortStatus === 'running') handlePause()
    if (mode === 'race') raceGridRef.current?.pause()
    setSlideClass(newMode === 'race' ? 'slide-from-right' : 'slide-from-left')
    setMode(newMode)
  }

  useEffect(() => { audioManager.setMuted(isMuted) }, [isMuted])

  const arrayRef         = useRef([])
  const highlightRef     = useRef({ comparing: [], swapping: [], sorted: new Set() })
  const workerRef        = useRef(null)
  const lastStatsRef     = useRef({ cmp: 0, acc: 0 })
  const statsTimerRef    = useRef(null)
  const resetSignalRef   = useRef(0)
  const singleHistoryRef = useRef([])
  const singleSortedRef  = useRef(new Set())
  const animStartRef     = useRef(null)
  const initialArrayRef  = useRef([])  // original unsorted array for restart
  const pausedAnimTimeRef = useRef(0)

  function commitArraySize() {
    const v = Math.max(10, parseInt(arraySizeInput, 10) || 10)
    setArraySize(v)
    setArraySizeInput(String(v))
  }
  function commitDelay() {
    const v = Math.max(0, parseFloat(delayInput) || 0)
    setDelay(v)
    setDelayInput(String(v))
  }

  function stopWorker() {
    workerRef.current?.terminate()
    workerRef.current = null
    clearInterval(statsTimerRef.current)
  }

  function startStatsTimer() {
    statsTimerRef.current = setInterval(() => {
      const { cmp, acc } = lastStatsRef.current
      const animTime = +((performance.now() - animStartRef.current) / 1000).toFixed(2)
      const len = singleHistoryRef.current.length
      setStats(s => ({ cmp, acc, cpuTime: s?.cpuTime ?? null, animTime }))
      setTimelineMax(len)
      setTimelinePos(len)
    }, 66)
  }

  function handleGenerate() {
    stopWorker()
    const size = Math.max(10, parseInt(arraySizeInput, 10) || arraySize)
    const arr  = buildArray(size, arrayType, customInput)
    initialArrayRef.current  = arr
    arrayRef.current         = arr
    highlightRef.current     = { comparing: [], swapping: [], sorted: new Set() }
    lastStatsRef.current     = { cmp: 0, acc: 0 }
    singleHistoryRef.current = []
    singleSortedRef.current  = new Set()
    resetSignalRef.current  += 1
    setIsReady(true)
    setStats(null)
    setSortStatus('idle')
    setTimelineMax(0)
    setTimelinePos(0)
    setRaceArray(arr)
  }

  function scrubToSingle(step) {
    const h = singleHistoryRef.current
    if (h.length === 0) return
    const snap = h[Math.max(0, Math.min(step, h.length - 1))]
    arrayRef.current = snap.array.slice()
    highlightRef.current = {
      comparing: [],
      swapping:  snap.swapping,
      sorted:    new Set(snap.sorted),
    }
    setStats(s => s
      ? { ...s, cmp: snap.cmp, acc: snap.acc, animTime: snap.animTime ?? s.animTime }
      : { cmp: snap.cmp, acc: snap.acc, cpuTime: null, animTime: snap.animTime ?? null })
    setTimelinePos(step)
  }

  function handleSingleScrub(e) {
    scrubToSingle(Number(e.target.value))
  }

  // ── Shared worker message handler ────────────────────────────────────────────
  function _attachWorkerHandlers(worker) {
    worker.onmessage = (e) => {
      const msg = e.data
      if (msg.type === 'compare') {
        highlightRef.current = { ...highlightRef.current, comparing: msg.indices, swapping: [] }
        lastStatsRef.current = { cmp: msg.cmp, acc: msg.acc }
        audioManager.playNote(arrayRef.current[msg.indices[0]], initialArrayRef.current.length)
      } else if (msg.type === 'swap') {
        arrayRef.current = msg.array
        highlightRef.current = { ...highlightRef.current, swapping: msg.indices, comparing: [] }
        lastStatsRef.current = { cmp: msg.cmp, acc: msg.acc }
        audioManager.playNote(msg.array[msg.indices[0]], initialArrayRef.current.length)
        const animTime = +((performance.now() - animStartRef.current) / 1000).toFixed(2)
        singleHistoryRef.current.push({
          array: msg.array.slice(), swapping: [...msg.indices],
          sorted: Array.from(singleSortedRef.current), cmp: msg.cmp, acc: msg.acc, animTime,
        })
      } else if (msg.type === 'sorted-index') {
        singleSortedRef.current.add(msg.index)
        highlightRef.current.sorted.add(msg.index)
        highlightRef.current = { ...highlightRef.current, comparing: [], swapping: [] }
      } else if (msg.type === 'sorted-upto') {
        const s = highlightRef.current.sorted
        for (let i = 0; i <= msg.index; i++) { s.add(i); singleSortedRef.current.add(i) }
        highlightRef.current = { ...highlightRef.current, comparing: [], swapping: [] }
      } else if (msg.type === 'done') {
        clearInterval(statsTimerRef.current)
        arrayRef.current = msg.array
        const sorted = new Set()
        for (let i = 0; i < msg.array.length; i++) sorted.add(i)
        highlightRef.current = { comparing: [], swapping: [], sorted }
        const animTime = +((performance.now() - animStartRef.current) / 1000).toFixed(2)
        singleHistoryRef.current.push({
          array: msg.array.slice(), swapping: [], sorted: Array.from(sorted), cmp: msg.cmp, acc: msg.acc, animTime,
        })
        const len = singleHistoryRef.current.length
        setStats({ cmp: msg.cmp, acc: msg.acc, cpuTime: msg.cpuTime, animTime })
        setTimelineMax(len)
        setTimelinePos(len)
        setSortStatus('done')
        workerRef.current?.terminate()
        workerRef.current = null
      }
    }
  }

  // ── Sort lifecycle ─────────────────────────────────────────────────────────
  function handleStart() {
    let arr
    if (!isReady || initialArrayRef.current.length === 0) {
      const size = Math.max(10, parseInt(arraySizeInput, 10) || arraySize)
      arr = buildArray(size, arrayType, customInput)
      setIsReady(true)
    } else {
      arr = initialArrayRef.current.slice()
    }

    initialArrayRef.current  = arr
    arrayRef.current         = arr
    highlightRef.current     = { comparing: [], swapping: [], sorted: new Set() }
    lastStatsRef.current     = { cmp: 0, acc: 0 }
    singleHistoryRef.current = []
    singleSortedRef.current  = new Set()
    singleHistoryRef.current.push({ array: arr.slice(), swapping: [], sorted: [], cmp: 0, acc: 0, animTime: 0 })
    animStartRef.current     = performance.now()
    resetSignalRef.current  += 1
    audioManager.resume()
    setStats(null)
    setTimelineMax(1)
    setTimelinePos(1)
    setSortStatus('running')

    const parsedDelay    = parseFloat(delayInput)
    const effectiveDelay = Math.max(0, Number.isFinite(parsedDelay) ? parsedDelay : delay)

    const worker = new Worker(new URL('./workers/sortWorker.js', import.meta.url))
    workerRef.current = worker
    startStatsTimer()
    _attachWorkerHandlers(worker)
    worker.postMessage({ array: arr, delay: effectiveDelay, algorithm: selectedAlgo })
  }

  function handlePause() {
    pausedAnimTimeRef.current = stats?.animTime ?? 0
    workerRef.current?.postMessage({ type: 'pause' })
    clearInterval(statsTimerRef.current)
    setSortStatus('paused')
  }

  function handleResume() {
    if (timelinePos >= timelineMax) {
      // No backward scrub — simply resume the paused worker from the exact paused time
      animStartRef.current = performance.now() - pausedAnimTimeRef.current * 1000
      setSortStatus('running')
      startStatsTimer()
      workerRef.current?.postMessage({ type: 'resume' })
      return
    }

    // User scrubbed backward — terminate old worker, restart from scrubbed position
    workerRef.current?.terminate()
    workerRef.current = null

    const snapIdx = Math.min(timelinePos, singleHistoryRef.current.length - 1)
    const snap    = singleHistoryRef.current[snapIdx]

    // Truncate history to the scrubbed position and restore state
    singleHistoryRef.current = singleHistoryRef.current.slice(0, snapIdx + 1)
    singleSortedRef.current  = new Set(snap.sorted)
    lastStatsRef.current     = { cmp: snap.cmp, acc: snap.acc }
    animStartRef.current     = performance.now() - (snap.animTime ?? 0) * 1000

    const newLen = singleHistoryRef.current.length
    setTimelineMax(newLen)
    setTimelinePos(newLen)
    setSortStatus('running')
    startStatsTimer()

    const parsedDelay    = parseFloat(delayInput)
    const effectiveDelay = Math.max(0, Number.isFinite(parsedDelay) ? parsedDelay : delay)

    const worker = new Worker(new URL('./workers/sortWorker.js', import.meta.url))
    workerRef.current = worker
    _attachWorkerHandlers(worker)
    worker.postMessage({
      array: initialArrayRef.current,
      delay: effectiveDelay,
      algorithm: selectedAlgo,
      fastForwardSwaps: snapIdx,
    })
  }

  function handleReset() {
    stopWorker()
    const arr = initialArrayRef.current.length > 0 ? initialArrayRef.current.slice() : makeRandom(arraySize)
    arrayRef.current         = arr
    highlightRef.current     = { comparing: [], swapping: [], sorted: new Set() }
    singleHistoryRef.current = []
    singleSortedRef.current  = new Set()
    resetSignalRef.current  += 1
    setStats(null)
    setSortStatus('idle')
    setTimelineMax(0)
    setTimelinePos(0)
  }

  const isRunning = sortStatus === 'running'
  const isPaused  = sortStatus === 'paused'
  const isDone    = sortStatus === 'done'
  const isIdle    = sortStatus === 'idle'

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] text-slate-200">

      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-3 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <img src="/logo.svg" alt="KD Logo" width={30} height={30} />
        <h1 className="text-lg font-semibold tracking-tight text-white">
          Algo <span className="text-[#47b8ad]">Visualizer</span>
        </h1>

        {/* Mode toggle */}
        <div className="relative ml-auto flex items-center p-[3px] rounded-lg bg-white/5 border border-white/10">
          <div
            className="absolute inset-[3px] rounded-[7px] pointer-events-none transition-all duration-300"
            style={{
              width: 'calc(50% - 1.5px)',
              transform: mode === 'race' ? 'translateX(calc(100% + 3px))' : 'translateX(0)',
              background: mode === 'single' ? 'rgba(97,119,169,0.3)' : 'rgba(248,194,60,0.18)',
              border:     mode === 'single' ? '1px solid rgba(97,119,169,0.4)' : '1px solid rgba(248,194,60,0.3)',
            }}
          />
          <button onClick={() => switchMode('single')}
            className={`relative z-10 h-7 min-w-[7.5rem] rounded-md text-xs font-medium
              transition-colors duration-300
              ${mode === 'single' ? 'text-[#8fa3c8]' : 'text-slate-500 hover:text-slate-300'}`}>
            Tek Algoritma
          </button>
          <button onClick={() => switchMode('race')}
            className={`relative z-10 h-7 min-w-[7.5rem] rounded-md text-xs font-medium
              flex items-center justify-center gap-1.5 transition-colors duration-300
              ${mode === 'race' ? 'text-[#f8c23c]' : 'text-slate-500 hover:text-slate-300'}`}>
            <Swords size={11} /> Karşılaştırma
          </button>
        </div>
      </header>

      {/* Controls Panel */}
      <div className="flex flex-wrap items-end gap-5 px-6 py-4 border-b border-white/10 bg-white/[0.03] backdrop-blur-sm">

        <SliderWithInput
          label="Dizi Boyutu"
          sliderMin={10} sliderMax={500}
          sliderValue={arraySize}
          onSliderChange={v => { setArraySize(v); setArraySizeInput(String(v)) }}
          inputValue={arraySizeInput}
          onInputChange={setArraySizeInput}
          onCommit={commitArraySize}
        />

        <SliderWithInput
          label="Gecikme"
          sliderMin={0} sliderMax={500}
          sliderValue={delay}
          onSliderChange={v => { setDelay(v); setDelayInput(String(v)) }}
          inputValue={delayInput}
          onInputChange={setDelayInput}
          onCommit={commitDelay}
          unit="ms"
        />

        {/* Array Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400">Dizi Tipi</label>
          <div className="flex gap-1.5">
            {ARRAY_TYPES.map(type => (
              <button key={type.value} onClick={() => setArrayType(type.value)}
                className={`h-9 px-3 rounded-lg text-xs font-medium border transition-all duration-200
                  ${arrayType === type.value
                    ? 'bg-[#f8c23c]/15 border-[#f8c23c]/50 text-[#f8c23c] shadow-sm shadow-[#f8c23c]/10'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'}`}>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-slate-400">Özel Dizi</label>
          <input type="text" value={customInput} onChange={e => setCustomInput(e.target.value)}
            placeholder="Virgülle ayır: 5, 3, 8, 1..."
            className="h-9 px-3 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200
              placeholder:text-slate-600 outline-none transition-all duration-200
              focus:border-[#6177a9]/60 focus:ring-1 focus:ring-[#6177a9]/20" />
        </div>

        {/* Algorithm — single mode only */}
        {mode === 'single' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">Algoritma</label>
            <AlgoDropdown value={selectedAlgo} onChange={setSelectedAlgo} disabled={isRunning || isPaused} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-end gap-2 ml-auto">
          <button onClick={() => setIsMuted(m => !m)} title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5
              text-slate-400 hover:bg-white/10 hover:text-[#47b8ad] transition-all duration-200">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button onClick={handleGenerate}
            className="h-9 flex items-center gap-2 px-4 rounded-lg border border-white/10 bg-white/5
              text-slate-300 text-sm font-medium hover:bg-white/10 hover:text-[#47b8ad]
              hover:border-[#47b8ad]/30 transition-all duration-200 active:scale-95">
            <Shuffle size={14} /> Oluştur
          </button>

          {/* Single mode controls — mirrors race mode UX */}
          {mode === 'single' && isRunning && (
            <button onClick={handlePause}
              className="h-9 flex items-center gap-2 px-4 rounded-lg text-sm font-semibold
                transition-all duration-200 active:scale-95 shadow-lg
                bg-[#ed6b69]/20 hover:bg-[#ed6b69]/30 border border-[#ed6b69]/50 text-[#f29190] shadow-[#ed6b69]/10">
              <Square size={14} /> Duraklat
            </button>
          )}
          {mode === 'single' && isPaused && (
            <>
              <button onClick={handleReset}
                className="h-9 flex items-center gap-2 px-4 rounded-lg text-sm font-semibold
                  transition-all duration-200 active:scale-95
                  bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-200">
                <RotateCcw size={13} /> Yeniden Başlat
              </button>
              <button onClick={handleResume}
                className="h-9 flex items-center gap-2 px-4 rounded-lg text-sm font-semibold
                  transition-all duration-200 active:scale-95 shadow-lg
                  bg-[#47b8ad]/20 hover:bg-[#47b8ad]/30 border border-[#47b8ad]/50 text-[#72cec5] shadow-[#47b8ad]/10">
                <Play size={14} /> Devam Et
              </button>
            </>
          )}
          {mode === 'single' && (isIdle || isDone) && (
            <button onClick={handleStart}
              className="h-9 flex items-center gap-2 px-4 rounded-lg text-sm font-semibold
                transition-all duration-200 active:scale-95 shadow-lg
                bg-[#6177a9]/20 hover:bg-[#6177a9]/30 border border-[#6177a9]/50 text-[#8fa3c8] shadow-[#6177a9]/10">
              <Play size={14} /> {isDone ? 'Yeniden Başlat' : 'Başlat'}
            </button>
          )}
        </div>
      </div>

      {/* Canvas / Race Area */}
      <main className="flex-1 flex flex-col p-4 gap-3 relative overflow-hidden min-h-0">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none bg-[#6177a9]/8" />

        {/* ── Single mode — always mounted, hidden when inactive ── */}
        <div className={`flex-1 min-h-0 flex flex-col gap-2 ${mode !== 'single' ? 'hidden' : slideClass}`}>
          <div className="relative flex-1 rounded-2xl border border-white/[0.06] bg-[#0c0c14] overflow-hidden min-h-0">
            {isReady ? (
              <CanvasRenderer arrayRef={arrayRef} highlightRef={highlightRef} resetSignalRef={resetSignalRef} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="flex gap-1.5 items-end h-12">
                  {[40,65,30,80,50,90,35,70,55,75].map((h,i) => (
                    <div key={i} className="w-3 rounded-sm bg-[#6177a9]/25" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <p className="text-slate-600 text-sm font-medium mt-1">Oluştur'a bas veya Başlat'a tıkla</p>
              </div>
            )}
            {isReady && (
              <div className="absolute top-3 left-4 flex items-center gap-2">
                <a href={WIKI_URLS[selectedAlgo]} target="_blank" rel="noreferrer"
                  className="text-xs text-slate-500 font-medium underline underline-offset-2
                    decoration-slate-600 hover:text-slate-300 hover:decoration-slate-400 transition-colors duration-150">
                  {selectedAlgo}
                </a>
                {isRunning  && <span className="w-1.5 h-1.5 rounded-full bg-[#f8c23c] animate-pulse" />}
                {isDone     && <span className="text-xs text-[#47b8ad] font-medium">Tamamlandı</span>}
                {isPaused   && <span className="text-xs text-[#ed6b69]/80 font-medium">⏸</span>}
              </div>
            )}
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-5 px-1 shrink-0">
            <StatPill label="Karşılaştırma" value={stats?.cmp?.toLocaleString()}                                      color="text-[#f8c23c]" />
            <StatPill label="Dizi Erişimi"  value={stats?.acc?.toLocaleString()}                                      color="text-[#ed6b69]" />
            <StatPill label="Saf CPU"       value={stats?.cpuTime != null ? `${stats.cpuTime.toFixed(3)} ms` : null}  color="text-[#47b8ad]" />
            <StatPill label="Süre"          value={stats?.animTime != null ? `${stats.animTime} s` : null}            color="text-[#8fa3c8]" />
            <div className="ml-auto flex items-center gap-3 text-xs text-slate-700">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#f8c23c]/60" /> Karşılaştırılan</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#ed6b69]/60" /> Değiştirilen</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#47b8ad]/60" /> Sıralanan</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="shrink-0 flex items-center gap-3 px-3 py-2 rounded-lg
            bg-white/[0.03] border border-white/[0.06]">
            <GitCommitHorizontal size={14} className="text-slate-600 shrink-0" />
            <input
              type="range"
              min={0}
              max={Math.max(1, timelineMax)}
              value={timelinePos}
              disabled={isRunning}
              onChange={handleSingleScrub}
              className="timeline-slider flex-1"
            />
            <span className="text-[11px] text-slate-600 font-mono shrink-0 tabular-nums w-24 text-right">
              {timelinePos.toLocaleString()} / {timelineMax.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── Race mode — always mounted, hidden when inactive ── */}
        <div className={`flex-1 min-h-0 flex flex-col ${mode !== 'race' ? 'hidden' : slideClass}`}>
          <RaceGrid ref={raceGridRef} initialArray={raceArray} delay={delay} />
        </div>
      </main>

    </div>
  )
}
