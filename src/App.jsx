import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Play, Square, Volume2, VolumeX, Shuffle, ChevronDown } from 'lucide-react'
import CanvasRenderer from './components/CanvasRenderer'

// ── Array generation (independent of store) ───────────────────────────────────
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

const ALGORITHMS = [
  'Bubble Sort',
  'Selection Sort',
  'Insertion Sort',
  'Merge Sort',
  'Quick Sort',
  'Heap Sort',
]

const WIKI_URLS = {
  'Bubble Sort':    'https://en.wikipedia.org/wiki/Bubble_sort',
  'Selection Sort': 'https://en.wikipedia.org/wiki/Selection_sort',
  'Insertion Sort': 'https://en.wikipedia.org/wiki/Insertion_sort',
  'Merge Sort':     'https://en.wikipedia.org/wiki/Merge_sort',
  'Quick Sort':     'https://en.wikipedia.org/wiki/Quicksort',
  'Heap Sort':      'https://en.wikipedia.org/wiki/Heapsort',
}

const ARRAY_TYPES = [
  { value: 'random',   label: 'Rastgele' },
  { value: 'reversed', label: 'Ters Sıralı' },
  { value: 'nearly',   label: 'Neredeyse Sıralı' },
]

// ── Dropdown ──────────────────────────────────────────────────────────────────
function AlgoDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState({ top: 0, left: 0, width: 0 })
  const btnRef  = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function onDown(e) {
      if (!btnRef.current?.contains(e.target) && !menuRef.current?.contains(e.target))
        setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function handleOpen() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 6, left: r.left, width: r.width })
    }
    setOpen(o => !o)
  }

  return (
    <>
      <button ref={btnRef} onClick={handleOpen}
        className="h-9 flex items-center justify-between gap-3 min-w-[160px] px-3
          rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200
          hover:bg-white/10 hover:border-[#6177a9]/50 transition-all duration-200
          focus:outline-none focus:border-[#6177a9]/70">
        <span>{value}</span>
        <ChevronDown size={14}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && createPortal(
        <ul ref={menuRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 9999 }}
          className="bg-[#0f0f1a] border border-white/10 rounded-lg shadow-xl shadow-black/50 overflow-hidden py-1">
          {ALGORITHMS.map(algo => (
            <li key={algo} onClick={() => { onChange(algo); setOpen(false) }}
              className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors duration-150
                ${value === algo ? 'bg-[#6177a9]/20 text-[#8fa3c8]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
              <span className={`w-3 text-[#f8c23c] text-xs ${value === algo ? 'opacity-100' : 'opacity-0'}`}>✓</span>
              {algo}
            </li>
          ))}
        </ul>,
        document.body
      )}
    </>
  )
}

// ── Slider + input (input doesn't interfere while typing) ─────────────────────
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

