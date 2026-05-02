import { useRef, useEffect } from 'react'

const C = {
  bg:        [10,  10,  15],
  default:   [97,  119, 169],
  comparing: [248, 194, 60],
  swapping:  [237, 107, 105],
  sorted:    [71,  184, 173],
}

function lerp(a, b, t) { return a + (b - a) * t }

function targetColor(i, { comparing, swapping, sorted }) {
  if (swapping.includes(i))  return C.swapping
  if (comparing.includes(i)) return C.comparing
  if (sorted.has(i))         return C.sorted
  return C.default
}

function maxOf(arr) {
  let m = 1
  for (let i = 0; i < arr.length; i++) if (arr[i] > m) m = arr[i]
  return m
}

export default function CanvasRenderer({ arrayRef, highlightRef, resetSignalRef }) {
  const canvasRef = useRef(null)
  const stateRef  = useRef(null)
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    const ro = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect()
      canvas.width  = Math.round(r.width)
      canvas.height = Math.round(r.height)
    })
    ro.observe(canvas)

    function initState(arr) {
      stateRef.current = {
        displayVals: arr.map(v => v),
        colors:      arr.map(() => [...C.default]),
        maxVal:      maxOf(arr),
        lastN:       arr.length,
        lastReset:   resetSignalRef?.current ?? 0,
      }
    }
    initState(arrayRef.current)

    function drawFrame() {
      const arr       = arrayRef.current
      const highlight = highlightRef.current
      const n         = arr.length
      const W         = canvas.width
      const H         = canvas.height

      if (n === 0) {
        ctx.fillStyle = '#0a0a0f'
        ctx.fillRect(0, 0, W, H)
        rafRef.current = requestAnimationFrame(drawFrame)
        return
      }

      // Re-init when reset signal or size changes; update local ref immediately
      let s = stateRef.current
      const currentReset = resetSignalRef?.current ?? 0
      if (s.lastReset !== currentReset || s.lastN !== n) {
        initState(arr)
        s = stateRef.current
      }

      const LERP_V = 0.16
      const LERP_C = 0.13

      for (let i = 0; i < n; i++) {
        s.displayVals[i] = lerp(s.displayVals[i], arr[i], LERP_V)
        const tc = targetColor(i, highlight)
        const sc = s.colors[i]
        sc[0] = lerp(sc[0], tc[0], LERP_C)
        sc[1] = lerp(sc[1], tc[1], LERP_C)
        sc[2] = lerp(sc[2], tc[2], LERP_C)
      }

      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, W, H)

      drawBarChart(ctx, s, n, W, H, highlight)

      rafRef.current = requestAnimationFrame(drawFrame)
    }

    rafRef.current = requestAnimationFrame(drawFrame)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [arrayRef, highlightRef, resetSignalRef])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}

function drawBarChart(ctx, s, n, W, H, highlight) {
  const barW = W / n
  const maxV = s.maxVal

  for (let i = 0; i < n; i++) {
    const barH = (s.displayVals[i] / maxV) * (H - 2)
    const x    = i * barW
    const y    = H - barH
    const [r, g, b] = s.colors[i]
    ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`
    ctx.fillRect(x, y, Math.max(1, barW - 0.8), barH)
  }

  const { comparing } = highlight
  if (comparing.length > 0) {
    ctx.save()
    for (const i of comparing) {
      const barH = (s.displayVals[i] / maxV) * (H - 2)
      const x    = i * barW
      const y    = H - barH
      const [r, g, b] = s.colors[i]
      const col = `rgb(${r|0},${g|0},${b|0})`
      ctx.shadowColor = col
      ctx.shadowBlur  = 14
      ctx.fillStyle   = col
      ctx.fillRect(x, y, Math.max(1, barW - 0.8), barH)
    }
    ctx.shadowBlur = 0
    ctx.restore()
  }
}

function drawScatterPlot(ctx, arr, s, n, W, H) {
  const imageData = ctx.createImageData(W, H)
  const data      = imageData.data
  const maxV      = s.maxVal

  for (let i = 0; i < n; i++) {
    const px = Math.floor((i / n) * W)
    const py = Math.floor(H - (arr[i] / maxV) * (H - 2))
    if (px < 0 || px >= W || py < 0 || py >= H) continue
    const [r, g, b] = s.colors[i]
    const idx = (py * W + px) * 4
    data[idx] = r|0; data[idx+1] = g|0; data[idx+2] = b|0; data[idx+3] = 255
    if (px + 1 < W) {
      const i2 = (py * W + px + 1) * 4
      data[i2] = r|0; data[i2+1] = g|0; data[i2+2] = b|0; data[i2+3] = 255
    }
    if (py + 1 < H) {
      const i3 = ((py+1) * W + px) * 4
      data[i3] = r|0; data[i3+1] = g|0; data[i3+2] = b|0; data[i3+3] = 255
    }
  }
  ctx.putImageData(imageData, 0, 0)
}
