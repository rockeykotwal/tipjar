// ===== EDIT THIS FILE to make the page yours =====
// All amounts are in US dollars. UPI only accepts rupees, so the QR
// converts dollars to rupees using usdToInr below.
export const CONFIG = {
  name: "Rockey Kotwal",
  // Social links shown under your name — leave "" to hide one
  linkedin: "https://www.linkedin.com/in/YOUR_LINKEDIN_ID",
  github: "https://github.com/rockeykotwal",
  youtube: "https://www.youtube.com/@Rockey_And_Simran",
  instagram: "https://www.instagram.com/tech_and_twirl/",
  avatar: "☕", // an emoji, or an image URL like "/me.jpg" (put the file in /public)
  tagline: "Everything I build is free. If something I made helped you — this is how you say thanks.",

  usdToInr: 88, // ₹ per $1 — check today's rate and update this once a month

  upiId: import.meta.env.VITE_UPI_ID || "", // your UPI ID — set in .env
  payeeName: "Rockey Kotwal", // name as on your bank account
  note: "Support", // shows in the payer's UPI app
  amounts: [1, 20, 100], // preset buttons ($)
  defaultAmount: 20, // set to null for "any amount"
  // PayPal.me link for payers outside India — shown instead of the UPI QR when
  // the visitor's device isn't on Indian time. Leave "" to always show UPI.
  paypal: import.meta.env.VITE_PAYPAL || "", // set in .env
  footer: "Thank you 🙏",

  // Shown on the Terms page (#terms)
  termsUpdated: "25 October 2026",
};
