import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/motion'

const ROW_A = ['Name tumblers', 'Bling jean jackets', 'Team jerseys', 'Senior mom shirts', 'Memorial keepsakes']
const ROW_B = ['Car window decals', 'Photo pendants', 'Money leis', 'Coasters and ornaments', 'Moms club tees']

const Gem = () => (
  <svg className="mq__gem" viewBox="0 0 40 40" aria-hidden="true">
    <path d="M20 2 34 14 20 38 6 14Z" /><path d="M6 14h28M14 14l6-12 6 12-6 24Z" />
  </svg>
)

function Row({ words, dir, outline }) {
  const items = [...words, ...words, ...words]
  return (
    <div className={`mq__row ${outline ? 'mq__row--outline' : ''}`} data-dir={dir}>
      <div className="mq__track">
        {items.map((w, i) => <span className="mq__item" key={i}>{w}<Gem /></span>)}
      </div>
    </div>
  )
}

/** Two counter-running rows. Scroll velocity speeds them up and flips direction. */
export default function Marquee() {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reducedMotion()) return
    const rows = [...root.current.querySelectorAll('.mq__row')].map((row) => ({
      track: row.querySelector('.mq__track'), dir: Number(row.dataset.dir), x: 0,
    }))
    let boost = 0, scrollDir = 1, skew = 0
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top bottom', end: 'bottom top',
      onUpdate: (s) => {
        const v = s.getVelocity()
        scrollDir = s.direction
        boost = Math.max(boost, Math.min(Math.abs(v) / 250, 7))
        skew = gsap.utils.clamp(-7, 7, v / -260)
      },
    })
    const tick = (_, dt) => {
      boost += (0 - boost) * 0.05
      skew += (0 - skew) * 0.08
      rows.forEach((r) => {
        const w = r.track.scrollWidth / 3
        r.x += r.dir * scrollDir * (0.045 * (1 + boost)) * dt
        r.x = ((r.x % w) + w) % w
        r.track.style.transform = `translate3d(${-r.x}px,0,0) skewX(${skew}deg)`
      })
    }
    gsap.ticker.add(tick)
    return () => { gsap.ticker.remove(tick); st.kill() }
  }, [])

  return (
    <section className="mq" ref={root} aria-label="What Ammie makes">
      <Row words={ROW_A} dir={-1} />
      <Row words={ROW_B} dir={1} outline />
    </section>
  )
}
