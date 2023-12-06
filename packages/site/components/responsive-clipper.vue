<template>
  <div ref="container" class="responsive-clip-path container ">

    <svg class="svg-clip-path">
      <defs>
        <clipPath v-if="clipPath" :id="`clip-path-${clipPathElementId}`">
          <path clip-rule="evenodd" :d="clipPath" fill="none" />
        </clipPath>
      </defs>
    </svg>

    <div ref="svgSlot" class="svg-slot">
      <slot name="svg-path"></slot>
    </div>

    <div
      class="clipped-content"
      :style="{ width: `${clipPathData.rangeX}px`, height: `${clipPathData.rangeY}px`, clipPath: `url(#clip-path-${clipPathElementId})` }">
      <slot name="clipped-content"></slot>
    </div>

    <canvas v-if="props.displayGuides" ref="canvas"></canvas>

    <div class="overlay-content">
      <slot name="overlay-content"></slot>
    </div>

  </div>
</template>

<script setup>
// ====================================================================== Import
import { parseSVG } from 'svg-path-parser'

// ======================================================================= Props
const props = defineProps({
  displayGuides: {
    type: Boolean,
    required: false,
    default: false
  },
  breakpointsX: {
    type: Array,
    required: false,
    default: () => []
  },
  breakpointsY: {
    type: Array,
    required: false,
    default: () => []
  }
})
// ======================================================================== Data
const clipPathElementId = ref(zeroUuid().v4())
const svgSlot = ref(null)
const originalPath = ref('')
const container = ref(null)
const canvas= ref(null)
const width = ref(0)
const height = ref(0)
const resizeEventListener = ref(false)

// ==================================================================== Computed
const svgPathData = computed(() => originalPath.value ? getSvgPathData(originalPath.value) : false)

const startPointsX = computed(() => {
  const arr = []
  props.breakpointsX.forEach((el, i) => { if (i % 2 === 0) { arr.push(el) }})
  return arr
})

const startPointsY = computed(() => {
  const arr = []
  props.breakpointsY.forEach((el, i) => { if (i % 2 === 0) { arr.push(el) }})
  return arr
})

const maxDeltasX = computed(() => {
  const arr = []
  for (let i = 0; i < props.breakpointsX.length; i = i + 2) {
    arr.push(props.breakpointsX[i + 1] - props.breakpointsX[i])
  }
  return arr
})

const maxDeltasY = computed(() => {
  const arr = []
  for (let i = 0; i < props.breakpointsY.length; i = i + 2) {
    arr.push(props.breakpointsY[i + 1] - props.breakpointsY[i])
  }
  return arr
})

const clipPath = computed(() => {
  if (props.displayGuides) {
    return originalPath.value
  }
  if (svgPathData.value && width.value) {
    const globalDeltaX = svgPathData.value.rangeX - width.value
    const globalDeltaY = svgPathData.value.rangeY - height.value
    const paths = [originalPath.value]
    let shiftX = 0
    let gen = 0
    for (let i = gen; i < maxDeltasX.value.length; i++) {
      const delta = Math.min(globalDeltaX / maxDeltasX.value.length, maxDeltasX.value[i])
      const nextPath = contractPathRegion(paths[i], startPointsX.value[i] - shiftX, delta, 'horizontal')
      paths.push(nextPath)
      shiftX = shiftX + delta
      gen++
    }
    let shiftY = 0
    for (let i = 0; i < maxDeltasY.value.length; i++) {
      const delta = Math.min(globalDeltaY / maxDeltasY.value.length, maxDeltasY.value[i])
      const nextPath = contractPathRegion(paths[i + gen], startPointsY.value[i] - shiftY, delta, 'vertical')
      paths.push(nextPath)
      shiftY = shiftY + delta
    }
    return paths[paths.length - 1]
  }
  return false
})

const clipPathData = computed(() => clipPath.value ? getSvgPathData(clipPath.value) : false)

// ==================================================================== Watchers
watch(clipPath, () => {
  if (props.displayGuides) {
    drawClipRegions()
  }
})

