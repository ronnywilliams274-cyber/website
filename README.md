# Ammie's Creations: website

A React + three.js + GSAP + Lenis storefront for Ammie's Creations (custom tumblers, DTF apparel, bling jackets and keepsakes). Payments still run through Ammie's existing Shopify store, so nothing changes in how she gets paid.

## Run it

```bash
npm install
npm run dev       # local preview at http://localhost:5173
npm run build     # production files in dist/
npm run preview   # serve the production build
```

`dist/` is a static site. Deploy it to Vercel, Netlify or Cloudflare Pages (build command `npm run build`, output folder `dist`).

## How checkout works

- The bag lives in the browser (localStorage).
- **Check out securely** sends the shopper to a Shopify cart permalink on ammiescreations.com:
  `https://ammiescreations.com/cart/VARIANT:QTY,VARIANT:QTY?note=...&ref=ammies-new-site`
- Every personalization field (size, names, numbers, colors, notes) goes into the **order note**, which Ammie sees on the order details page in Shopify admin.
- `ref=ammies-new-site` marks orders that came from the new site.
- Tested on 18 Nov 2026: the link opens Shopify checkout with guest checkout, Shop Pay, PayPal and Google Pay.

Current payment links (one item each):

| Product | Price | Link |
|---|---|---|
| Custom Bling Jean Jacket | $75 | https://ammiescreations.com/cart/44325986566203:1 |
| Custom Team Jersey with Name Sleeve | $60 | https://ammiescreations.com/cart/44325981159483:1 |
| Custom Senior Mom Photo Shirt | $30 | https://ammiescreations.com/cart/44325866045499:1 |
| Personalized Name Tumbler | $30 | https://ammiescreations.com/cart/44325858836539:1 |

## Adding or changing products

Everything is in `src/data/catalog.js`.

1. Create the product in Shopify admin.
2. Open `https://ammiescreations.com/products/<handle>.json` and copy the variant `id`.
3. Add an entry to `PRODUCTS` with that `variantId`, a price matching Shopify, photos and the fields to collect.
4. Put photos in `public/img/` as `name.webp` (about 1400px wide) and `name-sm.webp` (about 640px wide).

Items in `QUOTES` are shown as "Ask Ammie for a quote" cards that open Facebook Messenger. Move one into `PRODUCTS` once it exists on Shopify.

## Where things are

| Section | File | Motion |
|---|---|---|
| Heat-press intro | `src/components/Intro.jsx` | logo and wordmark pressed by a heat plate, once per session |
| Navbar | `src/components/Header.jsx` | auto-hide, dropdowns, mini-bag |
| Pop-ups | `src/components/Popups.jsx` | newsletter, quote request, lightbox |
| Theme switch | `src/components/ThemeSwitch.jsx` | liquid glass button, circular theme reveal |
| Hero 3D tumbler | `src/components/tumblerScene.js` | three.js, live name on a canvas texture, orbiting rhinestones |
| Product marquee | `src/components/Marquee.jsx` | speed and skew follow scroll velocity |
| Shop and quotes | `src/components/Shop.jsx` | card tilt, photo swap, staggered entrances |
| Personalizer | `src/components/ProductSheet.jsx` | clip-path reveal, fly-to-bag |
| How it works | `src/components/Process.jsx` | pinned horizontal scroll (desktop) |
| Occasions | `src/components/Occasions.jsx` | photo fan follows the cursor |
| Gallery | `src/components/Gallery.jsx` | parallax columns |
| Smooth scroll | `src/lib/motion.js` | Lenis wired to GSAP ScrollTrigger |

All motion is skipped for visitors with "reduce motion" turned on.

## Themes

Five themes live in `src/data/themes.js`. Visitors switch with the floating glass button at the bottom right, and the choice is remembered.

| Theme | Mode | Feel |
|---|---|---|
| Bubblegum Pop | bright | hot pink and glitter (default) |
| Lavender Dream | bright | soft lilac with a pink sparkle |
| Peach Sorbet | bright | coral, peach and a little gold |
| Midnight Rosé | dark | black velvet, rose pink and rose gold |
| Sugarplum Galaxy | dark | starry violet with neon pink |

Each theme sets CSS color tokens plus the 3D tumbler's wrap and rhinestone colors. To add one, copy an entry, change the values and give it a new `id`.

## Navbar, pop-ups and glass

- The navbar slides away 2.6 seconds after the intro and drops back when the cursor moves up or reaches the top of the screen. On phones it follows scroll direction instead.
- Shop and Occasions open glass dropdowns.
- Pop-ups: mini-bag after adding a piece, quote request (copies the request and opens Messenger), gallery lightbox (arrow keys work), and a "Join the glitter list" newsletter pop-up after 14 seconds, once per visitor. The newsletter form posts to Shopify's own customer list; Shopify may ask the visitor to finish a quick check in a new tab.
- Every section fills one screen on desktop (900px+ wide, 560px+ tall). Phones scroll naturally.

## For Ammie to confirm before launch

- **Shipping and timing copy.** The FAQ says orders ship within the USA and that timing is confirmed per order. Edit `src/components/Faq.jsx` if that's not right.
- **Customer photos.** The gallery uses photos from her Facebook page, some showing customers and kids. Make sure customers are happy to be shown.
- **Car window decals.** Listed as a quote item but there is no photo yet. Add one to `public/img/` and set `image` in `QUOTES`.
- **Licensed designs.** Facebook photos showing licensed characters, pro team logos or celebrities were left off this site. Selling those designs on a public US store carries legal risk.
- **Contact details.** The Shopify store lists no email or phone. Messenger and the Shopify contact form are used for now.
