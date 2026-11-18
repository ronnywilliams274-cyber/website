import { useLayoutEffect, useRef, useState } from 'react'
import { Lightbox } from './Popups'
import { GALLERY, STORE, img } from '../data/catalog'
import { gsap } from '../lib/motion'

/** Four columns drifting at different speeds as you scroll. */
const FLAT = GALLERY.flat()

export default function Gallery() {
  const root = useRef(null)
  const [lb, setLb] = useState(null)
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    // Desktop: pin the screen and let the columns travel in opposite directions
    mm.add('(min-width: 900px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)', () => {
      const win = root.current.querySelector('.gal__window')
      const cols = gsap.utils.toArray('.gal__col', root.current)
      const travel = (c) => Math.max(0, c.offsetHeight - win.offsetHeight)
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=110%', pin: true, scrub: 0.6, invalidateOnRefresh: true },
      })
      cols.forEach((c, i) => {
        const down = i % 2 === 1
        tl.fromTo(c, { y: () => (down ? -travel(c) : 0) }, { y: () => (down ? 0 : -travel(c)) }, 0)
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="gal screen" id="gallery" ref={root}>
      <div className="gal__head">
        <h2>Fresh off the press</h2>
        <p>Real orders for real customers, straight from Ammie’s Facebook page.</p>
      </div>
      <div className="gal__window"><div className="gal__grid">
        {GALLERY.map((col, i) => (
          <div className="gal__col" key={i}>
            {col.map((im) => (
              <figure key={im} className="gal__item">
                <button onClick={() => setLb(FLAT.indexOf(im))} aria-label="Open photo">
                  <img src={img(im, true)} alt="" loading="lazy" />
                  <span className="gal__zoom glass" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5M11 8v6M8 11h6" /></svg></span>
                </button>
              </figure>
            ))}
          </div>
        ))}
      </div></div>
      <div className="gal__more">
        <a className="btn btn--accent" href={STORE.facebook} target="_blank" rel="noreferrer">See more on Facebook</a>
      </div>
      <Lightbox items={FLAT} index={lb} onIndex={setLb} onClose={() => setLb(null)} />
    </section>
  )
}
