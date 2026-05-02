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

const FAST = {
  'Bubble Sort':    bubbleFast,
  'Selection Sort': selectionFast,
  'Insertion Sort': insertionFast,
  'Merge Sort':     (a) => mergeFast(a),
  'Quick Sort':     (a) => quickFast(a),
  'Heap Sort':      heapFast,
}

// ── Generators (cmp = comparisons, acc = array accesses) ──────────────────────
// compare: +2 accesses (2 reads)
// swap:    +4 accesses (2 reads + 2 writes)
// merge write: +2 accesses (1 read from buffer + 1 write to arr)

function* bubbleSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      cmp++; acc += 2
      yield { type: 'compare', indices: [j, j+1], cmp, acc }
      if (arr[j] > arr[j+1]) {
        const t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t
        acc += 4
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
      const t = arr[i]; arr[i] = arr[m]; arr[m] = t
      acc += 4
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
        const t = arr[j]; arr[j] = arr[j-1]; arr[j-1] = t
        acc += 4
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
        acc += 2  // 1 read from buffer + 1 write to arr
        k++
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
          const t = arr[i]; arr[i] = arr[j]; arr[j] = t
          acc += 4
          yield { type: 'swap', indices: [i, j], array: arr.slice(), cmp, acc }
        }
      }
    }
    const pi = i + 1
    if (pi !== hi) {
      const t = arr[pi]; arr[pi] = arr[hi]; arr[hi] = t
      acc += 4
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
      const t = arr[root]; arr[root] = arr[lg]; arr[lg] = t
      acc += 4
      yield { type: 'swap', indices: [root, lg], array: arr.slice(), cmp, acc }
      yield* sift(size, lg)
    }
  }

  for (let i = Math.floor(n/2)-1; i >= 0; i--) yield* sift(n, i)
  for (let i = n-1; i > 0; i--) {
    const t = arr[0]; arr[0] = arr[i]; arr[i] = t
    acc += 4
    yield { type: 'swap', indices: [0, i], array: arr.slice(), cmp, acc }
    yield { type: 'sorted-index', index: i }
    yield* sift(i, 0)
  }
  yield { type: 'sorted-index', index: 0 }
}

const GENS = {
  'Bubble Sort':    bubbleSortGen,
  'Selection Sort': selectionSortGen,
  'Insertion Sort': insertionSortGen,
  'Merge Sort':     mergeSortGen,
  'Quick Sort':     quickSortGen,
  'Heap Sort':      heapSortGen,
}

// ── Worker entry ──────────────────────────────────────────────────────────────
self.onmessage = function (e) {
  const { array, delay, algorithm = 'Bubble Sort' } = e.data

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

  function tick() {
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
