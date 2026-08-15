# Kelly Massagens — Sanity setup and operating guide

This project keeps the existing Google Drive workflow for **Profissionais** and adds a very small Sanity CMS for content Kelly needs to change without editing code.

## What Kelly can edit

In **Informações do site**:

- Price — Massagem completa, 1 hour
- Price — Massagem completa, 30 minutes
- WhatsApp
- Telephone
- Monday–Friday hours
- Saturday hours
- Sunday hours
- Address, line 1
- Address, line 2
- WhatsApp for Trabalhe Conosco

In **Promoções**:

- Title
- Description
- Optional promotional price
- Start date
- End date
- Active switch

The start/end dates are **not shown on the public website**. They are only used to decide whether a promotion should appear. The site uses the `America/Sao_Paulo` date when checking the period.

---

## Architecture

- `Google Drive` → daily professionals and professional photos
- `Sanity` → prices, contact details, hours, address, opportunities number, promotions
- `Vercel` → website and server-side API routes

The browser calls `/api/site-content`. That Vercel Function reads only **published** Sanity content and returns it to the site. No Sanity write token is exposed to the website.

If Sanity is temporarily unavailable, the website keeps safe fallback values defined in `src/App.jsx`.

---

# Part A — Create the Sanity project

## 1. Create or sign in to Sanity

Go to:

https://www.sanity.io/manage

Create a project named something like:

`Kelly Massagens`

## 2. Dataset

Use a dataset named:

`production`

For this implementation, set the dataset visibility to **Public**.

This is appropriate here because the values stored in Sanity are all intended to appear publicly on the website. Editing still requires a logged-in Sanity project member.

Copy the **Project ID** from the Sanity project settings. It looks similar to:

`abc123xy`
fg7zus23

You will use it in two places below.

---

# Part B — Configure the included Sanity Studio

The project ZIP already contains a ready-made Studio in:

`sanity-studio/`

## 1. Open Terminal

From the root of the Kelly project:

```bash
cd sanity-studio
npm install
```

## 2. Create the Studio environment file

Copy the example:

```bash
cp .env.example .env
```

Open `sanity-studio/.env` and set:

```env
SANITY_STUDIO_PROJECT_ID=YOUR_PROJECT_ID
SANITY_STUDIO_DATASET=production
```

Example:

```env
SANITY_STUDIO_PROJECT_ID=abc123xy
SANITY_STUDIO_DATASET=production
```

Do not commit `.env` to Git. The included `.gitignore` already excludes it.

## 3. Start Studio locally

```bash
npm run dev
```

Sanity Studio normally opens at:

`http://localhost:3333`

Sign in with the Sanity account that owns the project.

If Sanity reports a CORS error while running locally, run:

```bash
npx sanity cors add http://localhost:3333 --credentials
```

Then restart Studio.

---

# Part C — Enter the initial site information

In Sanity Studio you should see only:

- **Informações do site**
- **Promoções**

Open **Informações do site**.

Fill or confirm:

## Valores

- Massagem completa — 1 hora: `R$ 200`
- Massagem completa — 30 minutos: `R$ 160`

## Contato

- WhatsApp: `(11) 95282-8169`
- Telefone: `(11) 2478-9218`

## Horários

- Segunda a sexta: `12:00 às 20:00`
- Sábado: `12:00 às 18:00`
- Domingo: `Fechado`

## Localização

- Linha 1: `Rua Serra de Juréa, 442 - Tatuapé`
- Linha 2: `São Paulo - SP`

## Oportunidades

- WhatsApp — Trabalhe Conosco: `(11) 95282-8169`

Click **Publish**.

Important: the public site reads only published values. A draft that has not been published will not change the website.

---

# Part D — Deploy Kelly's editing panel

Still inside `sanity-studio/`:

```bash
npm run deploy
```

The first deployment asks you to choose a Studio hostname.

For example:

`kelly-massagens`

would normally create an address similar to:

`https://kelly-massagens.sanity.studio`

Bookmark that address for Kelly.

This is the only interface Kelly needs for ordinary updates.

---

# Part E — Give Kelly access

In Sanity Manage:

1. Open the `Kelly Massagens` project.
2. Open **Members**.
3. Invite Kelly using the email address she will use to sign in.
4. Give her a role that can create/edit/publish content but does not need project administration.

Once she accepts the invitation, she can open the deployed Studio URL and edit content.

---

