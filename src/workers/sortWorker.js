// ── Fast sorts (CPU timing only) ──────────────────────────────────────────────
function bubbleFast(arr) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++)
    for (let j = 0; j < n - i - 1; j++)
      if (arr[j] > arr[j + 1]) { const t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t }
}
function selectionFast(arr) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let m = i
    for (let j = i + 1; j < n; j++) if (arr[j] < arr[m]) m = j
    if (m !== i) { const t = arr[i]; arr[i] = arr[m]; arr[m] = t }
  }
}
function insertionFast(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]; let j = i - 1
    while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j-- }
    arr[j + 1] = key
  }
}
function mergeFast(arr, l = 0, r = arr.length - 1) {
  if (l >= r) return
  const m = (l + r) >> 1
  mergeFast(arr, l, m); mergeFast(arr, m + 1, r)
  const tmp = arr.slice(l, r + 1)
  let i = 0, j = m - l + 1, k = l
  while (i <= m - l && j <= r - l) arr[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++]
  while (i <= m - l) arr[k++] = tmp[i++]
  while (j <= r - l) arr[k++] = tmp[j++]
}
function quickFast(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return
  const p = arr[hi]; let i = lo - 1
  for (let j = lo; j < hi; j++)
    if (arr[j] <= p) { i++; const t = arr[i]; arr[i] = arr[j]; arr[j] = t }
  const t = arr[i + 1]; arr[i + 1] = arr[hi]; arr[hi] = t
  const pi = i + 1
  quickFast(arr, lo, pi - 1); quickFast(arr, pi + 1, hi)
}
function heapFast(arr) {
  const n = arr.length
  function sift(n, i) {
    let lg = i, l = 2*i+1, r = 2*i+2
    if (l < n && arr[l] > arr[lg]) lg = l
    if (r < n && arr[r] > arr[lg]) lg = r
    if (lg !== i) { const t = arr[i]; arr[i] = arr[lg]; arr[lg] = t; sift(n, lg) }
  }
  for (let i = Math.floor(n/2)-1; i >= 0; i--) sift(n, i)
  for (let i = n-1; i > 0; i--) { const t = arr[0]; arr[0] = arr[i]; arr[i] = t; sift(i, 0) }
}
function radixFast(arr) {
  const max = Math.max(...arr)
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const out = new Array(arr.length), cnt = new Array(10).fill(0)
    for (let i = 0; i < arr.length; i++) cnt[Math.floor(arr[i] / exp) % 10]++
    for (let i = 1; i < 10; i++) cnt[i] += cnt[i - 1]
    for (let i = arr.length - 1; i >= 0; i--) out[--cnt[Math.floor(arr[i] / exp) % 10]] = arr[i]
    for (let i = 0; i < arr.length; i++) arr[i] = out[i]
  }
}
function shellFast(arr) {
  let gap = 1
  while (gap < arr.length / 3) gap = gap * 3 + 1
  while (gap >= 1) {
    for (let i = gap; i < arr.length; i++) {
      const key = arr[i]; let j = i
      while (j >= gap && arr[j - gap] > key) { arr[j] = arr[j - gap]; j -= gap }
      arr[j] = key
    }
    gap = Math.floor(gap / 3)
  }
}
function cocktailFast(arr) {
  let lo = 0, hi = arr.length - 1
  while (lo < hi) {
    for (let i = lo; i < hi; i++) if (arr[i] > arr[i+1]) { const t = arr[i]; arr[i] = arr[i+1]; arr[i+1] = t }
    hi--
    for (let i = hi; i > lo; i--) if (arr[i] < arr[i-1]) { const t = arr[i]; arr[i] = arr[i-1]; arr[i-1] = t }
    lo++
  }
}
function gnomeFast(arr) {
  let i = 0
  while (i < arr.length) {
    if (i === 0 || arr[i] >= arr[i-1]) i++
    else { const t = arr[i]; arr[i] = arr[i-1]; arr[i-1] = t; i-- }
  }
}
function bitonicFast(arr) {
  const n = arr.length
  const p = 1 << Math.ceil(Math.log2(Math.max(n, 2)))
  const a = [...arr, ...Array(p - n).fill(Infinity)]
  for (let k = 2; k <= p; k <<= 1)
    for (let j = k >> 1; j >= 1; j >>= 1)
      for (let i = 0; i < p; i++) {
        const l = i ^ j
        if (l > i && ((i & k) === 0 ? a[i] > a[l] : a[i] < a[l])) { const t = a[i]; a[i] = a[l]; a[l] = t }
      }
  for (let i = 0; i < n; i++) arr[i] = a[i]
}
function pancakeFast(arr) {
  const flip = k => { let lo = 0, hi = k; while (lo < hi) { const t = arr[lo]; arr[lo] = arr[hi]; arr[hi] = t; lo++; hi-- } }
  for (let size = arr.length - 1; size > 0; size--) {
    let mx = 0
    for (let i = 1; i <= size; i++) if (arr[i] > arr[mx]) mx = i
    if (mx < size) { if (mx > 0) flip(mx); flip(size) }
  }
}
function combFast(arr) {
  let gap = arr.length, sorted = false
  while (!sorted) {
    gap = Math.max(1, Math.floor(gap / 1.3)); sorted = gap === 1
    for (let i = 0; i + gap < arr.length; i++)
      if (arr[i] > arr[i+gap]) { const t = arr[i]; arr[i] = arr[i+gap]; arr[i+gap] = t; sorted = false }
  }
}
function oddEvenFast(arr) {
  const n = arr.length; let sorted = false
  while (!sorted) {
    sorted = true
    for (let i = 1; i < n-1; i += 2) if (arr[i] > arr[i+1]) { const t = arr[i]; arr[i] = arr[i+1]; arr[i+1] = t; sorted = false }
    for (let i = 0; i < n-1; i += 2) if (arr[i] > arr[i+1]) { const t = arr[i]; arr[i] = arr[i+1]; arr[i+1] = t; sorted = false }
  }
}
function bogoFast(arr) { arr.sort((a, b) => a - b) }

