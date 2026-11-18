import { useCallback, useEffect, useState } from 'react'
import { startSmoothScroll, ScrollTrigger } from './lib/motion'
import Intro from './components/Intro'
import Header from './components/Header'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Shop, { Quotes } from './components/Shop'
import Process from './components/Process'
import Occasions from './components/Occasions'
import Meet from './components/Meet'
import Gallery from './components/Gallery'
import GroupOrders from './components/GroupOrders'
import Faq from './components/Faq'
import Footer from './components/Footer'
import ProductSheet from './components/ProductSheet'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'
import ThemeSwitch from './components/ThemeSwitch'
import { NewsletterPopup, QuotePopup } from './components/Popups'

export default function App() {
  const [ready, setReady] = useState(false)
  const [sheet, setSheet] = useState(null) // { id, preset }
  const [quote, setQuote] = useState(null) // preset item name, or '' for none

  useEffect(() => {
    startSmoothScroll()
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  const openProduct = useCallback((id, preset = {}) => setSheet({ id, preset }), [])
  const openQuote = useCallback((item = '') => setQuote(item), [])

  return (
    <>
      <a className="skip" href="#shop">Skip to the shop</a>
      <Intro onDone={() => setReady(true)} />
      <Header ready={ready} onOpenProduct={openProduct} onOpenQuote={() => openQuote('')} />
      <main>
        <Hero ready={ready} onPersonalize={(name) => openProduct('name-tumbler', { 'Name on tumbler': name })} />
        <Marquee />
        <Shop onOpen={openProduct} />
        <Quotes onQuote={openQuote} />
        <Process />
        <Occasions />
        <Meet />
        <Gallery />
        <GroupOrders onQuote={openQuote} />
        <Faq />
      </main>
      <Footer />
      <ProductSheet sheet={sheet} onClose={() => setSheet(null)} />
      <CartDrawer />
      <QuotePopup open={quote !== null} preset={quote} onClose={() => setQuote(null)} />
      <NewsletterPopup ready={ready} />
      <ThemeSwitch />
      <Toast />
    </>
  )
}
