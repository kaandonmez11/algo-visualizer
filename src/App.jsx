import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Play, Square, Volume2, VolumeX, Shuffle, ArrowDownUp, ChevronDown } from 'lucide-react'

const ALGORITHMS = [
  'Bubble Sort',
  'Selection Sort',
  'Insertion Sort',
  'Merge Sort',
  'Quick Sort',
  'Heap Sort',
]

const ARRAY_TYPES = [
  { value: 'random',   label: 'Rastgele' },
  { value: 'reversed', label: 'Ters Sıralı' },
  { value: 'nearly',   label: 'Neredeyse Sıralı' },
]

function AlgoDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      const insideBtn  = btnRef.current?.contains(e.target)
      const insideMenu = menuRef.current?.contains(e.target)
      if (!insideBtn && !insideMenu) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
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
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="
          h-9 flex items-center justify-between gap-3 min-w-[160px] px-3
          rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200
          hover:bg-white/10 hover:border-[#6177a9]/50 transition-all duration-200
          focus:outline-none focus:border-[#6177a9]/70
        "
      >
        <span>{value}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && createPortal(
        <ul
          ref={menuRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 9999 }}
          className="
            bg-[#0f0f1a] border border-white/10 rounded-lg shadow-xl shadow-black/50
            overflow-hidden py-1
          "
        >
          {ALGORITHMS.map(algo => (
            <li
              key={algo}
              onClick={() => { onChange(algo); setOpen(false) }}
              className={`
                flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors duration-150
                ${value === algo
                  ? 'bg-[#6177a9]/20 text-[#8fa3c8]'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }
              `}
            >
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

function SliderWithInput({ label, value, onChange, min, max, unit = '' }) {
  const clamp = v => Math.min(max, Math.max(min, v))

  return (
    <div className="flex flex-col gap-1.5 min-w-[180px]">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(clamp(Number(e.target.value)))}
          className="flex-1 cursor-pointer"
        />
        <div className="
          h-9 flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden
          focus-within:border-[#6177a9]/60 focus-within:ring-1 focus-within:ring-[#6177a9]/20
          transition-all duration-200
        ">
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={e => onChange(clamp(Number(e.target.value)))}
            className="w-14 h-full px-2 text-sm text-center text-slate-200 bg-transparent outline-none"
          />
          {unit && (
            <span className="pr-2 text-xs text-slate-500 select-none">{unit}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [arraySize,    setArraySize]    = useState(100)
  const [delay,        setDelay]        = useState(50)
  const [arrayType,    setArrayType]    = useState('random')
  const [customInput,  setCustomInput]  = useState('')
  const [selectedAlgo, setSelectedAlgo] = useState(ALGORITHMS[0])
  const [isRunning,    setIsRunning]    = useState(false)
  const [isMuted,      setIsMuted]      = useState(false)

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
          value={arraySize}
          onChange={setArraySize}
          min={10}
          max={500}
        />

        <SliderWithInput
          label="Gecikme"
          value={delay}
          onChange={setDelay}
          min={1}
          max={500}
          unit="ms"
        />

        {/* Array Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400">Dizi Tipi</label>
          <div className="flex gap-1.5">
            {ARRAY_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => setArrayType(type.value)}
                className={`
                  h-9 px-3 rounded-lg text-xs font-medium border transition-all duration-200
                  ${arrayType === type.value
                    ? 'bg-[#f8c23c]/15 border-[#f8c23c]/50 text-[#f8c23c] shadow-sm shadow-[#f8c23c]/10'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }
                `}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-slate-400">Özel Dizi</label>
          <input
            type="text"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="Virgülle ayır: 5, 3, 8, 1..."
            className="
              h-9 px-3 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200
              placeholder:text-slate-600 outline-none transition-all duration-200
              focus:border-[#6177a9]/60 focus:ring-1 focus:ring-[#6177a9]/20
            "
          />
        </div>

        {/* Algorithm Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400">Algoritma</label>
          <AlgoDropdown value={selectedAlgo} onChange={setSelectedAlgo} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2 ml-auto">
          <button
            onClick={() => setIsMuted(m => !m)}
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            className="
              h-9 w-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400
              hover:bg-white/10 hover:text-[#47b8ad] transition-all duration-200
            "
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            title="Yeni Dizi"
            className="
              h-9 flex items-center gap-2 px-4 rounded-lg border border-white/10 bg-white/5
              text-slate-300 text-sm font-medium hover:bg-white/10 hover:text-[#47b8ad]
              hover:border-[#47b8ad]/30 transition-all duration-200 active:scale-95
            "
          >
            <Shuffle size={14} />
            Oluştur
          </button>

          <button
            onClick={() => setIsRunning(r => !r)}
            className={`
              h-9 w-28 flex items-center justify-center gap-2 rounded-lg text-sm font-semibold
              transition-all duration-200 active:scale-95 shadow-lg
              ${isRunning
                ? 'bg-[#ed6b69]/20 hover:bg-[#ed6b69]/30 border border-[#ed6b69]/50 text-[#f29190] shadow-[#ed6b69]/10'
                : 'bg-[#6177a9]/20 hover:bg-[#6177a9]/30 border border-[#6177a9]/50 text-[#8fa3c8] shadow-[#6177a9]/10'
              }
            `}
          >
            {isRunning ? <Square size={14} /> : <Play size={14} />}
            {isRunning ? 'Durdur' : 'Başlat'}
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow — brand blue */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none bg-[#6177a9]/10" />

        <div className="relative w-full h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <ArrowDownUp size={36} className="text-[#6177a9]/50" />
          <p className="text-slate-600 text-sm font-medium">Visualizer buraya render edilecek</p>
          <p className="text-slate-700 text-xs">
            Bir algoritma seç ve <span className="text-[#47b8ad]/70">Başlat</span>'a bas
          </p>
        </div>
      </main>

    </div>
  )
}
