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
function timFast(arr) {
  const RUN = 32, n = arr.length
  for (let i = 0; i < n; i += RUN) {
    const end = Math.min(i + RUN - 1, n - 1)
    for (let j = i + 1; j <= end; j++) {
      const key = arr[j]; let k = j - 1
      while (k >= i && arr[k] > key) { arr[k+1] = arr[k]; k-- }
      arr[k+1] = key
    }
  }
  for (let size = RUN; size < n; size *= 2) {
    for (let lo = 0; lo < n; lo += 2 * size) {
      const mid = Math.min(lo + size - 1, n - 1), hi = Math.min(lo + 2*size - 1, n - 1)
      if (mid >= hi) continue
      const L = arr.slice(lo, mid + 1), R = arr.slice(mid + 1, hi + 1)
      let i = 0, j = 0, k = lo
      while (i < L.length && j < R.length) arr[k++] = L[i] <= R[j] ? L[i++] : R[j++]
      while (i < L.length) arr[k++] = L[i++]
      while (j < R.length) arr[k++] = R[j++]
    }
  }
}
function introFast(arr) {
  const n = arr.length, limit = 2 * Math.floor(Math.log2(n || 1))
  function ins(lo, hi) {
    for (let i = lo+1; i <= hi; i++) { const key=arr[i]; let j=i-1; while (j>=lo&&arr[j]>key){arr[j+1]=arr[j];j--}; arr[j+1]=key }
  }
  function heap(lo, hi) {
    const sz = hi-lo+1
    function sift(sz, i) { let lg=i,l=2*i+1,r=2*i+2; if(l<sz&&arr[lo+l]>arr[lo+lg])lg=l; if(r<sz&&arr[lo+r]>arr[lo+lg])lg=r; if(lg!==i){const t=arr[lo+i];arr[lo+i]=arr[lo+lg];arr[lo+lg]=t;sift(sz,lg)} }
    for (let i=Math.floor(sz/2)-1;i>=0;i--) sift(sz,i)
    for (let i=sz-1;i>0;i--){const t=arr[lo];arr[lo]=arr[lo+i];arr[lo+i]=t;sift(i,0)}
  }
  const st = [[0, n-1, limit]]
  while (st.length) {
    const [lo, hi, d] = st.pop(); if (lo >= hi) continue
    if (hi-lo < 16) { ins(lo, hi); continue }
    if (d === 0)    { heap(lo, hi); continue }
    const p = arr[hi]; let i = lo-1
    for (let j=lo;j<hi;j++) if(arr[j]<=p){i++;const t=arr[i];arr[i]=arr[j];arr[j]=t}
    const t=arr[i+1];arr[i+1]=arr[hi];arr[hi]=t; const pi=i+1
    st.push([lo,pi-1,d-1]); st.push([pi+1,hi,d-1])
  }
}
function countingFast(arr) {
  const max=Math.max(...arr), min=Math.min(...arr), cnt=new Array(max-min+1).fill(0)
  for (const v of arr) cnt[v-min]++
  let k=0; for (let i=0;i<cnt.length;i++) while(cnt[i]-->0) arr[k++]=i+min
}
function bucketFast(arr) {
  const n=arr.length, max=Math.max(...arr), min=Math.min(...arr), range=(max-min)||1, bc=Math.max(1,Math.floor(Math.sqrt(n)))
  const buckets=Array.from({length:bc},()=>[])
  for (const v of arr) buckets[Math.min(bc-1,Math.floor((v-min)/range*bc))].push(v)
  let k=0; for (const b of buckets) { b.sort((a,b)=>a-b); for (const v of b) arr[k++]=v }
}
function pigeonholeFast(arr) {
  const min=Math.min(...arr), holes=new Array(Math.max(...arr)-min+1).fill(0)
  for (const v of arr) holes[v-min]++
  let k=0; for (let i=0;i<holes.length;i++) while(holes[i]-->0) arr[k++]=i+min
}
function cycleFast(arr) {
  const n=arr.length
  for (let s=0;s<n-1;s++) {
    let item=arr[s], pos=s
    for (let i=s+1;i<n;i++) if(arr[i]<item) pos++
    if (pos===s) continue
    while (item===arr[pos]) pos++
    let t=arr[pos];arr[pos]=item;item=t
    while (pos!==s){pos=s;for(let i=s+1;i<n;i++)if(arr[i]<item)pos++;while(item===arr[pos])pos++;t=arr[pos];arr[pos]=item;item=t}
  }
}
function treeFast(arr) {
  class N{constructor(v){this.v=v;this.l=null;this.r=null}}
  let root=null
  function ins(v){const nd=new N(v);if(!root){root=nd;return}let c=root;while(true){if(v<c.v){if(!c.l){c.l=nd;break}c=c.l}else{if(!c.r){c.r=nd;break}c=c.r}}}
  for (const v of arr) ins(v)
  let k=0; function io(n){if(!n)return;io(n.l);arr[k++]=n.v;io(n.r)} io(root)
}
function strandFast(arr) {
  const n=arr.length; let rem=[...arr], result=[]
  while(rem.length){
    const strand=[rem[0]],next=[]
    for(let i=1;i<rem.length;i++)(rem[i]>=strand[strand.length-1]?strand:next).push(rem[i])
    const m=[];let i=0,j=0
    while(i<result.length&&j<strand.length)m.push(result[i]<=strand[j]?result[i++]:strand[j++])
    while(i<result.length)m.push(result[i++]);while(j<strand.length)m.push(strand[j++])
    result=m;rem=next
  }
  for(let i=0;i<n;i++) arr[i]=result[i]
}
function stoogeFast(arr) {
  function stooge(lo,hi){if(arr[hi]<arr[lo]){const t=arr[lo];arr[lo]=arr[hi];arr[hi]=t}const sz=hi-lo+1;if(sz>=3){const t=Math.floor(sz/3);stooge(lo,hi-t);stooge(lo+t,hi);stooge(lo,hi-t)}}
  stooge(0, arr.length-1)
}
function sleepFast(arr)  { arr.sort((a, b) => a - b) }
function stalinFast(arr) { arr.sort((a, b) => a - b) }

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
  'Tim Sort':             timFast,
  'Intro Sort':           introFast,
  'Counting Sort':        countingFast,
  'Bucket Sort':          bucketFast,
  'Pigeonhole Sort':      pigeonholeFast,
  'Cycle Sort':           cycleFast,
  'Tree Sort':            treeFast,
  'Strand Sort':          strandFast,
  'Stooge Sort':          stoogeFast,
  'Sleep Sort':           sleepFast,
  'Stalin Sort':          stalinFast,
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

