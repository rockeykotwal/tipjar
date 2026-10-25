// Fails if any file in the project hardcodes a UPI ID or PayPal link, or pays
// somewhere other than the VITE_UPI_ID / VITE_PAYPAL env vars.
// Usage: node scripts/check-payment-details.mjs [projectDir]
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");

// .env files are where the real values belong; the rest is generated or vendored.
const SKIP = new Set(["node_modules", "dist", ".git", ".env", ".env.local", ".env.example"]);
const TEXT = /\.(js|jsx|mjs|cjs|ts|tsx|json|html|css|md|yml|yaml|txt|svg)$/i;

const RULES = [
  {
    // "name" + "@" + "handle" with no dot after it, like UPI IDs on @upi or @ybl (emails have a dot, so they don't match)
    name: "hardcoded UPI ID",
    re: /(?<![\w./@-])[\w.-]{2,}@[a-z]{2,}(?![\w.-])/gi,
    // GitHub Actions refs like actions/checkout@v4 aren't UPI IDs
    ignoreLine: /^\s*-?\s*uses:/,
  },
  { name: "hardcoded PayPal link", re: /paypal\.me\/[\w-]+|paypal\.com\/(paypalme|donate|cgi-bin)[^\s"'`]*/gi },
  { name: "UPI link built outside src/App.jsx", re: /upi:\/\/pay/gi, allowIn: ["src/App.jsx"] },
  { name: "UPI 'pa' payee param outside src/App.jsx", re: /[?&{,\s]pa\s*[=:]\s*["'`]?[\w.-]+@/gi, allowIn: ["src/App.jsx"] },
];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (TEXT.test(name)) yield path;
  }
}

const problems = [];

for (const file of walk(root)) {
  const rel = relative(root, file).split("\\").join("/");
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      for (const rule of RULES) {
        if (rule.allowIn?.includes(rel) || rule.ignoreLine?.test(line)) continue;
        for (const m of line.matchAll(rule.re)) problems.push(`${rel}:${i + 1}  ${rule.name}: ${m[0]}`);
      }
    });
}

// config.js must take both values from the env, nothing else.
const config = readFileSync(join(root, "src/config.js"), "utf8");
const mustRead = {
  upiId: /^\s*upiId:\s*import\.meta\.env\.VITE_UPI_ID\s*\|\|\s*""\s*,/m,
  paypal: /^\s*paypal:\s*import\.meta\.env\.VITE_PAYPAL\s*\|\|\s*""\s*,/m,
};
for (const [key, re] of Object.entries(mustRead)) {
  if (!re.test(config)) problems.push(`src/config.js  ${key} must be read from import.meta.env (VITE_${key === "upiId" ? "UPI_ID" : "PAYPAL"})`);
}

// The page must only ever pay CONFIG.upiId / CONFIG.paypal.
const app = readFileSync(join(root, "src/App.jsx"), "utf8");
if (!/pa:\s*CONFIG\.upiId\b/.test(app)) problems.push("src/App.jsx  UPI link must use pa: CONFIG.upiId");
if (!/CONFIG\.paypal\.replace/.test(app)) problems.push("src/App.jsx  PayPal link must be built from CONFIG.paypal");

if (problems.length) {
  console.error("Payment details must only come from .env (VITE_UPI_ID / VITE_PAYPAL):\n");
  for (const p of problems) console.error("  ✗ " + p);
  process.exit(1);
}
console.log("✓ Payment details only come from VITE_UPI_ID / VITE_PAYPAL.");
