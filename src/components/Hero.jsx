import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createTumblerScene } from './tumblerScene'
import { gsap, ScrollTrigger, reducedMotion, scrollToId } from '../lib/motion'
import { img } from '../data/catalog'
import { getTheme, savedThemeId } from '../data/themes'

const LINES = ['If you can', 'imagine it,', 'I’ll make it.']

export default function Hero({ ready, onPersonalize }) {
  const root = useRef(null)
  const canvas = useRef(null)
  const scene = useRef(null)
  const [name, setName] = useState('Ammie')
  const [webgl, setWebgl] = useState(true)

  useEffect(() => {
    try {
      const th = getTheme(savedThemeId())
      scene.current = createTumblerScene(canvas.current, { name: 'Ammie', reduced: reducedMotion(), wrap: th.wrap, gemColors: th.gems })
    } catch {
      setWebgl(false)
    }
    window.__ammiesSceneReady = true
    window.dispatchEvent(new Event('ammies:scene-ready'))
    const onTheme = (e) => scene.current?.setPalette(e.detail.wrap, e.detail.gems)
    window.addEventListener('ammies:theme', onTheme)
    return () => { window.removeEventListener('ammies:theme', onTheme); scene.current?.dispose() }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => scene.current?.setName(name.trim() || 'Your name'), 90)
    return () => clearTimeout(t)
  }, [name])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: 'bottom top', scrub: true,
        onUpdate: (s) => scene.current?.setProgress(s.progress),
      })
      if (!reducedMotion()) {
        gsap.to('.hero__copy', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      }
    }, root)
    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      if (reducedMotion()) return
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero__line > span', { yPercent: 110, duration: 1.2, stagger: 0.09 })
        .from('.hero__sub, .hero__try, .hero__links', { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, '-=0.8')
        .from('.hero__stage', { scale: 0.85, opacity: 0, duration: 1.4 }, 0)
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section className="hero screen" id="top" ref={root}>
      <div className="blobs" aria-hidden="true"><i /><i /><i /></div>
      <div className="hero__copy">
        <h1 className="hero__title" aria-label="If you can imagine it, I’ll make it.">
          {LINES.map((l) => <span className="hero__line" key={l} aria-hidden="true"><span>{l}</span></span>)}
        </h1>
        <p className="hero__sub">
          Custom tumblers, DTF apparel and blinged-out jackets, designed and pressed by Ammie for customers across the USA.
        </p>
        <form
          className="hero__try"
          onSubmit={(e) => { e.preventDefault(); scene.current?.spin(); onPersonalize(name.trim()) }}
        >
          <label htmlFor="try-name">Type a name and watch it print</label>
          <div className="hero__try-row glass">
            <input
              id="try-name" value={name} maxLength={18} autoComplete="off" spellCheck="false"
              onChange={(e) => setName(e.target.value)} placeholder="Your name"
            />
            <button className="btn btn--accent" type="submit">Put it on a tumbler</button>
          </div>
        </form>
        <div className="hero__links">
          <a href="#shop" onClick={(e) => { e.preventDefault(); scrollToId('shop') }}>Shop every piece</a>
          <span aria-hidden="true">or</span>
          <a href="#groups" onClick={(e) => { e.preventDefault(); scrollToId('groups') }}>plan a team order</a>
        </div>
      </div>
      <div className="hero__stage" aria-hidden={webgl}>
        {webgl
          ? <canvas ref={canvas} className="hero__canvas" />
          : <img src={img('tumbler-2')} alt="A custom sublimated name tumbler by Ammie's Creations" />}
        <div className="hero__badge glass" aria-hidden="true">
          <svg viewBox="0 0 120 120"><defs><path id="circ" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
            <text><textPath href="#circ">sublimated by hand ✦ never peels ✦ made to order ✦ </textPath></text></svg>
          <b>$30</b>
        </div>
      </div>
    </section>
  )
}
