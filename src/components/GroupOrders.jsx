import { useLayoutEffect, useRef } from 'react'
import { STORE, img } from '../data/catalog'
import { gsap, reducedMotion } from '../lib/motion'

export default function GroupOrders({ onQuote }) {
  const root = useRef(null)
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.grp__shirt', {
        y: 200, rotate: (i) => [-18, 0, 16][i], opacity: 0, stagger: 0.12, duration: 1.3, ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="grp screen" id="groups" ref={root}>
      <div className="blobs blobs--on-accent" aria-hidden="true"><i /><i /><i /></div>
      <div className="grp__text">
        <h2>Outfitting a whole team, class or family?</h2>
        <p>Send the roster, colors and logo. Ammie will quote the full order and match every piece, from the coach’s shirt to grandma’s tumbler.</p>
        <ul className="grp__list">
          <li>Team jerseys and name-down-the-back tees</li>
          <li>Matching memorial shirts for the whole family</li>
          <li>Senior night sets for parents and siblings</li>
          <li>Bridal party and birthday crew jackets</li>
        </ul>
        <div className="grp__ctas">
          <a className="btn btn--ink" href={STORE.messenger} target="_blank" rel="noreferrer">Message Ammie on Facebook</a>
          <button className="btn btn--glass" onClick={() => onQuote('Team name shirts')}>Request a team quote</button>
        </div>
      </div>
      <div className="grp__stack" aria-hidden="true">
        {['team-names', 'dance-shirt', 'memorial-purple-2'].map((im) => (
          <img key={im} className="grp__shirt" src={img(im, true)} alt="" loading="lazy" />
        ))}
      </div>
    </section>
  )
}
