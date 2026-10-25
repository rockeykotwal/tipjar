import { CONFIG } from "./config.js";

export default function Terms() {
  const name = CONFIG.name;

  return (
    <main className="card legal">
      <a className="back" href="#">
        ← Back
      </a>
      <h1>Terms &amp; Conditions</h1>
      <p className="updated">Last updated: {CONFIG.termsUpdated}</p>

      <p>
        By sending money through this page you agree to these terms. If you do not agree, please do not send a
        payment.
      </p>

      <h2>1. Voluntary tip</h2>
      <p>
        Every payment made through this page is a voluntary, unconditional gift to {name}. You are never required,
        asked or pressured to pay, and nothing on this site is locked behind a payment.
      </p>

      <h2>2. Nothing is sold</h2>
      <p>
        A tip is not a purchase. You receive no product, service, membership, priority support, ownership,
        equity, or any other benefit in return. {name} has no obligation to you because you tipped — including any
        obligation to build, maintain, update or support any tool, website or project.
      </p>

      <h2>3. No refunds</h2>
      <p>
        All tips are final and non-refundable. Please check the amount and recipient before you confirm the
        payment in your UPI app. Any refund — for example after an obvious accidental payment — is entirely at{" "}
        {name}'s discretion and is never owed.
      </p>

      <h2>4. How the money is used</h2>
      <p>
        Any goal or purpose shown on this page (such as covering tool subscriptions) describes {name}'s current
        intention only. Tips go to {name} personally and may be used for any purpose. The progress bar is updated
        by hand and may not be exact.
      </p>

      <h2>5. Payments and currency</h2>
      <p>
        Payments are made through UPI or PayPal and handled entirely by your bank or payment provider — this site
        never sees or stores your card, bank, PayPal or UPI PIN details. For UPI, dollar amounts are converted to
        Indian rupees at an approximate rate; the amount shown in your UPI app is what you actually pay. {name} is not
        responsible for failed, delayed or duplicated transactions, fees, or conversion differences. Contact your bank
        or payment provider for transaction problems. Tips sent through PayPal are also subject to PayPal's own terms.
      </p>

      <h2>6. Not tax-deductible</h2>
      <p>
        {name} is an individual, not a registered charity or non-profit. Tips are not tax-deductible and no tax
        receipt is issued.
      </p>

      <h2>7. Who can tip</h2>
      <p>
        You must be at least 18 years old, or have permission from a parent or guardian, and you must only use money
        and payment accounts you are authorised to use. Payments that appear fraudulent may be reported.
      </p>

      <h2>8. Privacy</h2>
      <p>
        This site does not use accounts or collect personal information. When you pay, your UPI app or PayPal shares details
        such as your name and UPI ID or email with {name}, as with any payment. These details are used only to receive the
        payment and are never sold or shared.
      </p>

      <h2>9. No warranty and limitation of liability</h2>
      <p>
        This site and anything {name} makes are provided "as is" without warranties of any kind. To the fullest extent
        permitted by law, {name} is not liable for any loss or damage arising from your use of this site or from
        sending a tip, and in any case total liability will not exceed the amount you tipped.
      </p>

      <h2>10. Changes and governing law</h2>
      <p>
        These terms may be updated at any time; the date above shows the latest version. These terms are governed by
        the laws of India.
      </p>
    </main>
  );
}
