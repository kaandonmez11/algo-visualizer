import { useState, useRef, useEffect, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'

const ALGO_GROUPS = [
  { label: 'En Hızlılar',  algos: ['Counting Sort', 'Pigeonhole Sort', 'Bucket Sort', 'Radix Sort'] },
  { label: 'Verimli',      algos: ['Tim Sort', 'Intro Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort', 'Shell Sort'] },
  { label: 'Temel',        algos: ['Bubble Sort', 'Selection Sort', 'Insertion Sort'] },
  { label: 'Egzotik',      algos: ['Cocktail Shaker Sort', 'Gnome Sort', 'Comb Sort', 'Odd-Even Sort', 'Cycle Sort', 'Bitonic Sort', 'Strand Sort', 'Pancake Sort', 'Tree Sort'] },
  { label: 'Komik',        algos: ['Bogo Sort', 'Stooge Sort', 'Sleep Sort', 'Stalin Sort'] },
]

export const ALGORITHMS = ALGO_GROUPS.flatMap(g => g.algos)

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
          style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 9999, maxHeight: '70vh' }}
          className="algo-dropdown-menu bg-[#0f0f1a] border border-white/10 rounded-lg shadow-xl shadow-black/50 overflow-y-auto py-1">
          {ALGO_GROUPS.map((group, gi) => (
            <Fragment key={group.label}>
              <li className={`px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 select-none pointer-events-none ${gi === 0 ? 'pt-2' : 'pt-3'}`}>
                {group.label}
              </li>
              {group.algos.map(algo => (
                <li key={algo} onClick={() => { onChange(algo); setOpen(false) }}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-colors duration-150
                    ${value === algo
                      ? 'bg-[#6177a9]/20 text-[#8fa3c8]'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                  <span className={`w-3 text-[#f8c23c] text-xs shrink-0 ${value === algo ? 'opacity-100' : 'opacity-0'}`}>✓</span>
                  {algo}
                </li>
              ))}
            </Fragment>
          ))}
        </ul>,
        document.body
      )}
    </>
  )
}