# Part F — Configure Vercel

The website itself needs the Sanity Project ID so its server-side function can query published content.

In Vercel:

**Project → Settings → Environment Variables**

Add:

```text
SANITY_PROJECT_ID = YOUR_PROJECT_ID
SANITY_DATASET = production
```

These are in addition to the existing Google Drive variables:

```text
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_DRIVE_GALLERY_FOLDER_ID
GOOGLE_DRIVE_DAILYLIST_FOLDER_ID
```

After adding the Sanity variables, redeploy the website once.

After that, normal content edits in Sanity do **not** require another Git commit or Vercel deployment.

---

# Part G — Test the integration

After Vercel deploys, open:

`https://kelly-massagens.vercel.app/api/site-content`

You should see JSON similar to:

```json
{
  "settings": {
    "priceOneHour": "R$ 200",
    "priceThirtyMinutes": "R$ 160",
    "whatsapp": "(11) 95282-8169"
  },
  "promotions": [],
  "date": "2026-08-15"
}
```

Then open the website and verify:

1. `/valores` shows the Sanity prices.
2. `/contato` shows the Sanity phone, WhatsApp, opening hours, and address.
3. The homepage bottom shows the same contact block.
4. `/oportunidades` shows the configured opportunities WhatsApp.
5. `/profissionais` still loads from Google Drive.

---

# Part H — How Kelly creates a promotion

Kelly opens the Studio and chooses:

**Promoções → Create / Nova promoção**

Example:

- Título: `Especial de Agosto`
- Descrição: `Massagem completa de uma hora com condição especial durante o mês de agosto.`
- Preço promocional: `R$ 180`
- Data inicial: `15/08/2026`
- Data final: `31/08/2026`
- Ativa: `sim`

Then click **Publish**.

Public behavior:

- Before 15/08: hidden
- 15/08 through 31/08: visible
- From 01/09 onward: hidden automatically
- Turning **Ativa** off hides it immediately

The public site intentionally does **not** display the start or end date.

You can create multiple promotions whose periods overlap. Every active promotion whose date range includes today will be shown.

---

# Part I — Content changes included in this code version

## Valores

- Massagem completa — 1 hora
- Massagem completa — 30 minutos
- Prices come from Sanity
- Formas de pagamento: Dinheiro, Cartão, PIX
- Promotions appear above prices only when active/current

## Contato

Configurable through Sanity:

- WhatsApp
- Telephone
- Weekday hours
- Saturday hours
- Sunday hours
- Address

The map uses the configured address automatically.

## Sobre

- Uses the burgundy fabric hero image
- Heading changed to `Atendimento personalizado com uma experiência acolhedora.`
- New Kelly host text applied
- Button reads `Agendar horário`

## Homepage

- Header `Agendar horário` now goes to `/contato`
- Removed the sentence explaining that details are on menu pages
- Full Contact section added at the bottom

## Oportunidades

New route:

`/oportunidades`

Contains:

- Trabalhe Conosco
- Quer fazer parte da nossa equipe?
- Nos chame no WhatsApp
- Configurable opportunities WhatsApp number

## Profissionais

No Sanity migration. It continues using the existing Google Drive DailyList/Gallery system.

---

# Part J — Normal day-to-day workflow

## Change a price

1. Kelly opens Sanity Studio.
2. `Informações do site`.
3. `Valores` tab.
4. Change the price.
5. Publish.

## Change opening hours

1. `Informações do site`.
2. `Horários` tab.
3. Edit.
4. Publish.

## Add a promotion

1. `Promoções`.
2. New promotion.
3. Fill title, description, optional price, dates.
4. Publish.

No VS Code, GitHub, or Vercel is needed for these content updates.

---

# Troubleshooting

## Website still shows fallback values

Check:

`/api/site-content`

If it says:

`SANITY_PROJECT_ID is not configured`

add the Vercel environment variable and redeploy.

## `/api/site-content` says the Sanity query failed

Confirm:

- Project ID is correct
- Dataset is named `production`
- Dataset visibility is Public

## Kelly changed a field but the site did not change

Confirm she clicked **Publish**, not only Save/draft.

The site/content API uses short CDN caching, so allow roughly a couple of minutes for cached content to refresh naturally.

## Promotion doesn't appear

Confirm all four conditions:

- It is published
- `Ativa` is on
- Start date is today or earlier
- End date is today or later

The date comparison is based on São Paulo time.
