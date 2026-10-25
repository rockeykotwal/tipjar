# Tip Jar

A single-page React (Vite) site with a UPI QR code, preset amounts, and a goal progress bar.

## Make it yours
Edit `src/config.js`: your name, social links, goal and amounts.
To update the progress bar, change `goal.raised` and redeploy.

Payment details live only in `.env` (copy `.env.example`), never in code:
- `VITE_UPI_ID` — your UPI ID
- `VITE_PAYPAL` — your PayPal.me link

Add the same two variables in your host's Environment Variables settings.
`npm test` (and CI) fails if a UPI ID or PayPal link is hardcoded anywhere else.

## Run locally
```bash
npm install
npm run dev
```

## Deploy for free
**Cloudflare Pages / Netlify / Vercel:** connect your GitHub repo and use
- Build command: `npm run build`
- Output directory: `dist`

Or run `npm run build` and drag the `dist` folder onto Netlify Drop or Cloudflare Pages.
