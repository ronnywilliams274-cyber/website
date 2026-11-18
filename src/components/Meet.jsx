import { useLayoutEffect, useRef } from 'react'
import { img, STORE } from '../data/catalog'
import { gsap, reducedMotion } from '../lib/motion'

export default function Meet() {
  const root = useRef(null)
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.meet__art', { clipPath: 'circle(0% at 50% 50%)' }, {
        clipPath: 'circle(75% at 50% 50%)', ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'center 55%', scrub: true },
      })
      gsap.to('.meet__sticker', { rotate: 360, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="meet screen" ref={root} aria-labelledby="meet-h">
      <div className="blobs blobs--soft" aria-hidden="true"><i /><i /></div>
      <div className="meet__artwrap">
        <img className="meet__art" src={img('brand-ammie')} alt="Illustration of Ammie holding a pink tumbler, surrounded by her custom shirts, mugs, totes and keychains" />
        <svg className="meet__sticker" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 4 58 30 86 22 68 44 92 60 63 62 66 92 50 70 34 92 37 62 8 60 32 44 14 22 42 30Z" />
        </svg>
      </div>
      <div className="meet__text">
        <h2 id="meet-h">Hi, I’m Ammie.</h2>
        <p>Every piece here starts as somebody’s idea: a kid’s jersey number, a grandma’s photo, a class year, a little extra sparkle for a night out.</p>
        <p>I design each one for your order, press it with DTF or sublimation, and add the bling by hand. Tell me what you’re picturing and I’ll bring it to life.</p>
        <a className="btn btn--line" href={STORE.facebook} target="_blank" rel="noreferrer">Follow along on Facebook</a>
      </div>
    </section>
  )
}
