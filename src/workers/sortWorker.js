// Bubble Sort — pure speed (no yielding), used for CPU timing
function bubbleSortFast(arr) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
}

// Bubble Sort — generator, yields each compare and swap
function* bubbleSortGen(arr) {
  const n = arr.length
  let comparisons = 0
  let swaps = 0
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++
      yield { type: 'compare', indices: [j, j + 1], comparisons, swaps }
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swaps++
        yield { type: 'swap', indices: [j, j + 1], array: [...arr], comparisons, swaps }
      }
    }
  }
}

self.onmessage = function (e) {
  const { array, delay } = e.data

  // Always measure pure CPU time on a separate copy
  const cpuArr = [...array]
  const t0 = performance.now()
  bubbleSortFast(cpuArr)
  const cpuTime = +(performance.now() - t0).toFixed(3)

  // delay = 0 → stress test mode, return immediately
  if (delay === 0) {
    self.postMessage({ type: 'done', array: cpuArr, cpuTime, comparisons: 0, swaps: 0 })
    return
  }

  // Animated mode — step through generator with setTimeout
  const animArr = [...array]
  const gen = bubbleSortGen(animArr)

  function tick() {
    const { value, done } = gen.next()
    if (done) {
      self.postMessage({ type: 'done', array: animArr, cpuTime, comparisons: value?.comparisons ?? 0, swaps: value?.swaps ?? 0 })
      return
    }
    self.postMessage({ type: 'step', ...value })
    setTimeout(tick, delay)
  }

  tick()
}
