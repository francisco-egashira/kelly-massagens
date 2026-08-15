# Implementation notes

This version starts from the uploaded Kelly Massagens project and keeps the Google Drive professional/gallery integration.

Main additions:

- `/api/site-content.js`: server-side Sanity Content Lake reader with short CDN cache and timeout.
- `sanity-studio/`: minimal Kelly-focused Studio with two content types only.
- `siteSettings` singleton: prices, contact, hours, address, opportunities WhatsApp.
- `promotion`: title, description, optional price, start/end dates, active switch.
- `src/App.jsx`: runtime content loading with fallback values.
- `/oportunidades` route.
- Reusable contact section used by both Home and Contact.
- Promotions automatically hidden outside their date range.
- Promotion dates are never rendered publicly.

The main site does not need a Sanity token because it reads a public dataset through a Vercel server function. Editing remains authenticated through Sanity Studio.