// ======================================================================= Hooks
onMounted(() => {
  originalPath.value = findPathElement()
  resizeDimensions()
  resizeEventListener.value = zeroThrottle(() => { resizeDimensions() }, 50)
  window.addEventListener('resize', resizeEventListener.value)
})

onBeforeUnmount(() => {
  if (resizeEventListener.value) {
    window.removeEventListener('resize', resizeEventListener.value)
  }
})

// ===================================================================== Methods
const findPathElement = () => {
  const slot = svgSlot.value
  if (slot) {
    const pathEl = slot.querySelector('path')
    if (pathEl) {
      return pathEl.getAttribute('d')
    }
  }
  return null
}

const parsePathData = (path) => {
  const moves = path.split(/(?<=[MmLlHhVvCcSsQqTtAaZz])/).map(move => move.trim())
  const parsed = []
  moves.forEach((move) => {
    if (move.length > 1) {
      parsed.push(move.substring(0, move.length - 1).trim(), move.charAt(move.length - 1))
    } else {
      parsed.push(move)
    }
  })
  return parsed.map(item => item.split(' '))
}

const contractPathRegion = (path, start, dif, type) => {
  const parsed = parsePathData(path)
  const remainder = type === 'horizontal' ? 0 : 1
  parsed.forEach((arr, i) => {
    const val = parseFloat(arr[0])
    if (!isNaN(val)) {
      const vals = arr.map(num => parseFloat(num))
      const cmd = parsed[i - 1]
      if (!['V', 'v', 'H', 'h'].includes(cmd[0])) {
        vals.forEach((num, j) => {
          if (j % 2 === remainder && num > start) {
            parsed[i][j] = num - dif
          }
        })
      }
      if (((type === 'horizontal' && cmd[0] === 'H') || (type === 'vertical' && cmd[0] === 'V')) && vals[0] > start) {
        parsed[i][0] = vals[0] - dif
      }
    }
  })
  return parsed.flat().join(' ')
}

const drawClipRegions = () => {
  if (canvas.value && clipPathData.value) {
    const w = clipPathData.value.rangeX
    const h = clipPathData.value.rangeY
    canvas.value.width = w
    canvas.value.height = h
    const ctx = canvas.value.getContext("2d")
    for (let i = 0; i < props.breakpointsX.length; i++) {
      const x = props.breakpointsX[i]
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.strokeStyle = 'red'
      ctx.stroke()
    }
    for (let i = 0; i < props.breakpointsY.length; i++) {
      const y = props.breakpointsY[i]
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.strokeStyle = 'black'
      ctx.stroke()
    }
  }
}

const resizeDimensions = () => {
  const ctn = container.value
  const rect = ctn.getBoundingClientRect()
  width.value = rect.width
  height.value = rect.height
}

const getSvgPathData = (path) => {
  const commands = parseSVG(path)
  
  const xValues = commands.map(el => {
    const coords = []
    Object.keys(el).forEach((key) => {
      if (key.charAt(0) === 'x') { coords.push(el[key]) }
    })
    return coords
  }).flat()
  
  const yValues = commands.map(el => {
    const coords = []
    Object.keys(el).forEach((key) => {
      if (key.charAt(0) === 'y') { coords.push(el[key]) }
    })
    return coords
  }).flat()
  
  const bounds = {
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
    minY: Math.min(...yValues),
    maxY: Math.max(...yValues)
  }
  
  const rangeX = Math.abs(bounds.maxX - bounds.minX)
  const rangeY = Math.abs(bounds.maxY - bounds.minY)
  
  return {
    rangeX,
    rangeY,
    commands,
    path
  }
}

</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.container {
  position: relative;
}

.container,
.clip-wrapper {
  width: 100%;
  height: 100%;
}

.clip-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.svg-slot,
.svg-clip-path {
  position: absolute;
  top: -9999px;
  left: -9999px;
  width: 0;
  height: 0;
}

.clipped-content {
  position: absolute;
  top: 0;
  left: 0;
}

.overlay-content {
  position: relative;
}

canvas {
  position: absolute;
}
</style>