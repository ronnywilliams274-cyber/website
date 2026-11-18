import { useLayoutEffect, useRef } from 'react'
import { STORE, img } from '../data/catalog'
import { gsap, reducedMotion, scrollToId } from '../lib/motion'

export default function Footer() {
  const root = useRef(null)
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.ftr__fill', { clipPath: 'inset(100% 0 0 0)' }, {
        clipPath: 'inset(0% 0 0 0)', ease: 'none',
        scrollTrigger: { trigger: '.ftr__word', start: 'top bottom', end: 'bottom bottom', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <footer className="ftr screen" ref={root}>
      <div className="ftr__cols">
        <div>
          <img className="ftr__logo" src={img('brand-ammie', true)} alt="Ammie's Creations" />
          <h2 className="ftr__h">Tell me your idea and I’ll bring it to life.</h2>
          <a className="btn btn--accent" href={STORE.messenger} target="_blank" rel="noreferrer">Start a custom order</a>
        </div>
        <nav aria-label="Footer">
          <a href="#shop" onClick={(e) => { e.preventDefault(); scrollToId('shop') }}>Shop</a>
          <a href="#groups" onClick={(e) => { e.preventDefault(); scrollToId('groups') }}>Group orders</a>
          <a href={STORE.facebook} target="_blank" rel="noreferrer">Facebook</a>
          <a href={STORE.contact} target="_blank" rel="noreferrer">Contact</a>
          <a href={STORE.account} target="_blank" rel="noreferrer">My orders</a>
          <a href={STORE.privacy} target="_blank" rel="noreferrer">Privacy policy</a>
        </nav>
      </div>
      <div className="ftr__word" aria-hidden="true">
        <span className="ftr__outline">Ammie’s</span>
        <span className="ftr__fill">Ammie’s</span>
      </div>
      <p className="ftr__legal">© {new Date().getFullYear()} Ammie’s Creations. Secure checkout by Shopify.</p>
    </footer>
  )
}
