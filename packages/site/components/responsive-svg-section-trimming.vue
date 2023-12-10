<template>
  <div ref="container" class="responsive-clip-path container">

    <svg class="svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        v-if="path"
        :d="path"
        stroke="url(#paint0_linear_3240_2539)"
        stroke-width="4"
        :fill="fill" />
      <defs>
        <linearGradient
          id="paint0_linear_3240_2539"
          x1="217"
          y1="32.001"
          x2="1231"
          y2="140.001"
          gradientUnits="userSpaceOnUse">
          <stop offset="0.127596" stop-color="#4737FF" />
          <stop offset="1" stop-color="#E0FF9D" />
        </linearGradient>
      </defs>
    </svg>

    <canvas v-if="props.displayGuides" ref="canvas"></canvas>

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
  breakpointsMobileX: {
    type: Array,
    required: false,
    default: () => []
  },
  breakpointsY: {
    type: Array,
    required: false,
    default: () => []
  },
  breakpointsMobileY: {
    type: Array,
    required: false,
    default: () => []
  },
  trimType: {
    type: String,
    required: false,
    default: 'after'
  },
  fill: {
    type: String,
    required: false,
    default: 'none'
  },
  closedPath: {
    type: Boolean,
    required: false,
    default: false
  }
})
// ======================================================================== Data
const originalPath = ref('')
const container = ref(null)
const canvas= ref(null)
const width = ref(0)
const height = ref(0)
const resizeEventListener = ref(false)
const mobile = ref(false)

// ==================================================================== Computed
const svgPathData = computed(() => originalPath.value ? getSvgPathData(originalPath.value) : false)

const startPointsX = computed(() => {
  const arr = []
  const breakpoints = mobile.value ? props.breakpointsMobileX : props.breakpointsX
  breakpoints.forEach((el, i) => { if (i % 2 === 0) { arr.push(el) }})
  return arr
})

const startPointsY = computed(() => {
  const arr = []
  const breakpoints = mobile.value ? props.breakpointsMobileY : props.breakpointsY
  breakpoints.forEach((el, i) => { if (i % 2 === 0) { arr.push(el) }})
  return arr
})

const maxDeltasX = computed(() => {
  const arr = []
  const breakpoints = mobile.value ? props.breakpointsMobileX : props.breakpointsX
  for (let i = 0; i < breakpoints.length; i = i + 2) {
    arr.push(breakpoints[i + 1] - breakpoints[i])
  }
  return arr
})

const maxDeltasY = computed(() => {
  const arr = []
  const breakpoints = mobile.value ? props.breakpointsMobileY : props.breakpointsY
  for (let i = 0; i < breakpoints.length; i = i + 2) {
    arr.push(breakpoints[i + 1] - breakpoints[i])
  }
  return arr
})

