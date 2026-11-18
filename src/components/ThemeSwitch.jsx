import { useEffect, useRef, useState } from 'react'
import { THEMES, applyTheme, getTheme, savedThemeId } from '../data/themes'
import { gsap, reducedMotion } from '../lib/motion'

/**
 * Floating liquid-glass button. Opens a glass palette of themes; picking one
 * reveals it in a circle that grows out of the button (View Transitions API).
 */
export default function ThemeSwitch() {
  const [current, setCurrent] = useState(() => getTheme(savedThemeId()))
  const [open, setOpen] = useState(false)
  const btn = useRef(null)
  const panel = useRef(null)
  const wrap = useRef(null)

  useEffect(() => {
    if (!open) return
    const rm = reducedMotion()
    gsap.fromTo(panel.current, { opacity: 0, y: 16, scale: 0.92, filter: 'blur(8px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: rm ? 0 : 0.5, ease: 'expo.out' })
    if (!rm) gsap.from(panel.current.querySelectorAll('.ts__opt'), { x: 24, opacity: 0, stagger: 0.04, duration: 0.5, ease: 'expo.out', delay: 0.05 })
    const onDoc = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus() } }
    document.addEventListener('pointerdown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  const pick = (t) => {
    if (t.id === current.id) { setOpen(false); return }
    const r = btn.current.getBoundingClientRect()
    const x = r.left + r.width / 2, y = r.top + r.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const doApply = () => { applyTheme(t.id); setCurrent(t) }
    setOpen(false)
    if (!document.startViewTransition || reducedMotion()) { doApply(); return }
    const vt = document.startViewTransition(doApply)
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 900, easing: 'cubic-bezier(0.7, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
      )
    }).catch(() => {})
  }

  return (
    <div className="ts" ref={wrap}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="n" />
          <feGaussianBlur in="n" stdDeviation="2" result="nb" />
          <feDisplacementMap in="SourceGraphic" in2="nb" scale="38" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {open && (
        <div className="ts__panel glass" ref={panel} role="dialog" aria-label="Choose a color theme">
          <p className="ts__title">Pick your vibe</p>
          <ul>
            {THEMES.map((t) => (
              <li key={t.id}>
                <button className={`ts__opt ${t.id === current.id ? 'is-on' : ''}`} onClick={() => pick(t)} aria-pressed={t.id === current.id}>
                  <span className="ts__sw" aria-hidden="true">
                    {t.swatch.map((c, i) => <i key={i} style={{ background: c }} />)}
                  </span>
                  <span className="ts__txt">
                    <b>{t.name}</b>
                    <small>{t.mode === 'dark' ? 'Dark' : 'Bright'}, {t.note.toLowerCase()}</small>
                  </span>
                  {t.id === current.id && (
                    <svg className="ts__check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17 19 7" /></svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        ref={btn}
        className={`ts__btn ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Color theme: ${current.name}. Change theme`}
      >
        <span className="ts__refract" aria-hidden="true" />
        <span className="ts__blob" aria-hidden="true" style={{ '--c1': current.swatch[0], '--c2': current.swatch[2] }} />
        <span className="ts__shine" aria-hidden="true" />
        <svg className="ts__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-.9-.7-1.3-.7-2.2 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3Z" />
          <circle cx="7.5" cy="11" r="1.3" /><circle cx="10" cy="7.2" r="1.3" /><circle cx="14.6" cy="7.2" r="1.3" />
        </svg>
      </button>
    </div>
  )
}
