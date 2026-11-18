import { useRef, useState } from 'react'
import { gsap, reducedMotion } from '../lib/motion'
import { STORE } from '../data/catalog'

const QA = [
  {
    q: 'How do I send my photos?',
    a: 'Place your order first, then reply to your order confirmation email or message Ammie on Facebook with the photos. Your order number links everything together.',
  },
  {
    q: 'How long does a custom order take?',
    a: 'Every piece is made to order, so timing depends on the design and how busy the season is. If you need it by a date, put it in the notes and Ammie will confirm before she starts.',
  },
  {
    q: 'What’s the difference between DTF and sublimation?',
    a: 'DTF (direct to film) prints your design onto a film that’s heat pressed onto fabric, so it works on cotton, denim and dark colors. Sublimation turns ink into gas that bonds into coated surfaces like tumblers and coasters, so the design becomes part of the finish and won’t peel.',
  },
  {
    q: 'Where do you ship, and what does it cost?',
    a: 'Orders ship within the USA. Shipping and any tax are calculated at Shopify checkout before you pay.',
  },
]

function Item({ q, a }) {
  const [open, setOpen] = useState(false)
  const body = useRef(null)
  const toggle = () => {
    const next = !open
    setOpen(next)
    const rm = reducedMotion()
    gsap.to(body.current, { height: next ? 'auto' : 0, duration: rm ? 0 : 0.6, ease: 'expo.out' })
  }
  return (
    <li className={`faq__item ${open ? 'is-open' : ''}`}>
      <button className="faq__q" onClick={toggle} aria-expanded={open}>
        <span>{q}</span>
        <i aria-hidden="true" />
      </button>
      <div className="faq__a" ref={body} style={{ height: 0 }}><p>{a}</p></div>
    </li>
  )
}

export default function Faq() {
  return (
    <section className="faq screen" aria-labelledby="faq-h">
      <div className="blobs blobs--soft" aria-hidden="true"><i /><i /></div>
      <h2 id="faq-h">Good to know</h2>
      <ul className="faq__list glass">{QA.map((x) => <Item key={x.q} {...x} />)}</ul>
      <p className="faq__more">Something else? <a href={STORE.messenger} target="_blank" rel="noreferrer">Ask Ammie directly</a>.</p>
    </section>
  )
}
