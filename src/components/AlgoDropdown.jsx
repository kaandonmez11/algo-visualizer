import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'

export const ALGORITHMS = [
  'Bubble Sort',
  'Selection Sort',
  'Insertion Sort',
  'Merge Sort',
  'Quick Sort',
  'Heap Sort',
]

export default function AlgoDropdown({ value, onChange, disabled = false, compact = false }) {
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
    if (disabled) return
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 6, left: r.left, width: r.width })
    }
    setOpen(o => !o)
  }

  const btnCls = compact
    ? 'h-7 text-xs min-w-[130px] px-2.5'
    : 'h-9 text-sm min-w-[160px] px-3'

  return (
    <>
      <button ref={btnRef} onClick={handleOpen} disabled={disabled}
        className={`${btnCls} flex items-center justify-between gap-2
          rounded-lg bg-white/5 border border-white/10 text-slate-200
          hover:bg-white/10 hover:border-[#6177a9]/50 transition-all duration-200
          focus:outline-none focus:border-[#6177a9]/70
          disabled:opacity-40 disabled:cursor-not-allowed`}>
        <span className="truncate">{value}</span>
        <ChevronDown size={compact ? 12 : 14}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && createPortal(
        <ul ref={menuRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 9999 }}
          className="bg-[#0f0f1a] border border-white/10 rounded-lg shadow-xl shadow-black/50 overflow-hidden py-1">
          {ALGORITHMS.map(algo => (
            <li key={algo} onClick={() => { onChange(algo); setOpen(false) }}
              className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors duration-150
                ${value === algo
                  ? 'bg-[#6177a9]/20 text-[#8fa3c8]'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
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