const FAST = {
  'Bubble Sort':          bubbleFast,
  'Selection Sort':       selectionFast,
  'Insertion Sort':       insertionFast,
  'Merge Sort':           (a) => mergeFast(a),
  'Quick Sort':           (a) => quickFast(a),
  'Heap Sort':            heapFast,
  'Radix Sort':           radixFast,
  'Shell Sort':           shellFast,
  'Cocktail Shaker Sort': cocktailFast,
  'Gnome Sort':           gnomeFast,
  'Bitonic Sort':         bitonicFast,
  'Pancake Sort':         pancakeFast,
  'Comb Sort':            combFast,
  'Odd-Even Sort':        oddEvenFast,
  'Bogo Sort':            bogoFast,
}

// ── Generators (cmp = comparisons, acc = array accesses) ──────────────────────
// compare: +2 accesses (2 reads)
// swap:    +4 accesses (2 reads + 2 writes)

function* bubbleSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      cmp++; acc += 2
      yield { type: 'compare', indices: [j, j+1], cmp, acc }
      if (arr[j] > arr[j+1]) {
        const t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t; acc += 4
        yield { type: 'swap', indices: [j, j+1], array: arr.slice(), cmp, acc }
      }
    }
    yield { type: 'sorted-index', index: n-1-i }
  }
  yield { type: 'sorted-index', index: 0 }
}

function* selectionSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  for (let i = 0; i < n - 1; i++) {
    let m = i
    for (let j = i + 1; j < n; j++) {
      cmp++; acc += 2
      yield { type: 'compare', indices: [m, j], cmp, acc }
      if (arr[j] < arr[m]) m = j
    }
    if (m !== i) {
      const t = arr[i]; arr[i] = arr[m]; arr[m] = t; acc += 4
      yield { type: 'swap', indices: [i, m], array: arr.slice(), cmp, acc }
    }
    yield { type: 'sorted-index', index: i }
  }
  yield { type: 'sorted-index', index: n-1 }
}

function* insertionSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  yield { type: 'sorted-upto', index: 0 }
  for (let i = 1; i < n; i++) {
    let j = i
    while (j > 0) {
      cmp++; acc += 2
      yield { type: 'compare', indices: [j-1, j], cmp, acc }
      if (arr[j] < arr[j-1]) {
        const t = arr[j]; arr[j] = arr[j-1]; arr[j-1] = t; acc += 4
        yield { type: 'swap', indices: [j, j-1], array: arr.slice(), cmp, acc }
        j--
      } else break
    }
    yield { type: 'sorted-upto', index: i }
  }
}

function* mergeSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  for (let w = 1; w < n; w *= 2) {
    for (let lo = 0; lo < n; lo += 2 * w) {
      const mid = Math.min(lo + w, n)
      const hi  = Math.min(lo + 2 * w, n)
      const L = arr.slice(lo, mid), R = arr.slice(mid, hi)
      let i = 0, j = 0, k = lo
      while (i < L.length && j < R.length) {
        cmp++; acc += 2
        yield { type: 'compare', indices: [lo + i, mid + j], cmp, acc }
        if (L[i] <= R[j]) { arr[k] = L[i++] } else { arr[k] = R[j++] }
        acc += 2; k++
        yield { type: 'swap', indices: [k-1, k-1], array: arr.slice(), cmp, acc }
      }
      while (i < L.length) { arr[k++] = L[i++]; acc += 2 }
      while (j < R.length) { arr[k++] = R[j++]; acc += 2 }
    }
  }
}

function* quickSortGen(arr) {
  let cmp = 0, acc = 0
  const stack = [[0, arr.length - 1]]
  while (stack.length > 0) {
    const [lo, hi] = stack.pop()
    if (lo >= hi) {
      if (lo === hi) yield { type: 'sorted-index', index: lo }
      continue
    }
    const pivot = arr[hi]; let i = lo - 1
    for (let j = lo; j < hi; j++) {
      cmp++; acc += 2
      yield { type: 'compare', indices: [j, hi], cmp, acc }
      if (arr[j] <= pivot) {
        i++
        if (i !== j) {
          const t = arr[i]; arr[i] = arr[j]; arr[j] = t; acc += 4
          yield { type: 'swap', indices: [i, j], array: arr.slice(), cmp, acc }
        }
      }
    }
    const pi = i + 1
    if (pi !== hi) {
      const t = arr[pi]; arr[pi] = arr[hi]; arr[hi] = t; acc += 4
      yield { type: 'swap', indices: [pi, hi], array: arr.slice(), cmp, acc }
    }
    yield { type: 'sorted-index', index: pi }
    stack.push([lo, pi - 1])
    stack.push([pi + 1, hi])
  }
}

function* heapSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  function* sift(size, root) {
    let lg = root, l = 2*root+1, r = 2*root+2
    if (l < size) { cmp++; acc += 2; yield { type: 'compare', indices: [l, lg], cmp, acc }; if (arr[l] > arr[lg]) lg = l }
    if (r < size) { cmp++; acc += 2; yield { type: 'compare', indices: [r, lg], cmp, acc }; if (arr[r] > arr[lg]) lg = r }
    if (lg !== root) {
      const t = arr[root]; arr[root] = arr[lg]; arr[lg] = t; acc += 4
      yield { type: 'swap', indices: [root, lg], array: arr.slice(), cmp, acc }
      yield* sift(size, lg)
    }
  }
  for (let i = Math.floor(n/2)-1; i >= 0; i--) yield* sift(n, i)
  for (let i = n-1; i > 0; i--) {
    const t = arr[0]; arr[0] = arr[i]; arr[i] = t; acc += 4
    yield { type: 'swap', indices: [0, i], array: arr.slice(), cmp, acc }
    yield { type: 'sorted-index', index: i }
    yield* sift(i, 0)
  }
  yield { type: 'sorted-index', index: 0 }
}

function* radixSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  const max = Math.max(...arr)
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const out = new Array(n), cnt = new Array(10).fill(0)
    for (let i = 0; i < n; i++) {
      cmp++; acc += 1
      yield { type: 'compare', indices: [i, i], cmp, acc }
      cnt[Math.floor(arr[i] / exp) % 10]++
    }
    for (let i = 1; i < 10; i++) cnt[i] += cnt[i-1]
    for (let i = n - 1; i >= 0; i--) { out[--cnt[Math.floor(arr[i] / exp) % 10]] = arr[i]; acc += 2 }
    for (let i = 0; i < n; i++) {
      if (arr[i] !== out[i]) {
        arr[i] = out[i]; acc += 2
        yield { type: 'swap', indices: [i, i], array: arr.slice(), cmp, acc }
      }
    }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted-index', index: i }
}

function* shellSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  let gap = 1
  while (gap < n / 3) gap = gap * 3 + 1
  while (gap >= 1) {
    for (let i = gap; i < n; i++) {
      let j = i
      while (j >= gap) {
        cmp++; acc += 2
        yield { type: 'compare', indices: [j - gap, j], cmp, acc }
        if (arr[j] < arr[j - gap]) {
          const t = arr[j]; arr[j] = arr[j-gap]; arr[j-gap] = t; acc += 4
          yield { type: 'swap', indices: [j, j-gap], array: arr.slice(), cmp, acc }
          j -= gap
        } else break
      }
    }
    gap = Math.floor(gap / 3)
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted-index', index: i }
}

function* cocktailSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  let lo = 0, hi = n - 1
  while (lo < hi) {
    for (let i = lo; i < hi; i++) {
      cmp++; acc += 2
      yield { type: 'compare', indices: [i, i+1], cmp, acc }
      if (arr[i] > arr[i+1]) {
        const t = arr[i]; arr[i] = arr[i+1]; arr[i+1] = t; acc += 4
        yield { type: 'swap', indices: [i, i+1], array: arr.slice(), cmp, acc }
      }
    }
    yield { type: 'sorted-index', index: hi }
    hi--
    for (let i = hi; i > lo; i--) {
      cmp++; acc += 2
      yield { type: 'compare', indices: [i-1, i], cmp, acc }
      if (arr[i] < arr[i-1]) {
        const t = arr[i]; arr[i] = arr[i-1]; arr[i-1] = t; acc += 4
        yield { type: 'swap', indices: [i-1, i], array: arr.slice(), cmp, acc }
      }
    }
    yield { type: 'sorted-index', index: lo }
    lo++
  }
  if (lo === hi) yield { type: 'sorted-index', index: lo }
}

function* gnomeSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  let i = 0
  while (i < n) {
    if (i === 0) { i++; continue }
    cmp++; acc += 2
    yield { type: 'compare', indices: [i-1, i], cmp, acc }
    if (arr[i] >= arr[i-1]) { i++ }
    else {
      const t = arr[i]; arr[i] = arr[i-1]; arr[i-1] = t; acc += 4
      yield { type: 'swap', indices: [i, i-1], array: arr.slice(), cmp, acc }
      i--
    }
  }
  for (let j = 0; j < n; j++) yield { type: 'sorted-index', index: j }
}

function* bitonicSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  const p = 1 << Math.ceil(Math.log2(Math.max(n, 2)))
  const a = [...arr, ...Array(p - n).fill(Infinity)]
  for (let k = 2; k <= p; k <<= 1) {
    for (let j = k >> 1; j >= 1; j >>= 1) {
      for (let i = 0; i < p; i++) {
        const l = i ^ j
        if (l <= i) continue
        const shouldSwap = (i & k) === 0 ? a[i] > a[l] : a[i] < a[l]
        if (i < n && l < n) {
          cmp++; acc += 2
          yield { type: 'compare', indices: [i, l], cmp, acc }
        }
        if (shouldSwap) {
          const t = a[i]; a[i] = a[l]; a[l] = t
          if (i < n && l < n) {
            acc += 4
            yield { type: 'swap', indices: [i, l], array: a.slice(0, n), cmp, acc }
          }
        }
      }
    }
  }
  for (let i = 0; i < n; i++) arr[i] = a[i]
  for (let i = 0; i < n; i++) yield { type: 'sorted-index', index: i }
}

function* pancakeSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  function* _flip(k) {
    let lo = 0, hi = k
    while (lo < hi) {
      const t = arr[lo]; arr[lo] = arr[hi]; arr[hi] = t; acc += 4
      yield { type: 'swap', indices: [lo, hi], array: arr.slice(), cmp, acc }
      lo++; hi--
    }
  }
  for (let size = n - 1; size > 0; size--) {
    let mx = 0
    for (let i = 1; i <= size; i++) {
      cmp++; acc += 2
      yield { type: 'compare', indices: [mx, i], cmp, acc }
      if (arr[i] > arr[mx]) mx = i
    }
    if (mx < size) {
      if (mx > 0) yield* _flip(mx)
      yield* _flip(size)
    }
    yield { type: 'sorted-index', index: size }
  }
  yield { type: 'sorted-index', index: 0 }
}

function* combSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  let gap = n, sorted = false
  while (!sorted) {
    gap = Math.max(1, Math.floor(gap / 1.3))
    sorted = gap === 1
    for (let i = 0; i + gap < n; i++) {
      cmp++; acc += 2
      yield { type: 'compare', indices: [i, i+gap], cmp, acc }
      if (arr[i] > arr[i+gap]) {
        const t = arr[i]; arr[i] = arr[i+gap]; arr[i+gap] = t; acc += 4
        yield { type: 'swap', indices: [i, i+gap], array: arr.slice(), cmp, acc }
        sorted = false
      }
    }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted-index', index: i }
}

function* oddEvenSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  let sorted = false
  while (!sorted) {
    sorted = true
    for (let i = 1; i < n - 1; i += 2) {
      cmp++; acc += 2
      yield { type: 'compare', indices: [i, i+1], cmp, acc }
      if (arr[i] > arr[i+1]) {
        const t = arr[i]; arr[i] = arr[i+1]; arr[i+1] = t; acc += 4
        yield { type: 'swap', indices: [i, i+1], array: arr.slice(), cmp, acc }
        sorted = false
      }
    }
    for (let i = 0; i < n - 1; i += 2) {
      cmp++; acc += 2
      yield { type: 'compare', indices: [i, i+1], cmp, acc }
      if (arr[i] > arr[i+1]) {
        const t = arr[i]; arr[i] = arr[i+1]; arr[i+1] = t; acc += 4
        yield { type: 'swap', indices: [i, i+1], array: arr.slice(), cmp, acc }
        sorted = false
      }
    }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted-index', index: i }
}

function* bogoSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  let sorted = false
  for (let attempt = 0; attempt < 100; attempt++) {
    sorted = true
    for (let i = 0; i < n - 1; i++) {
      cmp++; acc += 2
      yield { type: 'compare', indices: [i, i+1], cmp, acc }
      if (arr[i] > arr[i+1]) sorted = false
    }
    if (sorted) break
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t; acc += 4
      yield { type: 'swap', indices: [i, j], array: arr.slice(), cmp, acc }
    }
  }
  if (!sorted) {
    arr.sort((a, b) => a - b)
    yield { type: 'swap', indices: [0, n-1], array: arr.slice(), cmp, acc }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted-index', index: i }
}

const GENS = {
  'Bubble Sort':          bubbleSortGen,
  'Selection Sort':       selectionSortGen,
  'Insertion Sort':       insertionSortGen,
  'Merge Sort':           mergeSortGen,
  'Quick Sort':           quickSortGen,
  'Heap Sort':            heapSortGen,
  'Radix Sort':           radixSortGen,
  'Shell Sort':           shellSortGen,
  'Cocktail Shaker Sort': cocktailSortGen,
  'Gnome Sort':           gnomeSortGen,
  'Bitonic Sort':         bitonicSortGen,
  'Pancake Sort':         pancakeSortGen,
  'Comb Sort':            combSortGen,
  'Odd-Even Sort':        oddEvenSortGen,
  'Bogo Sort':            bogoSortGen,
}

// ── Worker entry ──────────────────────────────────────────────────────────────
let _paused  = false
let _resume  = null

self.onmessage = function (e) {
  if (e.data?.type === 'pause')  { _paused = true;  return }
  if (e.data?.type === 'resume') { _paused = false; _resume?.(); _resume = null; return }

  const { array, delay, algorithm = 'Bubble Sort', fastForwardSwaps = 0 } = e.data
  _paused = false
  _resume = null

  const cpuArr = [...array]
  const t0 = performance.now()
  ;(FAST[algorithm] ?? bubbleFast)(cpuArr)
  const cpuTime = +(performance.now() - t0).toFixed(4)

  if (delay === 0) {
    self.postMessage({ type: 'done', array: cpuArr, cpuTime, cmp: 0, acc: 0 })
    return
  }

  const animArr = [...array]
  const gen = (GENS[algorithm] ?? bubbleSortGen)(animArr)
  let lastCmp = 0, lastAcc = 0

  // Synchronous fast-forward to resume from a scrubbed snapshot
  if (fastForwardSwaps > 0) {
    let ffSwaps = 0
    while (ffSwaps < fastForwardSwaps) {
      const { value, done } = gen.next()
      if (done) {
        self.postMessage({ type: 'done', array: animArr, cpuTime, cmp: lastCmp, acc: lastAcc })
        return
      }
      if (value.cmp !== undefined) lastCmp = value.cmp
      if (value.acc !== undefined) lastAcc = value.acc
      if (value.type === 'swap') ffSwaps++
    }
  }

  function tick() {
    if (_paused) { _resume = tick; return }
    const { value, done } = gen.next()
    if (done) {
      self.postMessage({ type: 'done', array: animArr, cpuTime, cmp: lastCmp, acc: lastAcc })
      return
    }
    if (value.cmp !== undefined) lastCmp = value.cmp
    if (value.acc !== undefined) lastAcc = value.acc
    self.postMessage(value)
    setTimeout(tick, delay)
  }

  tick()
}
