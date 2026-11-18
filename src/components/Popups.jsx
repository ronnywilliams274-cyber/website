import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap, lockScroll, reducedMotion } from '../lib/motion'
import { QUOTES, STORE, img } from '../data/catalog'
import { toast } from './Toast'

/** Shared glass pop-up shell: blur-in scrim, springy card, Escape and outside click close it. */
export function Popup({ open, onClose, label, className = '', children }) {
  const root = useRef(null)
  const [shown, setShown] = useState(open)

  useEffect(() => { if (open) setShown(true) }, [open])

  useLayoutEffect(() => {
    if (!shown || !root.current) return
    lockScroll(true)
    const rm = reducedMotion()
    const ctx = gsap.context(() => {
      if (open) {
        gsap.fromTo('.pop__scrim', { opacity: 0, backdropFilter: 'blur(0px)' }, { opacity: 1, backdropFilter: 'blur(10px)', duration: rm ? 0 : 0.5 })
        gsap.fromTo('.pop__card', { opacity: 0, y: 60, scale: 0.9, rotate: -2 }, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: rm ? 0 : 0.8, ease: 'back.out(1.5)' })
      } else {
        gsap.to('.pop__card', { opacity: 0, y: 40, scale: 0.94, duration: rm ? 0 : 0.35, ease: 'power3.in' })
        gsap.to('.pop__scrim', { opacity: 0, duration: rm ? 0 : 0.4, onComplete: () => { setShown(false); lockScroll(false) } })
      }
    }, root)
    if (open) root.current.querySelector('.pop__card input, .pop__card button')?.focus({ preventScroll: true })
    return () => ctx.kill()
  }, [open, shown])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!shown) return null
  return createPortal(
    <div className={`pop ${className}`} ref={root} role="dialog" aria-modal="true" aria-label={label}>
      <div className="pop__scrim" onClick={onClose} />
      <div className="pop__card glass" data-lenis-prevent>
        <button className="pop__close" onClick={onClose} aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
        {children}
      </div>
    </div>,
    document.body
  )
}

/** "Join the glitter list" — posts to Ammie's existing Shopify newsletter list. */
export function NewsletterPopup({ ready }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!ready) return
    let seen = false
    try { seen = localStorage.getItem('ammies-news') === '1' } catch { /* ignore */ }
    if (seen) return
    const t = setTimeout(() => setOpen(true), 14000)
    return () => clearTimeout(t)
  }, [ready])
  const close = () => { setOpen(false); try { localStorage.setItem('ammies-news', '1') } catch { /* ignore */ } }

  return (
    <Popup open={open} onClose={close} label="Join the glitter list" className="pop--news">
      <div className="news">
        <div className="news__art">
          <img src={img('brand-ammie')} alt="" />
        </div>
        <div className="news__body">
          <h2>Join the glitter list</h2>
          <p>New designs, seasonal drops and the occasional deal, straight from Ammie. No spam, just sparkle.</p>
          <form
            className="news__form"
            action={`${STORE.shopifyDomain}/contact#contact_form`}
            method="post" target="_blank" acceptCharset="UTF-8"
            onSubmit={() => { toast('Thanks! Check the new tab to finish signing up'); close() }}
          >
            <input type="hidden" name="form_type" value="customer" />
            <input type="hidden" name="utf8" value="✓" />
            <input type="hidden" name="contact[tags]" value="newsletter,website-popup" />
            <label className="sr" htmlFor="news-email">Email</label>
            <input id="news-email" type="email" name="contact[email]" required placeholder="you@email.com" autoComplete="email" />
            <button className="btn btn--accent" type="submit">Sign me up</button>
          </form>
          <button className="news__no" onClick={close}>Maybe later</button>
        </div>
      </div>
    </Popup>
  )
}

/** Quote request for made-to-order items. Builds a message, copies it, opens Messenger. */
export function QuotePopup({ open, preset, onClose }) {
  const [v, setV] = useState({ item: '', qty: '1', date: '', details: '' })
  const [copied, setCopied] = useState(false)
  useEffect(() => { if (open) { setV((s) => ({ ...s, item: preset || s.item || QUOTES[0].name })); setCopied(false) } }, [open, preset])
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }))

  const message = `Hi Ammie! I'd like a quote.\nItem: ${v.item}\nQuantity: ${v.qty}${v.date ? `\nNeeded by: ${v.date}` : ''}${v.details ? `\nDetails: ${v.details}` : ''}`

  const send = async (e) => {
    e.preventDefault()
    try { await navigator.clipboard.writeText(message); setCopied(true) } catch { setCopied(false) }
    window.open(STORE.messenger, '_blank', 'noopener')
  }

  return (
    <Popup open={open} onClose={onClose} label="Request a quote" className="pop--quote">
      <form className="qform" onSubmit={send}>
        <h2>Request a quote</h2>
        <p className="qform__lead">Tell Ammie what you need. We’ll copy your request so you can paste it straight into Messenger.</p>
        <div className="qform__grid">
          <label>What would you like?
            <select value={v.item} onChange={set('item')}>
              {QUOTES.map((q) => <option key={q.id}>{q.name}</option>)}
              <option>Something else</option>
            </select>
          </label>
          <label>How many?
            <input type="number" min="1" max="500" value={v.qty} onChange={set('qty')} />
          </label>
          <label>Needed by (optional)
            <input type="date" value={v.date} onChange={set('date')} />
          </label>
          <label className="qform__full">Names, colors, photos you have, wording
            <textarea rows={4} value={v.details} onChange={set('details')} placeholder="e.g. 12 shirts for the Bees softball team, green and gold, names on the back" />
          </label>
        </div>
        <button className="btn btn--accent btn--wide" type="submit">Copy request and open Messenger</button>
        <p className="qform__note" aria-live="polite">
          {copied ? 'Copied. Paste it into the Messenger chat that just opened.' : 'Messenger opens in a new tab.'}
        </p>
      </form>
    </Popup>
  )
}

/** Gallery lightbox with arrow-key navigation. */
export function Lightbox({ items, index, onClose, onIndex }) {
  const open = index !== null && index !== undefined
  const im = open ? items[index] : null
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, index, items.length, onIndex])

  return (
    <Popup open={open} onClose={onClose} label="Photo viewer" className="pop--lb">
      {im && (
        <figure className="lb">
          <img key={im} src={img(im)} alt="A custom piece made by Ammie" />
          <figcaption>
            <button onClick={() => onIndex((index - 1 + items.length) % items.length)} aria-label="Previous photo">
              <svg viewBox="0 0 24 24"><path d="M15 5 8 12l7 7" /></svg>
            </button>
            <span>{index + 1} of {items.length}</span>
            <button onClick={() => onIndex((index + 1) % items.length)} aria-label="Next photo">
              <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </figcaption>
        </figure>
      )}
    </Popup>
  )
}
