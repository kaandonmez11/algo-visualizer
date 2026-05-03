import { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import CanvasRenderer from './CanvasRenderer'
import { audioManager } from '../utils/audioManager'

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
  'Tim Sort':             'https://en.wikipedia.org/wiki/Timsort',
  'Intro Sort':           'https://en.wikipedia.org/wiki/Introsort',
  'Counting Sort':        'https://en.wikipedia.org/wiki/Counting_sort',
  'Bucket Sort':          'https://en.wikipedia.org/wiki/Bucket_sort',
  'Pigeonhole Sort':      'https://en.wikipedia.org/wiki/Pigeonhole_sort',
  'Cycle Sort':           'https://en.wikipedia.org/wiki/Cycle_sort',
  'Tree Sort':            'https://en.wikipedia.org/wiki/Tree_sort',
  'Strand Sort':          'https://en.wikipedia.org/wiki/Strand_sort',
  'Stooge Sort':          'https://en.wikipedia.org/wiki/Stooge_sort',
  'Sleep Sort':           'https://en.wikipedia.org/wiki/Bogosort#Similar_algorithms',
  'Stalin Sort':          'https://www.quora.com/What-is-Stalin-sort',
}

const RacePanel = forwardRef(function RacePanel({ algorithm, initialArray, delay, onFinished }, ref) {
  const arrayRef         = useRef([])
  const highlightRef     = useRef({ comparing: [], swapping: [], sorted: new Set() })
  const resetSignalRef   = useRef(0)
  const workerRef        = useRef(null)
  const historyRef       = useRef([])
  const currentSortedRef = useRef(new Set())
  const lastStatsRef     = useRef({ cmp: 0, acc: 0 })
  const statsTimerRef    = useRef(null)
  const startTimeRef     = useRef(null)

  const propsRef = useRef({ algorithm, initialArray, delay, onFinished })
  useEffect(() => { propsRef.current = { algorithm, initialArray, delay, onFinished } })

  useEffect(() => {
    if (!workerRef.current) {
      arrayRef.current = [...initialArray]
      highlightRef.current = { comparing: [], swapping: [], sorted: new Set() }
      resetSignalRef.current += 1
    }
  }, [initialArray])

  useEffect(() => () => {
    workerRef.current?.terminate()
    clearInterval(statsTimerRef.current)
  }, [])

  const [stats,  setStats]  = useState(null)
  const [status, setStatus] = useState('idle')

  // ── Shared onmessage handler — used by both _startWorker and resumeFrom ──────
  function _attachOnMessage(worker) {
    worker.onmessage = (e) => {
      const msg = e.data
      switch (msg.type) {
        case 'compare':
          highlightRef.current = { ...highlightRef.current, comparing: msg.indices, swapping: [] }
          lastStatsRef.current = { cmp: msg.cmp, acc: msg.acc }
          audioManager.playNote(arrayRef.current[msg.indices[0]], propsRef.current.initialArray.length)
          break
        case 'swap': {
          arrayRef.current = msg.array
          highlightRef.current = { ...highlightRef.current, swapping: msg.indices, comparing: [] }
          lastStatsRef.current = { cmp: msg.cmp, acc: msg.acc }
          audioManager.playNote(msg.array[msg.indices[0]], propsRef.current.initialArray.length)
          const animTime = +((performance.now() - startTimeRef.current) / 1000).toFixed(2)
          historyRef.current.push({
            array: msg.array.slice(), swapping: [...msg.indices],
            sorted: Array.from(currentSortedRef.current), cmp: msg.cmp, acc: msg.acc, animTime,
          })
          break
        }
        case 'sorted-index':
          currentSortedRef.current.add(msg.index)
          highlightRef.current.sorted.add(msg.index)
          highlightRef.current = { ...highlightRef.current, comparing: [], swapping: [] }
          break
        case 'sorted-upto': {
          const s = highlightRef.current.sorted
          for (let i = 0; i <= msg.index; i++) { s.add(i); currentSortedRef.current.add(i) }
          highlightRef.current = { ...highlightRef.current, comparing: [], swapping: [] }
          break
        }
        case 'done': {
          clearInterval(statsTimerRef.current)
          arrayRef.current = msg.array
          const sorted = new Set()
          for (let i = 0; i < msg.array.length; i++) sorted.add(i)
          highlightRef.current = { comparing: [], swapping: [], sorted }
          const animTime = +((performance.now() - startTimeRef.current) / 1000).toFixed(2)
          historyRef.current.push({
            array: msg.array.slice(), swapping: [], sorted: Array.from(sorted),
            cmp: msg.cmp, acc: msg.acc, animTime,
          })
          setStats({ cmp: msg.cmp, acc: msg.acc, cpuTime: msg.cpuTime, animTime })
          setStatus('done')
          workerRef.current = null
          propsRef.current.onFinished?.()
          break
        }
      }
    }
  }

  function _startStatsTimer() {
    statsTimerRef.current = setInterval(() => {
      const { cmp, acc } = lastStatsRef.current
      const animTime = +((performance.now() - startTimeRef.current) / 1000).toFixed(2)
      setStats(s => ({ cmp, acc, cpuTime: s?.cpuTime ?? null, animTime }))
    }, 66)
  }

  function _startWorker() {
    const { algorithm, initialArray, delay } = propsRef.current

    arrayRef.current         = [...initialArray]
    highlightRef.current     = { comparing: [], swapping: [], sorted: new Set() }
    resetSignalRef.current  += 1
    historyRef.current       = []
    currentSortedRef.current = new Set()
    historyRef.current.push({ array: [...initialArray], swapping: [], sorted: [], cmp: 0, acc: 0, animTime: 0 })
    lastStatsRef.current     = { cmp: 0, acc: 0 }
    startTimeRef.current     = performance.now()
    audioManager.resume()
    setStats(null)
    setStatus('running')

    const worker = new Worker(new URL('../workers/sortWorker.js', import.meta.url))
    workerRef.current = worker
    _startStatsTimer()
    _attachOnMessage(worker)
    worker.postMessage({ array: [...initialArray], delay, algorithm })
  }

  useImperativeHandle(ref, () => ({
    start() {
      if (workerRef.current) return
      _startWorker()
    },

    pause() {
      if (!workerRef.current) return
      workerRef.current.postMessage({ type: 'pause' })
      clearInterval(statsTimerRef.current)
      setStatus('paused')
    },

    // Resume from a specific history snapshot index (used by RaceGrid after scrubbing)
    resumeFrom(snapIdx) {
      workerRef.current?.terminate()
      workerRef.current = null
      clearInterval(statsTimerRef.current)

      const h = historyRef.current
      if (h.length === 0) return
      const clampedIdx = Math.max(0, Math.min(snapIdx, h.length - 1))
      const snap = h[clampedIdx]

      // Truncate history to the scrubbed position and restore state
      historyRef.current       = h.slice(0, clampedIdx + 1)
      currentSortedRef.current = new Set(snap.sorted)
      lastStatsRef.current     = { cmp: snap.cmp, acc: snap.acc }
      startTimeRef.current     = performance.now() - (snap.animTime ?? 0) * 1000
      audioManager.resume()

      // Restore visual state from snapshot
      arrayRef.current = snap.array.slice()
      highlightRef.current = {
        comparing: [],
        swapping:  snap.swapping,
        sorted:    new Set(snap.sorted),
      }

      setStatus('running')
      setStats(s => s
        ? { ...s, cmp: snap.cmp, acc: snap.acc, animTime: snap.animTime ?? s.animTime }
        : { cmp: snap.cmp, acc: snap.acc, cpuTime: null, animTime: snap.animTime ?? 0 })

      _startStatsTimer()

      const { algorithm, initialArray, delay } = propsRef.current
      const worker = new Worker(new URL('../workers/sortWorker.js', import.meta.url))
      workerRef.current = worker
      _attachOnMessage(worker)
      worker.postMessage({ array: [...initialArray], delay, algorithm, fastForwardSwaps: clampedIdx })
    },

    stop() {
      workerRef.current?.terminate()
      workerRef.current = null
      clearInterval(statsTimerRef.current)
      setStats(null)
      setStatus('idle')
      arrayRef.current = [...propsRef.current.initialArray]
      highlightRef.current = { comparing: [], swapping: [], sorted: new Set() }
      resetSignalRef.current += 1
    },

    historyLength: () => historyRef.current.length,

    scrubTo(step) {
      const h = historyRef.current
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
    },
  }))

  return (
    <div className="flex flex-col min-h-0 h-full gap-1">
      <div className="relative flex-1 min-h-0 rounded-xl border border-white/[0.06] bg-[#0c0c14] overflow-hidden">
        <CanvasRenderer arrayRef={arrayRef} highlightRef={highlightRef} resetSignalRef={resetSignalRef} />
        <div className="absolute top-2 left-3 flex items-center gap-2">
          <a href={WIKI_URLS[algorithm]} target="_blank" rel="noreferrer"
            className="text-xs text-slate-500 font-medium underline underline-offset-2 decoration-slate-600
              hover:text-slate-300 hover:decoration-slate-400 transition-colors duration-150">
            {algorithm}
          </a>
          {status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-[#f8c23c] animate-pulse" />}
          {status === 'done'    && <span className="text-xs text-[#47b8ad] font-semibold">✓ Bitti</span>}
          {status === 'paused'  && <span className="text-xs text-[#ed6b69]/80 font-medium">⏸</span>}
        </div>
      </div>

      <div className="flex items-center gap-3 px-0.5 flex-wrap min-h-[18px]">
        <PanelStat label="Karşılaştırma" value={stats?.cmp?.toLocaleString()}  color="text-[#f8c23c]" />
        <PanelStat label="Dizi Erişimi"  value={stats?.acc?.toLocaleString()}  color="text-[#ed6b69]" />
        <PanelStat label="Saf CPU"
          value={stats?.cpuTime != null ? `${stats.cpuTime.toFixed(3)} ms` : null}
          color="text-[#47b8ad]" />
        <PanelStat label="Süre"
          value={stats?.animTime != null ? `${stats.animTime} s` : null}
          color="text-[#8fa3c8]" />
      </div>
    </div>
  )
})

function PanelStat({ label, value, color }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-slate-600 text-[10px]">{label}</span>
      <span className={`text-[10px] font-mono font-semibold ${color}`}>{value ?? '—'}</span>
    </div>
  )
}

export default RacePanel
