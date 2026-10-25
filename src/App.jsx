import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CONFIG } from "./config.js";
import Terms from "./Terms.jsx";

// Dollars shown on the page are converted to rupees for UPI.
const toInr = (usd) => Math.round(Number(usd) * CONFIG.usdToInr);

function upiQuery(usd) {
  const p = new URLSearchParams({ pa: CONFIG.upiId, pn: CONFIG.payeeName, tn: CONFIG.note, cu: "INR" });
  if (usd) p.set("am", toInr(usd).toFixed(2));
  return p.toString().replace(/\+/g, "%20");
}

const upiLink = (usd) => "upi://pay?" + upiQuery(usd);

// Generic upi:// links get grabbed by whichever app claimed them (often
// WhatsApp on iPhone), so also offer each app's own link scheme.
const UPI_APPS = [
  ["Google Pay", "tez://upi/pay?"],
  ["PhonePe", "phonepe://pay?"],
  ["Paytm", "paytmmp://pay?"],
  ["Other UPI app", "upi://pay?"],
];

// PayPal.me accepts an amount as a path suffix, e.g. <your link>/20USD
function paypalLink(usd) {
  const base = CONFIG.paypal.replace(/\/+$/, "");
  return usd ? `${base}/${usd}USD` : base;
}

// Guess the payer's country from their device time zone — no permission
// prompt or network call needed. Payers can still switch method by hand.
function looksLikeIndia() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz === "Asia/Kolkata" || tz === "Asia/Calcutta";
  } catch {
    return true;
  }
}

const usd = (n) => "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

function Avatar({ value }) {
  const isImage = /^(https?:\/\/|\/|\.\/)/.test(value);
  return isImage ? <img className="avatar-img" src={value} alt="" /> : <div className="avatar">{value}</div>;
}

const ICONS = {
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  github:
    "M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3",
  youtube:
    "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z",
  instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
};

function Socials() {
  const links = [
    ["linkedin", "LinkedIn", CONFIG.linkedin],
    ["github", "GitHub", CONFIG.github],
    ["youtube", "YouTube", CONFIG.youtube],
    ["instagram", "Instagram", CONFIG.instagram],
  ].filter(([, , url]) => url);
  if (!links.length) return null;

  return (
    <div className="socials">
      {links.map(([key, label, url]) => (
        <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d={ICONS[key]} />
          </svg>
        </a>
      ))}
    </div>
  );
}

// Tiny hash router so the Terms page works on any static host.
export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHash = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return hash === "#terms" ? <Terms /> : <TipJar />;
}

function TipJar() {
  const [amount, setAmount] = useState(CONFIG.defaultAmount);
  const [custom, setCustom] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy");

  const [method, setMethod] = useState(() => (CONFIG.paypal && !looksLikeIndia() ? "paypal" : "upi"));

  const link = useMemo(() => upiLink(amount), [amount]);

  useEffect(() => {
    document.title = "Support " + CONFIG.name;
  }, []);

  const pickPreset = (a) => {
    setAmount(a);
    setCustom("");
  };

  // inputMode is "decimal" so payers can type amounts like 2.50
  const onCustom = (e) => {
    setCustom(e.target.value);
    const v = parseFloat(e.target.value);
    setAmount(v > 0 ? v : null);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.upiId);
      setCopyLabel("Copied!");
    } catch {
      setCopyLabel("Select & copy");
    }
    setTimeout(() => setCopyLabel("Copy"), 1500);
  };

  return (
    <main className="card">
      <Avatar value={CONFIG.avatar} />
      <h1>{CONFIG.name}</h1>
      <Socials />
      <p className="tagline">{CONFIG.tagline}</p>

      <div className="amounts">
        {CONFIG.amounts.map((a) => (
          <button
            key={a}
            type="button"
            className={Number(amount) === a && !custom ? "active" : ""}
            onClick={() => pickPreset(a)}
          >
            {usd(a)}
          </button>
        ))}
      </div>
      <div className="custom">
        <input type="number" min="1" inputMode="decimal" step="0.5" placeholder="Custom $" value={custom} onChange={onCustom} />
      </div>

      {method === "upi" ? (
        <>
          <div className="qr-wrap">
            <QRCodeSVG value={link} size={200} level="M" />
          </div>
          <p className="hint">
            {amount
              ? `Scan to pay ${usd(amount)} (≈ ${inr(toInr(amount))}) with any UPI app`
              : "Scan with GPay, PhonePe, Paytm or any UPI app"}
          </p>

          <div className="upi-id">
            <span>{CONFIG.upiId}</span>
            <button type="button" onClick={copy}>
              {copyLabel}
            </button>
          </div>

          <div className="upi-apps mobile-only">
            <p className="hint">{amount ? `Pay ${usd(amount)} with` : "Pay with"}</p>
            <div className="upi-app-grid">
              {UPI_APPS.map(([label, scheme]) => (
                <a key={label} className="btn btn-secondary" href={scheme + upiQuery(amount)}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <a className="btn btn-primary" href={paypalLink(amount)} target="_blank" rel="noopener noreferrer">
            {amount ? `Tip ${usd(amount)} with PayPal` : "Tip with PayPal"}
          </a>
          <p className="hint">Pay with your PayPal balance or a card.</p>
        </>
      )}

      {CONFIG.paypal && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setMethod(method === "upi" ? "paypal" : "upi")}
        >
          {method === "upi" ? "Outside India? Pay with PayPal" : "In India? Pay with UPI"}
        </button>
      )}

      <p className="disclaimer">
        Tips are voluntary and non-refundable. Nothing is sold in return.
      </p>

      <footer>
        {CONFIG.footer} · <a href="#terms">Terms &amp; Conditions</a>
      </footer>
    </main>
  );
}
