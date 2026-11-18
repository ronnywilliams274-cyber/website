import { useLayoutEffect, useRef } from 'react'
import { PRODUCTS, QUOTES, img } from '../data/catalog'
import { money } from '../lib/cart'
import { gsap, reducedMotion } from '../lib/motion'

function ProductCard({ p, onOpen, index }) {
  const card = useRef(null)
  const onMove = (e) => {
    if (reducedMotion() || e.pointerType !== 'mouse') return
    const r = card.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(card.current.querySelector('.pc__media'), { rotateY: x * 8, rotateX: -y * 8, duration: 0.6, ease: 'power3.out' })
    card.current.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    card.current.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const onLeave = () => gsap.to(card.current.querySelector('.pc__media'), { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1,0.5)' })

  return (
    <article className={`pc pc--${index % 2 ? 'low' : 'high'}`} ref={card} onPointerMove={onMove} onPointerLeave={onLeave} style={{ '--tint': p.tint }}>
      <button className="pc__hit" onClick={() => onOpen(p.id)} aria-label={`Personalize ${p.name}, ${money(p.price)}`}>
        <div className="pc__media">
          <img className="pc__img pc__img--a" src={img(p.images[0], true)} alt="" loading="lazy" />
          <img className="pc__img pc__img--b" src={img(p.images[1] || p.images[0], true)} alt="" loading="lazy" />
          <span className="pc__shine" />
        </div>
        <div className="pc__info">
          <h3>{p.name}</h3>
          <p>{p.short}</p>
          <div className="pc__row">
            <span className="pc__price">{money(p.price)}</span>
            <span className="pc__cta">Personalize</span>
          </div>
        </div>
      </button>
    </article>
  )
}

export default function Shop({ onOpen }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.shop__title .w', {
        yPercent: 120, rotate: 6, stagger: 0.06, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: '.shop__title', start: 'top 85%' },
      })
      gsap.utils.toArray('.pc').forEach((c, i) => {
        gsap.from(c, {
          y: 120, rotate: i % 2 ? 3 : -3, opacity: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: c, start: 'top 92%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="shop screen" id="shop" ref={root}>
      <div className="blobs blobs--soft" aria-hidden="true"><i /><i /></div>
      <div className="shop__head">
        <h2 className="shop__title">
          {'Pick a piece, make it yours'.split(' ').map((w, i) => <span className="wm" key={i}><span className="w">{w}</span></span>)}
        </h2>
        <p>Choose a piece, add the names and colors, and pay through Ammie’s secure Shopify checkout. She’ll reach out for photos once your order is in.</p>
      </div>

      <div className="shop__grid">
        {PRODUCTS.map((p, i) => <ProductCard key={p.id} p={p} index={i} onOpen={onOpen} />)}
      </div>

    </section>
  )
}

export function Quotes({ onQuote }) {
  const root = useRef(null)
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.qc', {
        y: 80, opacity: 0, rotate: (i) => (i % 2 ? 4 : -4), stagger: 0.07, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="quotes screen" id="quotes" ref={root}>
      <div className="blobs" aria-hidden="true"><i /><i /><i /></div>
      <div className="quotes__head">
        <h2>Made to order on request</h2>
        <p>Ammie makes all of these too. Tell her what you need and she’ll quote it for you.</p>
      </div>
      <ul className="quotes__list">
        {QUOTES.map((q) => (
          <li key={q.id} className="qc glass">
            <button onClick={() => onQuote(q.name)}>
              <span className="qc__media">
                {q.image
                  ? <img src={img(q.image, true)} alt="" loading="lazy" />
                  : <span className="qc__decal" aria-hidden="true">Your name here</span>}
              </span>
              <span className="qc__name">{q.name}</span>
              <span className="qc__from">{q.from}</span>
              <span className="qc__ask">Request a quote</span>
            </button>
          </li>
        ))}
      </ul>
      <button className="btn btn--accent quotes__cta" onClick={() => onQuote('Something else')}>I have a different idea</button>
    </section>
  )
}
