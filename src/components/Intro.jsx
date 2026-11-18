import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, reducedMotion, lockScroll } from '../lib/motion'
import { img } from '../data/catalog'

const WORD = "Ammie's"

/**
 * The one orchestrated load moment: a heat press plate comes down on the wordmark,
 * the letters squash like vinyl under heat, glitter pops, then the sheet peels away.
 */
export default function Intro({ onDone }) {
  const root = useRef(null)
  const [gone, setGone] = useState(false)

  useLayoutEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('ammies-intro') === '1' } catch { /* ignore */ }
    if (seen || reducedMotion()) {
      setGone(true); onDone?.(); return
    }
    lockScroll(true)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          try { sessionStorage.setItem('ammies-intro', '1') } catch { /* ignore */ }
          lockScroll(false); setGone(true)
        },
      })
      tl.from('.intro__logo', { scale: 0.4, rotate: -12, opacity: 0, duration: 0.8, ease: 'back.out(1.9)' })
        .from('.intro__char', { yPercent: 120, rotate: () => gsap.utils.random(-14, 14), stagger: 0.05, duration: 0.7, ease: 'back.out(1.8)' }, '-=0.45')
        .from('.intro__plate', { yPercent: -160, duration: 0.55, ease: 'power4.in' }, '+=0.1')
        .to('.intro__char, .intro__logo', { scaleY: 0.62, scaleX: 1.16, transformOrigin: '50% 100%', duration: 0.12, ease: 'power2.in' }, '<+0.43')
        .to('.intro__plate', { yPercent: -160, duration: 0.6, ease: 'power3.inOut' }, '+=0.18')
        .to('.intro__char, .intro__logo', { scaleY: 1, scaleX: 1, duration: 0.9, ease: 'elastic.out(1.1, 0.35)', stagger: 0.025 }, '<')
        .fromTo('.intro__spark', { scale: 0, opacity: 1 }, {
          scale: () => gsap.utils.random(0.6, 1.4), opacity: 0,
          x: () => gsap.utils.random(-260, 260), y: () => gsap.utils.random(-180, 160),
          rotate: () => gsap.utils.random(-180, 180), duration: 1.1, ease: 'expo.out', stagger: 0.008,
        }, '<')
        .to('.intro__tag', { opacity: 1, y: 0, duration: 0.5 }, '<+0.2')
        .add(() => onDone?.(), '+=0.15')
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '<')
      // wait until the 3D scene has initialised (it blocks the main thread briefly) before playing
      const go = () => requestAnimationFrame(() => requestAnimationFrame(() => tl.play()))
      if (window.__ammiesSceneReady) go()
      else window.addEventListener('ammies:scene-ready', go, { once: true })
      setTimeout(() => tl.paused() && tl.play(), 2500)
    }, root)
    return () => { ctx.revert(); lockScroll(false) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null
  return (
    <div className="intro" ref={root} aria-hidden="true">
      <div className="intro__stage">
        <div className="intro__plate" />
        <img className="intro__logo" src={img('brand-ammie')} alt="" />
        <div className="intro__word">
          {WORD.split('').map((c, i) => <span className="intro__char" key={i}>{c}</span>)}
        </div>
        {Array.from({ length: 28 }).map((_, i) => (
          <svg className="intro__spark" key={i} viewBox="0 0 20 20"><path d="M10 0C11 7 13 9 20 10 13 11 11 13 10 20 9 13 7 11 0 10 7 9 9 7 10 0Z" /></svg>
        ))}
        <p className="intro__tag">Creations, pressed fresh</p>
      </div>
    </div>
  )
}
