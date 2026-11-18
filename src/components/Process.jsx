import { useLayoutEffect, useRef } from 'react'
import { img } from '../data/catalog'
import { gsap } from '../lib/motion'

const STEPS = [
  { t: 'Choose a piece', d: 'Tumbler, jacket, jersey, photo shirt, or something new you’ve been picturing.', im: 'jacket-2' },
  { t: 'Tell me the details', d: 'Names, numbers, colors and the photos you love. Add them when you order, send photos after.', im: 'team-names' },
  { t: 'I design and press it', d: 'Every design is made for your order, then printed with DTF or sublimation and finished by hand.', im: 'dtf-transfers' },
  { t: 'Wear it, gift it, keep it', d: 'Your piece heads your way, ready for game day, senior night or the people you miss.', im: 'class-2026' },
]

/** Pinned horizontal sequence on wide screens; a plain vertical list on phones. */
export default function Process() {
  const root = useRef(null)
  const track = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const dist = () => track.current.scrollWidth - window.innerWidth
      const tween = gsap.to(track.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
      })
      gsap.utils.toArray('.step').forEach((s) => {
        gsap.fromTo(s.querySelector('.step__img'), { scale: 1.25, rotate: -4 }, {
          scale: 1, rotate: 0, ease: 'none',
          scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left right', end: 'center center', scrub: true },
        })
        gsap.from(s.querySelector('.step__n'), {
          scale: 0.4, rotate: -20, opacity: 0, transformOrigin: '0% 100%', ease: 'back.out(2)', duration: 0.9,
          scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left 70%' },
        })
      })
      gsap.to('.how__progress i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, scrub: true } })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="how screen" id="how" ref={root}>
      <div className="how__track" ref={track}>
        <div className="how__intro">
          <h2>How an order comes together</h2>
          <p>Four steps from your idea to something you can hold.</p>
          <div className="how__progress" aria-hidden="true"><i /></div>
        </div>
        {STEPS.map((s, i) => (
          <article className="step" key={s.t}>
            <div className="step__media"><img className="step__img" src={img(s.im)} alt="" loading="lazy" /></div>
            <div className="step__text glass">
              <span className="step__n" aria-hidden="true">{i + 1}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