// ── Stat pill ──────────────────────────────────────────────────────────────────
function StatPill({ label, value, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-600 text-xs">{label}</span>
      <span className={`text-xs font-mono font-semibold ${color}`}>{value ?? '—'}</span>
    </div>
  )
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  // Slider values (constrained to slider range)
  const [arraySize,    setArraySize]    = useState(100)
  const [delay,        setDelay]        = useState(50)
  // Raw input strings (allow user to type freely)
  const [arraySizeInput, setArraySizeInput] = useState('100')
  const [delayInput,     setDelayInput]     = useState('50')

  const [arrayType,    setArrayType]    = useState('random')
  const [customInput,  setCustomInput]  = useState('')
  const [selectedAlgo, setSelectedAlgo] = useState(ALGORITHMS[0])
  const [isRunning,    setIsRunning]    = useState(false)
  const [isMuted,      setIsMuted]      = useState(false)
  const [isReady,      setIsReady]      = useState(false)
  const [stats,        setStats]        = useState(null)
  const [sortStatus,   setSortStatus]   = useState('idle')

  const arrayRef        = useRef([])
  const highlightRef    = useRef({ comparing: [], swapping: [], sorted: new Set() })
  const workerRef       = useRef(null)
  const lastStatsRef    = useRef({ cmp: 0, acc: 0 })
  const statsTimerRef   = useRef(null)
  const resetSignalRef  = useRef(0)

  // Commit the raw input string to the actual value on blur/Enter
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

  function handleGenerate() {
    stopWorker()
    const size = Math.max(10, parseInt(arraySizeInput, 10) || arraySize)
    const arr  = buildArray(size, arrayType, customInput)
    arrayRef.current      = arr
    highlightRef.current  = { comparing: [], swapping: [], sorted: new Set() }
    lastStatsRef.current  = { cmp: 0, acc: 0 }
    resetSignalRef.current += 1   // forces CanvasRenderer to snap to new state
    setIsRunning(false)
    setIsReady(true)
    setStats(null)
    setSortStatus('idle')
  }

  function handleStartStop() {
    if (isRunning) {
      stopWorker()
      highlightRef.current = { comparing: [], swapping: [], sorted: new Set() }
      setIsRunning(false)
      setSortStatus('idle')
      return
    }

    let arr = arrayRef.current
    if (!isReady || arr.length === 0) {
      const size = Math.max(10, parseInt(arraySizeInput, 10) || arraySize)
      arr = buildArray(size, arrayType, customInput)
      arrayRef.current     = arr
      resetSignalRef.current += 1
      setIsReady(true)
    }

    highlightRef.current = { comparing: [], swapping: [], sorted: new Set() }
    lastStatsRef.current = { cmp: 0, acc: 0 }
    setStats(null)
    setIsRunning(true)
    setSortStatus('running')

    const parsedDelay    = parseFloat(delayInput)
    const effectiveDelay = Math.max(0, Number.isFinite(parsedDelay) ? parsedDelay : delay)

    const worker = new Worker(new URL('./workers/sortWorker.js', import.meta.url))
    workerRef.current = worker

    // Push live stats to React state at most ~15×/sec to avoid flooding re-renders
    statsTimerRef.current = setInterval(() => {
      const { cmp, acc } = lastStatsRef.current
      setStats(s => (s?.cmp === cmp && s?.acc === acc) ? s : { cmp, acc, cpuTime: null })
    }, 66)

    worker.postMessage({ array: arrayRef.current, delay: effectiveDelay, algorithm: selectedAlgo })

    worker.onmessage = (e) => {
      const msg = e.data
      if (msg.type === 'compare') {
        highlightRef.current = { ...highlightRef.current, comparing: msg.indices, swapping: [] }
        lastStatsRef.current = { cmp: msg.cmp, acc: msg.acc }
      } else if (msg.type === 'swap') {
        arrayRef.current = msg.array
        highlightRef.current = { ...highlightRef.current, swapping: msg.indices, comparing: [] }
        lastStatsRef.current = { cmp: msg.cmp, acc: msg.acc }
      } else if (msg.type === 'sorted-index') {
        highlightRef.current.sorted.add(msg.index)
        highlightRef.current = { ...highlightRef.current, comparing: [], swapping: [] }
      } else if (msg.type === 'sorted-upto') {
        const s = highlightRef.current.sorted
        for (let i = 0; i <= msg.index; i++) s.add(i)
        highlightRef.current = { ...highlightRef.current, comparing: [], swapping: [] }
      } else if (msg.type === 'done') {
        clearInterval(statsTimerRef.current)
        arrayRef.current = msg.array
        // Mark all sorted
        const s = new Set()
        for (let i = 0; i < msg.array.length; i++) s.add(i)
        highlightRef.current = { comparing: [], swapping: [], sorted: s }
        setStats({ cmp: msg.cmp, acc: msg.acc, cpuTime: msg.cpuTime })
        setIsRunning(false)
        setSortStatus('done')
        worker.terminate()
        workerRef.current = null
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] text-slate-200">

      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-3 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <img src="/logo.svg" alt="KD Logo" width={30} height={30} />
        <h1 className="text-lg font-semibold tracking-tight text-white">
          Algo <span className="text-[#47b8ad]">Visualizer</span>
        </h1>
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

        {/* Algorithm */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400">Algoritma</label>
          <AlgoDropdown value={selectedAlgo} onChange={setSelectedAlgo} />
        </div>

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

          <button onClick={handleStartStop}
            className={`h-9 w-28 flex items-center justify-center gap-2 rounded-lg text-sm font-semibold
              transition-all duration-200 active:scale-95 shadow-lg
              ${isRunning
                ? 'bg-[#ed6b69]/20 hover:bg-[#ed6b69]/30 border border-[#ed6b69]/50 text-[#f29190] shadow-[#ed6b69]/10'
                : 'bg-[#6177a9]/20 hover:bg-[#6177a9]/30 border border-[#6177a9]/50 text-[#8fa3c8] shadow-[#6177a9]/10'}`}>
            {isRunning ? <Square size={14} /> : <Play size={14} />}
            {isRunning ? 'Durdur' : 'Başlat'}
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <main className="flex-1 flex flex-col p-4 gap-3 relative overflow-hidden min-h-0">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none bg-[#6177a9]/8" />

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
              {sortStatus === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-[#f8c23c] animate-pulse" />}
              {sortStatus === 'done'    && <span className="text-xs text-[#47b8ad] font-medium">Tamamlandı</span>}
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-5 px-1">
          <StatPill label="Karşılaştırma" value={stats?.cmp?.toLocaleString()}              color="text-[#f8c23c]" />
          <StatPill label="Dizi Erişimi"  value={stats?.acc?.toLocaleString()}              color="text-[#ed6b69]" />
          <StatPill label="Saf CPU"       value={stats?.cpuTime != null ? `${stats.cpuTime} ms` : null} color="text-[#47b8ad]" />
          <div className="ml-auto flex items-center gap-3 text-xs text-slate-700">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#f8c23c]/60" /> Karşılaştırılan</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#ed6b69]/60" /> Değiştirilen</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#47b8ad]/60" /> Sıralanan</span>
          </div>
        </div>
      </main>

    </div>
  )
}