const path = computed(() => {
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

const pathData = computed(() => path.value ? getSvgPathData(path.value) : false)

// ==================================================================== Watchers
watch(path, () => {
  if (props.displayGuides) {
    drawClipRegions()
  }
})

watch(mobile, (val) => {
  if (val) {
    originalPath.value = props.trimType === 'after' ?
      'M 379.636 0 V 38.6654 C 379.636 49.711 370.682 58.665 359.636 58.665 H 208.201 C 195.056 58.665 182.796 52.043 175.589 41.049 V 41.049 C 168.382 30.0559 156.122 23.4332 142.977 23.4332 H 20.0744 C 8.9997 23.4332 0.0334 14.4335 0.0745 3.3589 L 0 0' :
      'M 379.636 99 V 39 H 333.987 C 321.379 39 309.871 31.8225 304.324 20.5 V 20.5 C 298.778 9.1775 287.269 2 274.661 2 H 108.201 C 95.0559 2 82.7955 8.6227 75.5889 19.6161 V 19.6161 C 68.3822 30.6096 56.1218 37.2323 42.9768 37.2323 H 0 L 0.3096 99'
  } else {
    originalPath.value = props.trimType === 'after' ?
    'M 1371 0 L 1371 80 C 1371 105.505 1355.3 117.107 1346.78 121.524 C 1343.34 123.306 1339.46 123.818 1335.59 123.818 H 897.199 C 856.755 123.818 818.082 107.222 790.216 77.9089 V 77.9089 C 762.351 48.5955 723.678 32 683.233 32 H 34.0566 C 30.2455 32 26.4492 31.3143 23.1498 29.4068 C 16.0083 25.2781 3.7555 16.0978 0 0' :
    'M 1380 134 C 1377 91 1350.93 93.5494 1350.93 93.5494 C 1350.93 93.5494 1350.93 93.5494 1350.93 93.5494 H 1227.85 C 1200.5 93.5494 1174.14 83.3668 1153.9 64.9868 L 1116.02 30.5902 C 1095.76 12.196 1069.38 2.0124 1042.01 2.0276 L 329.294 2.4261 C 292.895 2.4465 258.473 18.9864 235.714 47.3918 L 234.103 49.4014 C 211.329 77.8252 176.878 94.3672 140.456 94.3672 H 25.4454 C 25.0069 94.3672 24.5771 94.3559 24.1391 94.3792 C 20.4236 94.5773 2 97.3502 2 134'
  }
})

// ======================================================================= Hooks
onMounted(() => {
  originalPath.value = props.trimType === 'after' ?
    'M 1371 0 L 1371 80 C 1371 105.505 1355.3 117.107 1346.78 121.524 C 1343.34 123.306 1339.46 123.818 1335.59 123.818 H 897.199 C 856.755 123.818 818.082 107.222 790.216 77.9089 V 77.9089 C 762.351 48.5955 723.678 32 683.233 32 H 34.0566 C 30.2455 32 26.4492 31.3143 23.1498 29.4068 C 16.0083 25.2781 3.7555 16.0978 0 0' :
    'M 1380 134 C 1377 91 1350.93 93.5494 1350.93 93.5494 C 1350.93 93.5494 1350.93 93.5494 1350.93 93.5494 H 1227.85 C 1200.5 93.5494 1174.14 83.3668 1153.9 64.9868 L 1116.02 30.5902 C 1095.76 12.196 1069.38 2.0124 1042.01 2.0276 L 329.294 2.4261 C 292.895 2.4465 258.473 18.9864 235.714 47.3918 L 234.103 49.4014 C 211.329 77.8252 176.878 94.3672 140.456 94.3672 H 25.4454 C 25.0069 94.3672 24.5771 94.3559 24.1391 94.3792 C 20.4236 94.5773 2 97.3502 2 134'
  resizeDimensions()
  resizeEventListener.value = zeroThrottle(() => { resizeDimensions() }, 50)
  window.addEventListener('resize', resizeEventListener.value)
  setTimeout(() => { resizeDimensions() }, 500)
})

onBeforeUnmount(() => {
  if (resizeEventListener.value) {
    window.removeEventListener('resize', resizeEventListener.value)
  }
})

// ===================================================================== Methods
const parsePathData = (path) => {
  const moves = path.split(/(?<=[MmLlHhVvCcSsQqTtAaZz])/).map(move => move.trim())
  const parsed = []
  // console.log(moves)
  moves.forEach((move, i) => {
    if (move.length > 1) {
      if (i === moves.length - 1 && !props.closedPath) {
        parsed.push(move.trim())
      } else {
        parsed.push(move.substring(0, move.length - 1).trim(), move.charAt(move.length - 1))
      }
    } else {
      parsed.push(move)
    }
  })
  // console.log(parsed)
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
  if (canvas.value && pathData.value) {
    const w = pathData.value.rangeX
    const h = pathData.value.rangeY
    canvas.value.width = w
    canvas.value.height = h
    const ctx = canvas.value.getContext("2d")
    const breakpointsX = mobile.value ? props.breakpointsMobileX : props.breakpointsX
    for (let i = 0; i < breakpointsX.length; i++) {
      const x = breakpointsX[i]
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.strokeStyle = 'red'
      ctx.stroke()
    }
    const breakpointsY = mobile.value ? props.breakpointsMobileY : props.breakpointsY
    for (let i = 0; i < breakpointsY.length; i++) {
      const y = breakpointsY[i]
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.strokeStyle = 'red'
      ctx.stroke()
    }
  }
}

const resizeDimensions = () => {
  if (window.matchMedia('(max-width: 53.125rem)').matches) {
    if (!mobile.value) {
      mobile.value = true
    }
  } else {
    if (mobile.value) {
      mobile.value = false
    }
  }
  const ctn = container.value
  if (ctn) {
    const rect = ctn.getBoundingClientRect()
    width.value = rect.width
    height.value = rect.height
  }
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
.container,
.svg {
  position: relative;
  width: 100%;
  height: 100%;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>