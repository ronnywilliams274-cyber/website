import { useLayoutEffect, useRef, useState } from 'react'
import { OCCASIONS, img } from '../data/catalog'
import { gsap, reducedMotion, scrollToId } from '../lib/motion'

/** Big type rows. On desktop a fan of three photos follows the cursor over the hovered row. */
export default function Occasions() {
  const root = useRef(null)
  const follower = useRef(null)
  const [hover, setHover] = useState(-1)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!reducedMotion()) {
        gsap.from('.occ__row', {
          yPercent: 60, opacity: 0, duration: 1.1, stagger: 0.07, ease: 'expo.out',
          scrollTrigger: { trigger: '.occ__list', start: 'top 80%' },
        })
      }
      const xTo = gsap.quickTo(follower.current, 'x', { duration: 0.55, ease: 'power3.out' })
      const yTo = gsap.quickTo(follower.current, 'y', { duration: 0.55, ease: 'power3.out' })
      const move = (e) => { const r = root.current.getBoundingClientRect(); xTo(e.clientX - r.left); yTo(e.clientY - r.top) }
      root.current.addEventListener('pointermove', move)
      return () => root.current?.removeEventListener('pointermove', move)
    }, root)
    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    if (!follower.current) return
    const cards = follower.current.querySelectorAll('.occ__card')
    if (hover < 0) {
      gsap.to(cards, { scale: 0.4, opacity: 0, rotate: 0, duration: 0.35, ease: 'power3.in', stagger: 0.03 })
      return
    }
    gsap.fromTo(cards, { scale: 0.5, opacity: 0, rotate: 0 }, {
      scale: 1, opacity: 1, rotate: (i) => [-10, 2, 12][i], x: (i) => [-90, 0, 90][i], y: (i) => [10, -14, 8][i],
      duration: 0.6, ease: 'back.out(1.6)', stagger: 0.05,
    })
  }, [hover])

  return (
    <section className="occ screen" id="occasions" ref={root} onPointerLeave={() => setHover(-1)}>
      <div className="occ__head">
        <h2>Made for the moments that matter</h2>
        <p>Most orders start with a reason. Here’s what people bring to Ammie most.</p>
      </div>
      <ul className="occ__list">
        {OCCASIONS.map((o, i) => (
          <li key={o.title} className={`occ__row ${hover === i ? 'is-on' : ''}`} onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(i)}>
            <a href="#shop" onClick={(e) => { e.preventDefault(); scrollToId('shop') }}>
              <span className="occ__title">{o.title}</span>
              <span className="occ__note">{o.note}</span>
              <span className="occ__strip" aria-hidden="true">
                {o.images.map((im) => <img key={im} src={img(im, true)} alt="" loading="lazy" />)}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="occ__follow" ref={follower} aria-hidden="true">
        {[0, 1, 2].map((k) => (
          <div className="occ__card" key={k}>
            {hover >= 0 && <img src={img(OCCASIONS[hover].images[k], true)} alt="" />}
          </div>
        ))}
      </div>
    </section>
  )
}
