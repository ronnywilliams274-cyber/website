import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const PINKS = ['#ffd1e3', '#f7a8c8', '#f0428b', '#c21e66']

function rand(seed) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) / 2147483647)
}

/** Draws the sublimation wrap. Front of the tumbler is the horizontal center of the canvas. */
function paintWrap(ctx, w, h, name, pal = PINKS) {
  const r = rand(7)
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, pal[0]); g.addColorStop(0.35, pal[1]); g.addColorStop(0.75, pal[2]); g.addColorStop(1, pal[3])
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  // glitter field, denser at the bottom like a real ombre glitter wrap
  for (let i = 0; i < 9000; i++) {
    const y = Math.pow(r(), 0.6) * h
    const x = r() * w
    const s = r() * 3.2 + 0.6
    ctx.fillStyle = r() > 0.55 ? `rgba(255,255,255,${0.25 + r() * 0.6})` : `rgba(255,214,235,${0.2 + r() * 0.5})`
    ctx.fillRect(x, y, s, s)
  }

  // scattered hearts and four-point sparkles
  const heart = (x, y, s, c) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = c
    ctx.beginPath(); ctx.moveTo(0, 6)
    ctx.bezierCurveTo(-10, -2, -6, -12, 0, -6); ctx.bezierCurveTo(6, -12, 10, -2, 0, 6)
    ctx.fill(); ctx.restore()
  }
  const spark = (x, y, s, c) => {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = c; ctx.beginPath()
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2); ctx.moveTo(0, 0); ctx.quadraticCurveTo(s * 0.12, s * 0.12, 0, s); ctx.quadraticCurveTo(-s * 0.12, s * 0.12, 0, 0)
    }
    ctx.fill(); ctx.restore()
  }
  for (let i = 0; i < 46; i++) {
    const x = r() * w, y = r() * h
    if (Math.abs(x - w / 2) < w * 0.2 && Math.abs(y - h * 0.5) < h * 0.22) continue
    r() > 0.45 ? heart(x, y, 1.6 + r() * 2.6, 'rgba(255,255,255,0.85)') : spark(x, y, 18 + r() * 34, 'rgba(255,255,255,0.95)')
  }

  // the name, set in the display face with a white "vinyl" outline
  const label = (name || 'Your name').slice(0, 18)
  const maxW = w * 0.34
  let size = 300
  ctx.font = `${size}px Shrikhand, Georgia, serif`
  while (ctx.measureText(label).width > maxW && size > 60) {
    size -= 6
    ctx.font = `${size}px Shrikhand, Georgia, serif`
  }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  const cx = w / 2, cy = h * 0.5
  ctx.lineJoin = 'round'
  ctx.shadowColor = 'rgba(80,0,30,0.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10
  ctx.lineWidth = size * 0.16; ctx.strokeStyle = '#ffffff'; ctx.strokeText(label, cx, cy)
  ctx.shadowColor = 'transparent'
  ctx.fillStyle = '#1b0e15'
  ctx.fillText(label, cx, cy)
  ctx.font = `600 42px "Instrument Sans Variable", sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.fillText('made with love by Ammie', cx, cy + size * 0.62 + 30)
}

export function createTumblerScene(canvas, { name = 'Ammie', reduced = false, wrap = PINKS, gemColors = null } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
  camera.position.set(0, 0.25, 7.4)

  const key = new THREE.DirectionalLight('#fff0f6', 2.2); key.position.set(3, 4, 5); scene.add(key)
  const rim = new THREE.DirectionalLight('#ff6fa8', 3); rim.position.set(-4, 1, -3); scene.add(rim)
  scene.add(new THREE.AmbientLight('#ffe3ee', 0.4))

  // --- tumbler ---
  const tumbler = new THREE.Group()
  scene.add(tumbler)
  const H = 2.6, RT = 0.5, RB = 0.42

  const wrapCanvas = document.createElement('canvas')
  wrapCanvas.width = 2048; wrapCanvas.height = 1880
  const wctx = wrapCanvas.getContext('2d')
  const wrapTex = new THREE.CanvasTexture(wrapCanvas)
  wrapTex.colorSpace = THREE.SRGBColorSpace
  wrapTex.anisotropy = renderer.capabilities.getMaxAnisotropy()

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(RT, RB, H, 128, 1, true, Math.PI, Math.PI * 2),
    new THREE.MeshPhysicalMaterial({ map: wrapTex, roughness: 0.32, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.06, side: THREE.DoubleSide })
  )
  tumbler.add(body)

  const steel = new THREE.MeshStandardMaterial({ color: '#e7e9ef', metalness: 1, roughness: 0.18 })
  const base = new THREE.Mesh(new THREE.CylinderGeometry(RB, RB * 0.97, 0.06, 96), steel)
  base.position.y = -H / 2 - 0.03; tumbler.add(base)
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(RT * 1.005, RT * 1.005, 0.14, 96, 1, true), steel)
  lip.position.y = H / 2 + 0.07; tumbler.add(lip)

  const clear = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.05, metalness: 0, transmission: 1, thickness: 0.3, ior: 1.45, transparent: true, opacity: 0.55 })
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(RT * 1.03, RT * 1.03, 0.2, 96), clear)
  lid.position.y = H / 2 + 0.24; tumbler.add(lid)
  const lidTop = new THREE.Mesh(new THREE.TorusGeometry(RT * 0.92, 0.035, 16, 96), clear)
  lidTop.rotation.x = Math.PI / 2; lidTop.position.y = H / 2 + 0.34; tumbler.add(lidTop)

  const straw = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1.5, 24),
    new THREE.MeshPhysicalMaterial({ color: '#ff8fbd', roughness: 0.1, transmission: 0.6, thickness: 0.1, transparent: true, opacity: 0.9 })
  )
  straw.position.set(0.12, H / 2 + 0.85, -0.05); straw.rotation.z = -0.08; tumbler.add(straw)

  tumbler.rotation.z = -0.12

  // --- rhinestones ---
  const gemGeo = new THREE.OctahedronGeometry(0.075, 0)
  gemGeo.scale(1, 0.7, 1)
  const gemMat = new THREE.MeshStandardMaterial({ metalness: 0.85, roughness: 0.08, flatShading: true, envMapIntensity: 2.2, emissive: '#3a0a1c', emissiveIntensity: 0.15 })
  const COUNT = 74
  const gems = new THREE.InstancedMesh(gemGeo, gemMat, COUNT)
  const r = rand(42)
  const gemData = []
  const tints = [new THREE.Color('#ffffff'), new THREE.Color('#ffffff'), new THREE.Color('#ffc2da'), new THREE.Color('#f0428b'), new THREE.Color('#ffd98a')]
  for (let i = 0; i < COUNT; i++) {
    gemData.push({
      a: r() * Math.PI * 2,
      rad: 1.2 + r() * 1.3,
      y: (r() - 0.5) * 3.2,
      sp: (0.08 + r() * 0.22) * (r() > 0.5 ? 1 : -1) * 0.6,
      s: 0.5 + r() * 1.1,
      spin: r() * 3,
    })
    gems.setColorAt(i, tints[Math.floor(r() * tints.length)])
  }
  scene.add(gems)
  const dummy = new THREE.Object3D()

  // --- twinkles ---
  const starGeo = new THREE.BufferGeometry()
  const sp = new Float32Array(160 * 3)
  for (let i = 0; i < 160; i++) { sp[i * 3] = (r() - 0.5) * 7; sp[i * 3 + 1] = (r() - 0.5) * 5; sp[i * 3 + 2] = (r() - 0.5) * 3 - 1 }
  starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3))
  const starTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d')
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.2, 'rgba(255,220,236,0.8)'); g.addColorStop(1, 'rgba(255,255,255,0)')
    x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c)
  })()
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.09, map: starTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  scene.add(stars)

  // --- state ---
  let currentName = name
  let palette = wrap
  const repaint = () => { paintWrap(wctx, wrapCanvas.width, wrapCanvas.height, currentName, palette); wrapTex.needsUpdate = true }
  const tintGems = (cols) => {
    const cs = cols.map((c) => new THREE.Color(c))
    for (let i = 0; i < COUNT; i++) gems.setColorAt(i, cs[i % cs.length])
    gems.instanceColor.needsUpdate = true
  }
  if (gemColors) tintGems(gemColors)
  repaint()
  // repaint again once the display font is ready so the name uses Shrikhand
  if (document.fonts?.load) document.fonts.load('300px Shrikhand').then(repaint).catch(() => {})

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  let progress = 0
  let spinCur = 0, spinTarget = 0
  const onMove = (e) => { mouse.tx = (e.clientX / window.innerWidth) * 2 - 1; mouse.ty = (e.clientY / window.innerHeight) * 2 - 1 }
  window.addEventListener('pointermove', onMove, { passive: true })

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.position.z = w / h < 0.8 ? 9.2 : 7.4
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize()

  let visible = true
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
  io.observe(canvas)

  const clock = new THREE.Timer()
  let raf = 0
  const frame = () => {
    raf = requestAnimationFrame(frame)
    if (!visible) return
    clock.update()
    const t = clock.getElapsed()
    mouse.x += (mouse.tx - mouse.x) * 0.06
    mouse.y += (mouse.ty - mouse.y) * 0.06
    spinCur += (spinTarget - spinCur) * 0.05

    const idle = reduced ? 0 : Math.sin(t * 0.45) * 0.55
    tumbler.rotation.y = idle + progress * Math.PI * 1.4 + mouse.x * 0.5 + spinCur
    tumbler.rotation.x = mouse.y * 0.12
    tumbler.position.y = (reduced ? 0 : Math.sin(t * 1.1) * 0.06) - progress * 0.8

    for (let i = 0; i < COUNT; i++) {
      const g = gemData[i]
      const a = g.a + (reduced ? 0 : t * g.sp) + progress * 1.5
      dummy.position.set(Math.cos(a) * g.rad, g.y + Math.sin(t * 0.7 + i) * 0.05 - progress * 0.4, Math.sin(a) * g.rad * 0.6)
      dummy.rotation.set(t * g.spin * 0.3, t * g.spin * 0.5 + i, 0)
      dummy.scale.setScalar(g.s * (1 - progress * 0.4))
      dummy.updateMatrix()
      gems.setMatrixAt(i, dummy.matrix)
    }
    gems.instanceMatrix.needsUpdate = true
    gems.rotation.x = mouse.y * 0.15
    stars.material.opacity = 0.55 + Math.sin(t * 2.3) * 0.35
    stars.rotation.y = mouse.x * 0.1
    renderer.render(scene, camera)
  }
  frame()

  return {
    setName(n) { currentName = n; repaint() },
    setPalette(w, g) { palette = w; repaint(); if (g) tintGems(g); rim.color.set(w[2]) },
    setProgress(p) { progress = p },
    spin() { if (!reduced) spinTarget += Math.PI * 2 },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      window.removeEventListener('pointermove', onMove)
      scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose()) })
      wrapTex.dispose(); starTex.dispose(); pmrem.dispose(); renderer.dispose()
    },
  }
}
