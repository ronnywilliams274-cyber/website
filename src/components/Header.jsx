import { useEffect, useRef, useState } from 'react'
import { useCart, money } from '../lib/cart'
import { gsap, scrollToId, reducedMotion } from '../lib/motion'
import { PRODUCTS, OCCASIONS, img } from '../data/catalog'

const HIDE_AFTER = 2600

function useAutoHide(holdOpen) {
  const [hidden, setHidden] = useState(false)
  const timer = useRef(0)
  const hold = useRef(holdOpen)
  hold.current = holdOpen

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const arm = () => {
      clearTimeout(timer.current)
      if (!fine) return // touch screens: scroll direction decides instead of a timer
      timer.current = setTimeout(() => { if (!hold.current) setHidden(true) }, HIDE_AFTER)
    }
    const show = () => { setHidden(false); arm() }
    let lastY = null, upTravel = 0, lastScroll = window.scrollY
    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      if (e.clientY < 110) { show(); return }
      if (lastY !== null) {
        const dy = e.clientY - lastY
        upTravel = dy < 0 ? upTravel - dy : Math.max(0, upTravel - dy * 2)
        if (upTravel > 70) { upTravel = 0; show() }
      }
      lastY = e.clientY
    }
    const onScroll = () => {
      const y = window.scrollY
      if (y < lastScroll - 6 || (!fine && y < 80)) show()
      else if (!fine && y > lastScroll + 8 && !hold.current) setHidden(true)
      lastScroll = y
    }
    const onFocus = (e) => { if (e.target.closest?.('.hdr')) show() }
    arm()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('focusin', onFocus)
    return () => {
      clearTimeout(timer.current)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('focusin', onFocus)
    }
  }, [])

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (holdOpen) { clearTimeout(timer.current); setHidden(false) }
    else if (fine) timer.current = setTimeout(() => setHidden(true), HIDE_AFTER)
    return () => clearTimeout(timer.current)
  }, [holdOpen])

  return hidden
}

function Dropdown({ id, label, open, setOpen, children }) {
  const panel = useRef(null)
  useEffect(() => {
    if (!open || !panel.current) return
    const rm = reducedMotion()
    gsap.fromTo(panel.current, { opacity: 0, y: -12, scale: 0.97, clipPath: 'inset(0 0 100% 0 round 26px)' },
      { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0 0 0% 0 round 26px)', duration: rm ? 0 : 0.55, ease: 'expo.out' })
    if (!rm) gsap.from(panel.current.querySelectorAll('.dd__item'), { y: 14, opacity: 0, stagger: 0.035, duration: 0.5, ease: 'expo.out', delay: 0.05 })
  }, [open])
  return (
    <div className={`dd ${open ? 'is-open' : ''}`} onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(id)} onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(null)}>
      <button className="dd__btn" aria-expanded={open} aria-controls={`dd-${id}`} onClick={() => setOpen(open ? null : id)}>
        {label}
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" /></svg>
      </button>
      {open && <div className="dd__panel glass" id={`dd-${id}`} ref={panel}>{children}</div>}
    </div>
  )
}

