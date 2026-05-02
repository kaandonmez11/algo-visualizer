import { create } from 'zustand'

function makeRandom(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * size) + 1)
}

function makeReversed(size) {
  return Array.from({ length: size }, (_, i) => size - i)
}

function makeNearlySorted(size) {
  const arr = Array.from({ length: size }, (_, i) => i + 1)
  const swapCount = Math.max(1, Math.floor(size * 0.05))
  for (let k = 0; k < swapCount; k++) {
    const a = Math.floor(Math.random() * size)
    const b = Math.floor(Math.random() * size)
    ;[arr[a], arr[b]] = [arr[b], arr[a]]
  }
  return arr
}

function parseCustom(input) {
  const nums = input
    .split(',')
    .map(s => Number(s.trim()))
    .filter(n => Number.isFinite(n) && n > 0)
  return nums.length > 0 ? nums : null
}

const useStore = create((set, get) => ({
  // Shared source array — cloned into each instance on start
  initialArray: [],

  // Multi-instance map: { [id]: { array, algo, isRunning, isFinished, comparisons, swaps, cpuTime } }
  instances: {},

  generateArray(size, type, customInput = '') {
    let arr
    if (type === 'custom') {
      arr = parseCustom(customInput) ?? makeRandom(size)
    } else if (type === 'reversed') {
      arr = makeReversed(size)
    } else if (type === 'nearly') {
      arr = makeNearlySorted(size)
    } else {
      arr = makeRandom(size)
    }
    set({ initialArray: arr })
    return arr
  },

  createInstance(id, algo) {
    const { initialArray } = get()
    set(state => ({
      instances: {
        ...state.instances,
        [id]: {
          array: [...initialArray],
          algo,
          isRunning: false,
          isFinished: false,
          comparisons: 0,
          swaps: 0,
          cpuTime: null,
          highlightedIndices: [],
        },
      },
    }))
  },

  updateInstance(id, patch) {
    set(state => ({
      instances: {
        ...state.instances,
        [id]: { ...state.instances[id], ...patch },
      },
    }))
  },

  removeInstance(id) {
    set(state => {
      const next = { ...state.instances }
      delete next[id]
      return { instances: next }
    })
  },
}))

export default useStore
