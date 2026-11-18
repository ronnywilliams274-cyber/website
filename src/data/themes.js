// Five girly themes. Each one sets the CSS tokens and the 3D tumbler palette.
// Token roles:
//   bg        page background            surface   cards, sheets, light sections
//   text      main text                  text2     secondary text
//   accent    signature color            accentInk accent used as text/links on surfaces
//   soft      tinted fills, outlines     line      hairlines and input borders
//   deep      contrast sections          onDeep    headings on deep sections, onDeep2 body text there
//   gem       highlight color            btn/btnFg dark buttons
//   glass     translucent glass fill     glow      shadow tint (r,g,b)
//   onAccent  text placed on the accent color
export const THEMES = [
  {
    id: 'bubblegum',
    name: 'Bubblegum Pop',
    note: 'Hot pink and glitter, the classic',
    mode: 'bright',
    tokens: {
      bg: '#fcd9e6', surface: '#fff8fb', text: '#1b0e15', text2: '#4a2f3c',
      accent: '#f0428b', accentInk: '#c21e66', soft: '#f9c3d7', line: '#f1c7d8',
      deep: '#1b0e15', onDeep: '#fcd9e6', onDeep2: '#dadde6', gem: '#e3b04b',
      btn: '#1b0e15', btnFg: '#ffffff', glass: 'rgba(255, 248, 251, 0.55)', onAccent: '#ffffff', glow: '194, 30, 102',
      blobA: '#ff8fbd', blobB: '#ffd36b', blobC: '#c9a7ff',
    },
    wrap: ['#ffc7dd', '#f7a8c8', '#f0428b', '#c21e66'],
    gems: ['#ffffff', '#ffffff', '#ffc2da', '#f0428b', '#ffd98a'],
    swatch: ['#f0428b', '#fcd9e6', '#1b0e15'],
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    note: 'Soft lilac with a pink sparkle',
    mode: 'bright',
    tokens: {
      bg: '#ebe2ff', surface: '#fbf8ff', text: '#22163a', text2: '#564a70',
      accent: '#9b5cff', accentInk: '#7438dc', soft: '#d8c6ff', line: '#d9cdf5',
      deep: '#2a1d48', onDeep: '#ebe2ff', onDeep2: '#d6cfe9', gem: '#ff8fc8',
      btn: '#22163a', btnFg: '#ffffff', glass: 'rgba(251, 248, 255, 0.55)', onAccent: '#ffffff', glow: '116, 56, 220',
      blobA: '#c3a2ff', blobB: '#ff9bd2', blobC: '#9fd8ff',
    },
    wrap: ['#efe6ff', '#cdb4ff', '#9b5cff', '#6430c4'],
    gems: ['#ffffff', '#ffffff', '#e2d2ff', '#ff8fc8', '#b48cff'],
    swatch: ['#9b5cff', '#ebe2ff', '#ff8fc8'],
  },
  {
    id: 'peach',
    name: 'Peach Sorbet',
    note: 'Coral, peach and a little gold',
    mode: 'bright',
    tokens: {
      bg: '#ffe2d4', surface: '#fff9f5', text: '#3a1a14', text2: '#6b4237',
      accent: '#ff6f7d', accentInk: '#d63d55', soft: '#ffc6b3', line: '#f8cdbd',
      deep: '#4a1f2a', onDeep: '#ffe2d4', onDeep2: '#f4d9cf', gem: '#ffc85a',
      btn: '#3a1a14', btnFg: '#ffffff', glass: 'rgba(255, 249, 245, 0.55)', onAccent: '#3a1a14', glow: '214, 61, 85',
      blobA: '#ff9a8b', blobB: '#ffd36b', blobC: '#ffb3d1',
    },
    wrap: ['#fff0e6', '#ffc2a8', '#ff7f8a', '#d63d55'],
    gems: ['#ffffff', '#ffffff', '#ffd9c7', '#ff6f7d', '#ffc85a'],
    swatch: ['#ff6f7d', '#ffe2d4', '#ffc85a'],
  },
  {
    id: 'rose',
    name: 'Midnight Rosé',
    note: 'Black velvet, rose pink and rose gold',
    mode: 'dark',
    tokens: {
      bg: '#1a0c14', surface: '#24111c', text: '#ffe6f0', text2: '#d6afc1',
      accent: '#ff5fa2', accentInk: '#ff8fc0', soft: '#4a2236', line: '#40202f',
      deep: '#0f060b', onDeep: '#ffd3e5', onDeep2: '#cbb3bf', gem: '#f1c38c',
      btn: '#ff5fa2', btnFg: '#1a0c14', glass: 'rgba(42, 18, 31, 0.5)', onAccent: '#1a0c14', glow: '255, 95, 162',
      blobA: '#ff5fa2', blobB: '#f1c38c', blobC: '#8a3cff',
    },
    wrap: ['#ffd1e3', '#ff8fbd', '#e0367f', '#5a0f33'],
    gems: ['#ffffff', '#ffd9a8', '#ff8fbd', '#ff5fa2', '#f1c38c'],
    swatch: ['#ff5fa2', '#1a0c14', '#f1c38c'],
  },
  {
    id: 'galaxy',
    name: 'Sugarplum Galaxy',
    note: 'Starry violet with neon pink',
    mode: 'dark',
    tokens: {
      bg: '#140f2b', surface: '#1d1640', text: '#f3ebff', text2: '#c2b5e6',
      accent: '#d07bff', accentInk: '#e5b3ff', soft: '#372b6b', line: '#2f2659',
      deep: '#0a071d', onDeep: '#ead9ff', onDeep2: '#bfb2dd', gem: '#ff7ccf',
      btn: '#d07bff', btnFg: '#140f2b', glass: 'rgba(32, 24, 70, 0.5)', onAccent: '#140f2b', glow: '208, 123, 255',
      blobA: '#b46bff', blobB: '#ff7ccf', blobC: '#5ec8ff',
    },
    wrap: ['#f2d9ff', '#c79bff', '#8f4dff', '#3a1a8c'],
    gems: ['#ffffff', '#e5b3ff', '#ff7ccf', '#9fe3ff', '#d07bff'],
    swatch: ['#d07bff', '#140f2b', '#ff7ccf'],
  },
]

export const THEME_KEY = 'ammies-theme'
export const getTheme = (id) => THEMES.find((t) => t.id === id) || THEMES[0]

const kebab = (s) => s.replace(/[A-Z0-9]/g, (m) => `-${m.toLowerCase()}`)

export function applyTheme(id) {
  const t = getTheme(id)
  const root = document.documentElement
  Object.entries(t.tokens).forEach(([k, v]) => root.style.setProperty(`--${kebab(k)}`, v))
  root.dataset.theme = t.id
  root.dataset.mode = t.mode
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t.tokens.accent)
  try { localStorage.setItem(THEME_KEY, t.id) } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent('ammies:theme', { detail: t }))
  return t
}

export function savedThemeId() {
  try { return localStorage.getItem(THEME_KEY) || THEMES[0].id } catch { return THEMES[0].id }
}