export default function Header({ ready = true, onOpenProduct, onOpenQuote }) {
  const { items, count, subtotal, setOpen: setBagOpen, pulse } = useCart()
  const [menu, setMenu] = useState(false)
  const [dd, setDd] = useState(null)
  const [hover, setHover] = useState(false)
  const [mini, setMini] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const bag = useRef(null)
  const miniRef = useRef(null)
  const hidden = useAutoHide(!ready || menu || !!dd || hover || mini)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // mini bag pop-up after something is added
  useEffect(() => {
    if (!pulse) return
    setMini(true)
    if (bag.current) gsap.fromTo(bag.current, { scale: 1 }, { scale: 1.16, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' })
    const t = setTimeout(() => setMini(false), 4200)
    return () => clearTimeout(t)
  }, [pulse])

  useEffect(() => {
    if (!mini || !miniRef.current) return
    gsap.fromTo(miniRef.current, { opacity: 0, y: -10, scale: 0.9, transformOrigin: '90% 0%' }, { opacity: 1, y: 0, scale: 1, duration: reducedMotion() ? 0 : 0.6, ease: 'back.out(1.7)' })
  }, [mini])

  useEffect(() => {
    if (!dd) return
    const onKey = (e) => e.key === 'Escape' && setDd(null)
    const onDoc = (e) => { if (!e.target.closest('.dd')) setDd(null) }
    window.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onDoc)
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDoc) }
  }, [dd])

  const go = (id) => { setMenu(false); setDd(null); scrollToId(id) }
  const last = items[items.length - 1]

  return (
    <header
      className={`hdr glass ${scrolled ? 'is-scrolled' : ''} ${menu ? 'is-menu' : ''} ${hidden ? 'is-hidden' : ''}`}
      onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}
    >
      <a className="hdr__logo" href="#top" onClick={(e) => { e.preventDefault(); go('top') }} aria-label="Ammie's Creations, back to top">
        <img src={img('brand-ammie', true)} alt="" width="74" height="57" />
        <span className="hdr__word"><b>Ammie’s</b><small>Creations</small></span>
      </a>

      <nav className="hdr__nav" aria-label="Main">
        <Dropdown id="shop" label="Shop" open={dd === 'shop'} setOpen={setDd}>
          <div className="dd__grid">
            {PRODUCTS.map((p) => (
              <button key={p.id} className="dd__item dd__prod" onClick={() => { setDd(null); setMenu(false); onOpenProduct(p.id) }}>
                <img src={img(p.images[0], true)} alt="" />
                <span><b>{p.name}</b><small>{money(p.price)}</small></span>
              </button>
            ))}
          </div>
          <div className="dd__foot">
            <button className="dd__item dd__link" onClick={() => go('quotes')}>Made to order on request</button>
            <button className="dd__item dd__link" onClick={() => { setDd(null); onOpenQuote() }}>Request a custom quote</button>
            <button className="dd__item dd__link" onClick={() => go('shop')}>See all pieces</button>
          </div>
        </Dropdown>
        <a href="#how" onClick={(e) => { e.preventDefault(); go('how') }}>How it works</a>
        <Dropdown id="occ" label="Occasions" open={dd === 'occ'} setOpen={setDd}>
          <ul className="dd__list">
            {OCCASIONS.map((o) => (
              <li key={o.title}>
                <button className="dd__item dd__occ" onClick={() => go('occasions')}>
                  <img src={img(o.images[0], true)} alt="" />
                  <span><b>{o.title}</b><small>{o.note}</small></span>
                </button>
              </li>
            ))}
          </ul>
        </Dropdown>
        <a href="#gallery" onClick={(e) => { e.preventDefault(); go('gallery') }}>Gallery</a>
        <a href="#groups" onClick={(e) => { e.preventDefault(); go('groups') }}>Group orders</a>
      </nav>

      <div className="hdr__right">
        <button className="hdr__bag" id="bag-button" ref={bag} onClick={() => { setMini(false); setBagOpen(true) }} aria-label={`Open bag, ${count} items`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
          <span>Bag</span>
          <b className={count ? 'has' : ''}>{count}</b>
        </button>
        <button className="hdr__burger" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="Menu"><i /><i /></button>

        {mini && last && (
          <div className="mini glass" ref={miniRef} role="status">
            <p className="mini__title">Added to your bag</p>
            <div className="mini__row">
              <img src={img(last.product.images[0], true)} alt="" />
              <div><b>{last.product.name}</b><small>{Object.values(last.options).filter(Boolean).slice(0, 2).join(', ')}</small></div>
            </div>
            <div className="mini__sub"><span>{count} {count === 1 ? 'item' : 'items'}</span><b>{money(subtotal)}</b></div>
            <button className="btn btn--accent btn--wide btn--sm" onClick={() => { setMini(false); setBagOpen(true) }}>View bag and check out</button>
          </div>
        )}
      </div>
    </header>
  )
}