function* timSortGen(arr) {
  const RUN = 32, n = arr.length; let cmp = 0, acc = 0
  for (let i = 0; i < n; i += RUN) {
    const end = Math.min(i + RUN - 1, n - 1)
    for (let j = i + 1; j <= end; j++) {
      let k = j
      while (k > i) {
        cmp++; acc += 2; yield { type: 'compare', indices: [k-1, k], cmp, acc }
        if (arr[k] < arr[k-1]) { const t=arr[k];arr[k]=arr[k-1];arr[k-1]=t;acc+=4; yield { type:'swap', indices:[k,k-1], array:arr.slice(), cmp, acc }; k-- } else break
      }
    }
  }
  for (let size = RUN; size < n; size *= 2) {
    for (let lo = 0; lo < n; lo += 2 * size) {
      const mid = Math.min(lo + size, n), hi = Math.min(lo + 2*size, n)
      if (mid >= hi) continue
      const L = arr.slice(lo, mid), R = arr.slice(mid, hi)
      let i = 0, j = 0, k = lo
      while (i < L.length && j < R.length) {
        cmp++; acc += 2; yield { type: 'compare', indices: [lo+i, mid+j], cmp, acc }
        arr[k] = L[i] <= R[j] ? L[i++] : R[j++]; acc += 2; k++
        yield { type: 'swap', indices: [k-1, k-1], array: arr.slice(), cmp, acc }
      }
      while (i < L.length) { arr[k++] = L[i++]; acc += 2 }
      while (j < R.length) { arr[k++] = R[j++]; acc += 2 }
    }
  }
}

function* introSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  const limit = 2 * Math.floor(Math.log2(n || 1))
  function* _ins(lo, hi) {
    for (let i = lo+1; i <= hi; i++) {
      let k = i
      while (k > lo) {
        cmp++; acc += 2; yield { type: 'compare', indices: [k-1, k], cmp, acc }
        if (arr[k] < arr[k-1]) { const t=arr[k];arr[k]=arr[k-1];arr[k-1]=t;acc+=4; yield { type:'swap', indices:[k,k-1], array:arr.slice(), cmp, acc }; k-- } else break
      }
    }
  }
  function* _sift(lo, sz, i) {
    let lg=i, l=2*i+1, r=2*i+2
    if (l<sz){cmp++;acc+=2;yield{type:'compare',indices:[lo+l,lo+lg],cmp,acc};if(arr[lo+l]>arr[lo+lg])lg=l}
    if (r<sz){cmp++;acc+=2;yield{type:'compare',indices:[lo+r,lo+lg],cmp,acc};if(arr[lo+r]>arr[lo+lg])lg=r}
    if (lg!==i){const t=arr[lo+i];arr[lo+i]=arr[lo+lg];arr[lo+lg]=t;acc+=4;yield{type:'swap',indices:[lo+i,lo+lg],array:arr.slice(),cmp,acc};yield* _sift(lo,sz,lg)}
  }
  function* _heap(lo, hi) {
    const sz = hi-lo+1
    for (let i=Math.floor(sz/2)-1;i>=0;i--) yield* _sift(lo,sz,i)
    for (let i=sz-1;i>0;i--){const t=arr[lo];arr[lo]=arr[lo+i];arr[lo+i]=t;acc+=4;yield{type:'swap',indices:[lo,lo+i],array:arr.slice(),cmp,acc};yield{type:'sorted-index',index:lo+i};yield* _sift(lo,i,0)}
    yield { type: 'sorted-index', index: lo }
  }
  const st = [[0, n-1, limit]]
  while (st.length) {
    const [lo, hi, d] = st.pop()
    if (lo >= hi) { if (lo===hi) yield { type:'sorted-index', index:lo }; continue }
    if (hi-lo < 16) { yield* _ins(lo, hi); continue }
    if (d === 0)    { yield* _heap(lo, hi); continue }
    const pivot=arr[hi]; let i=lo-1
    for (let j=lo;j<hi;j++){cmp++;acc+=2;yield{type:'compare',indices:[j,hi],cmp,acc};if(arr[j]<=pivot){i++;if(i!==j){const t=arr[i];arr[i]=arr[j];arr[j]=t;acc+=4;yield{type:'swap',indices:[i,j],array:arr.slice(),cmp,acc}}}}
    const pi=i+1
    if(pi!==hi){const t=arr[pi];arr[pi]=arr[hi];arr[hi]=t;acc+=4;yield{type:'swap',indices:[pi,hi],array:arr.slice(),cmp,acc}}
    yield { type:'sorted-index', index:pi }
    st.push([lo,pi-1,d-1]); st.push([pi+1,hi,d-1])
  }
}

function* countingSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  const max=Math.max(...arr), min=Math.min(...arr), cnt=new Array(max-min+1).fill(0)
  for (let i = 0; i < n; i++) { cmp++;acc++;yield{type:'compare',indices:[i,i],cmp,acc};cnt[arr[i]-min]++ }
  let k = 0
  for (let i = 0; i < cnt.length; i++) {
    while (cnt[i]-- > 0) {
      const val=i+min
      if (arr[k]!==val){arr[k]=val;acc+=2;yield{type:'swap',indices:[k,k],array:arr.slice(),cmp,acc}}
      yield { type:'sorted-index', index:k }; k++
    }
  }
}

function* bucketSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  const max=Math.max(...arr), min=Math.min(...arr), range=(max-min)||1, bc=Math.max(1,Math.floor(Math.sqrt(n)))
  const buckets = Array.from({length:bc}, () => [])
  for (let i = 0; i < n; i++) { cmp++;acc++;yield{type:'compare',indices:[i,i],cmp,acc};buckets[Math.min(bc-1,Math.floor((arr[i]-min)/range*bc))].push(arr[i]) }
  let k = 0
  for (const bucket of buckets) {
    for (let i=1;i<bucket.length;i++){const key=bucket[i];let j=i-1;while(j>=0&&bucket[j]>key){bucket[j+1]=bucket[j];j--}bucket[j+1]=key}
    for (const v of bucket) {
      if (arr[k]!==v){arr[k]=v;acc+=2;yield{type:'swap',indices:[k,k],array:arr.slice(),cmp,acc}}
      yield { type:'sorted-index', index:k }; k++
    }
  }
}

function* pigeonholeSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  const min=Math.min(...arr), holes=new Array(Math.max(...arr)-min+1).fill(0)
  for (let i = 0; i < n; i++) { cmp++;acc++;yield{type:'compare',indices:[i,i],cmp,acc};holes[arr[i]-min]++ }
  let k = 0
  for (let i = 0; i < holes.length; i++) {
    while (holes[i]-- > 0) {
      const val=i+min
      if (arr[k]!==val){arr[k]=val;acc+=2;yield{type:'swap',indices:[k,k],array:arr.slice(),cmp,acc}}
      yield { type:'sorted-index', index:k }; k++
    }
  }
}

function* cycleSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  for (let start = 0; start < n-1; start++) {
    let item=arr[start], pos=start
    for(let i=start+1;i<n;i++){cmp++;acc+=2;yield{type:'compare',indices:[start,i],cmp,acc};if(arr[i]<item)pos++}
    if (pos===start){yield{type:'sorted-index',index:start};continue}
    while(item===arr[pos]) pos++
    let t=arr[pos];arr[pos]=item;item=t;acc+=4;yield{type:'swap',indices:[start,pos],array:arr.slice(),cmp,acc}
    while (pos!==start) {
      pos=start
      for(let i=start+1;i<n;i++){cmp++;acc+=2;yield{type:'compare',indices:[start,i],cmp,acc};if(arr[i]<item)pos++}
      while(item===arr[pos]) pos++
      t=arr[pos];arr[pos]=item;item=t;acc+=4;yield{type:'swap',indices:[start,pos],array:arr.slice(),cmp,acc}
    }
    yield { type:'sorted-index', index:start }
  }
  yield { type:'sorted-index', index:n-1 }
}

function* treeSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  class Node{constructor(v){this.v=v;this.l=null;this.r=null}}
  let root = null
  for (let i = 0; i < n; i++) {
    cmp++;acc++;yield{type:'compare',indices:[i,i],cmp,acc}
    const node=new Node(arr[i]); if(!root){root=node;continue}
    let cur=root
    while(true){cmp++;acc+=2;yield{type:'compare',indices:[i,i],cmp,acc};if(arr[i]<cur.v){if(!cur.l){cur.l=node;break}cur=cur.l}else{if(!cur.r){cur.r=node;break}cur=cur.r}}
  }
  let k=0; const stk=[]; let cur=root
  while(cur||stk.length){
    while(cur){stk.push(cur);cur=cur.l}
    cur=stk.pop()
    if(arr[k]!==cur.v){arr[k]=cur.v;acc+=2;yield{type:'swap',indices:[k,k],array:arr.slice(),cmp,acc}}
    yield{type:'sorted-index',index:k};k++;cur=cur.r
  }
}

function* strandSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  // Track values (not indices) so write-back doesn't corrupt unprocessed elements
  let remaining = arr.slice(), resultVals = []
  while (remaining.length > 0) {
    const strand = [remaining[0]], nextRem = []
    const base = resultVals.length
    for (let i = 1; i < remaining.length; i++) {
      cmp++; acc += 2
      const posA = Math.min(base + strand.length - 1, n - 1)
      const posB = Math.min(base + strand.length + nextRem.length, n - 1)
      yield { type: 'compare', indices: [posA, posB], cmp, acc }
      if (remaining[i] >= strand[strand.length - 1]) strand.push(remaining[i])
      else nextRem.push(remaining[i])
    }
    const merged = []; let i = 0, j = 0
    while (i < resultVals.length && j < strand.length) { cmp++; acc += 2; merged.push(resultVals[i] <= strand[j] ? resultVals[i++] : strand[j++]) }
    while (i < resultVals.length) merged.push(resultVals[i++])
    while (j < strand.length) merged.push(strand[j++])
    resultVals.splice(0, resultVals.length, ...merged); remaining = nextRem
    for (let k = 0; k < resultVals.length; k++) { arr[k] = resultVals[k]; acc++; yield { type: 'swap', indices: [k, k], array: arr.slice(), cmp, acc } }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted-index', index: i }
}

function* stoogeSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  function* _stooge(lo, hi) {
    cmp++;acc+=2;yield{type:'compare',indices:[lo,hi],cmp,acc}
    if(arr[hi]<arr[lo]){const t=arr[lo];arr[lo]=arr[hi];arr[hi]=t;acc+=4;yield{type:'swap',indices:[lo,hi],array:arr.slice(),cmp,acc}}
    const sz=hi-lo+1
    if(sz>=3){const t=Math.floor(sz/3);yield* _stooge(lo,hi-t);yield* _stooge(lo+t,hi);yield* _stooge(lo,hi-t)}
  }
  yield* _stooge(0, n-1)
  for(let i=0;i<n;i++) yield{type:'sorted-index',index:i}
}

function* sleepSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  const src=arr.slice()
  const wakeOrder=Array.from({length:n},(_,i)=>i).sort((a,b)=>src[a]-src[b])
  const pos=Array.from({length:n},(_,i)=>i), at=Array.from({length:n},(_,i)=>i)
  for(let k=0;k<n;k++){
    const orig=wakeOrder[k], curPos=pos[orig]
    cmp++;acc++;yield{type:'compare',indices:[curPos,k],cmp,acc}
    if(curPos!==k){
      const t=arr[curPos];arr[curPos]=arr[k];arr[k]=t;acc+=4
      yield{type:'swap',indices:[curPos,k],array:arr.slice(),cmp,acc}
      const dis=at[k];pos[dis]=curPos;at[curPos]=dis;pos[orig]=k;at[k]=orig
    }
    yield{type:'sorted-index',index:k}
  }
}

function* stalinSortGen(arr) {
  const n = arr.length; let cmp = 0, acc = 0
  yield { type: 'sorted-index', index: 0 }
  let maxVal = arr[0], i = 1, end = n - 1
  while (i <= end) {
    cmp++; acc += 2; yield { type: 'compare', indices: [i, i], cmp, acc }
    if (arr[i] >= maxVal) { maxVal = arr[i]; yield { type: 'sorted-index', index: i }; i++ }
    else {
      const t = arr[i]; arr[i] = arr[end]; arr[end] = t; acc += 4
      yield { type: 'swap', indices: [i, end], array: arr.slice(), cmp, acc }
      arr[end] = 0  // eliminate: bar drops to zero height
      yield { type: 'swap', indices: [end, end], array: arr.slice(), cmp, acc }
      end--
    }
  }
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
  'Tim Sort':             timSortGen,
  'Intro Sort':           introSortGen,
  'Counting Sort':        countingSortGen,
  'Bucket Sort':          bucketSortGen,
  'Pigeonhole Sort':      pigeonholeSortGen,
  'Cycle Sort':           cycleSortGen,
  'Tree Sort':            treeSortGen,
  'Strand Sort':          strandSortGen,
  'Stooge Sort':          stoogeSortGen,
  'Sleep Sort':           sleepSortGen,
  'Stalin Sort':          stalinSortGen,
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
  const fn = FAST[algorithm] ?? bubbleFast
  const REPS = array.length > 500 ? 1 : array.length > 100 ? 5 : 20
  const t0 = performance.now()
  fn(cpuArr)
  for (let r = 1; r < REPS; r++) fn([...array])
  const cpuTime = +((performance.now() - t0) / REPS).toFixed(4)

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
