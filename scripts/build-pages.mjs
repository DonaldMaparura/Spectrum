/**
 * Generates Spectrum multi-page HTML from shared chrome (header/footer/mobile CTA).
 * Run: node scripts/build-pages.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const WA =
  "https://wa.me/27840212477?text=Hi%20Spectrum%2C%20I%27d%20like%20to%20get%20a%20quote.";
const PHONE = "tel:+27840212477";
const PHONE_ALT = "tel:+27639216255";
const EMAIL = "mailto:Specmechelectrical@gmail.com";

const ICONS = {
  phone: `<svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  whatsapp: `<svg class="btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  check: `<svg class="service-card__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`,
  pin: `<svg class="area-card__pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  shield: `<svg class="trust-strip__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  zap: `<svg class="trust-strip__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  map: `<svg class="trust-strip__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock: `<svg class="trust-strip__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  arrow: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
};

const NAV = [
  { id: "home", label: "Home", path: "" },
  { id: "services", label: "Services", path: "services/" },
  { id: "areas", label: "Service Areas", path: "service-areas/" },
  { id: "gallery", label: "Gallery", path: "gallery/" },
  { id: "about", label: "About", path: "about/" },
  { id: "contact", label: "Contact", path: "contact/" },
];

const SERVICES = [
  {
    id: "electrical",
    icon: "⚡",
    image: "svc-electrical",
    title: "Electrical Installations",
    summary: "Domestic and industrial wiring, panel upgrades, and compliant installations.",
    items: ["New wiring & rewiring", "Panel upgrades", "Industrial installations", "Safety-compliant work"],
  },
  {
    id: "solar",
    icon: "☀",
    image: "svc-solar",
    title: "Solar Installations",
    summary: "System design, installation, and maintenance for homes and businesses.",
    items: ["System design", "Panel installation", "Inverter setup", "Ongoing maintenance"],
  },
  {
    id: "renovations",
    icon: "🏠",
    image: "svc-renovations",
    title: "House Renovations",
    summary: "Layout redesign through to finishing touches with quality craftsmanship.",
    items: ["Layout redesign", "Structural changes", "Finishing", "Project management"],
  },
  {
    id: "floor",
    icon: "🔧",
    image: "svc-floor",
    title: "Tiling, Plumbing & Painting",
    summary: "Tiling, plumbing repairs, painting, and durable paving solutions.",
    items: ["Floor & wall tiling", "Plumbing repairs", "Interior painting", "Driveway paving"],
  },
  {
    id: "construction",
    icon: "🏗",
    image: "svc-construction",
    title: "Construction",
    summary: "Foundations to roofing — projects delivered on time and on budget.",
    items: ["Foundations", "Building work", "Roofing", "Site management"],
  },
  {
    id: "fencing",
    icon: "🔒",
    image: "svc-fencing",
    title: "Electric Fencing & Gates",
    summary: "Installation, maintenance, and repair of perimeter security systems.",
    items: ["Electric fencing", "Automated gates", "Maintenance", "Repairs"],
  },
  {
    id: "clearview",
    icon: "🛡",
    image: "svc-clearview",
    title: "Clear View Fencing",
    summary: "Maximum visibility and security for residential and commercial properties.",
    items: ["Clear view install", "Residential", "Commercial", "Industrial sites"],
  },
  {
    id: "rubble",
    icon: "🚛",
    image: "svc-rubble",
    title: "Rubble Removal",
    summary: "Post-renovation and construction debris removal to keep sites safe.",
    items: ["Site clean-up", "Post-renovation", "Construction debris", "Yard clearing"],
  },
];

const ALL_SERVICE_NAMES = [
  "Electrical Installations",
  "House Renovations",
  "Tiling, Plumbing & Painting",
  "Solar Installations",
  "Construction",
  "Electric Fencing & Gates",
  "Clear View Fencing",
  "Rubble Removal",
  "Domestic wiring",
  "Industrial panel upgrades",
  "Solar system design & install",
  "Automated gate systems",
];

const AREAS = [
  { name: "Greenstone Hill", note: "Our base — fastest response for local homes and businesses.", primary: true },
  { name: "Edenvale", note: "Regular electrical, renovations and fencing call-outs.", primary: true },
  { name: "Modderfontein", note: "Residential installs, fencing and maintenance.", primary: false },
  { name: "Sandton", note: "Commercial and residential electrical & construction.", primary: false },
  { name: "Bedfordview", note: "Renovations, tiling and general electrical work.", primary: false },
  { name: "Kempton Park", note: "Solar, fencing and general electrical services.", primary: false },
  { name: "Midrand", note: "Installations, renovations and construction support.", primary: false },
  { name: "Johannesburg East", note: "Full Spectrum services across the east.", primary: false },
];

const WHY = [
  { icon: "🛡", title: "Compliant workmanship", body: "Installations done carefully to South African safety standards." },
  { icon: "⏱", title: "Available 7 days", body: "Open 7am–6pm every day — ready when you need us." },
  { icon: "🤝", title: "Reliable delivery", body: "We show up when we say we will and finish the job properly." },
  { icon: "🏢", title: "Home & industry", body: "From domestic renovations to commercial and industrial sites." },
  { icon: "✓", title: "Quality finish", body: "Tidy, durable work we're happy to put the Spectrum name to." },
  { icon: "⚡", title: "Full-service team", body: "Electrical, construction, fencing and renovations under one roof." },
];

function asset(depth, file) {
  return `${"../".repeat(depth)}${file}`;
}

function href(depth, path) {
  if (!path) return depth === 0 ? "./" : "../".repeat(depth);
  return `${"../".repeat(depth)}${path}`;
}

function brand(depth) {
  return `<a class="site-brand" href="${href(depth, "")}">
                <picture>
                    <source srcset="${asset(depth, "images/logo.webp")}" type="image/webp" />
                    <img src="${asset(depth, "logo.jpg")}" alt="" class="site-brand__logo" width="56" height="56" decoding="async" />
                </picture>
                <div class="site-brand__text">
                    <p class="site-brand__name">Spectrum</p>
                    <p class="site-brand__tagline">Electrical · Construction · Renovations</p>
                </div>
            </a>`;
}

function header(depth, active) {
  const links = NAV.map((item) => {
    const isActive = item.id === active;
    return `<li>
                        <a class="site-nav__link${isActive ? " is-active" : ""}" href="${href(depth, item.path)}"${isActive ? ' aria-current="page"' : ""}>${item.label}</a>
                    </li>`;
  }).join("\n                    ");

  return `<header class="site-header">
        <div class="container site-header__inner">
            ${brand(depth)}

            <nav class="site-nav" aria-label="Primary">
                <ul class="site-nav__list">
                    ${links}
                </ul>
            </nav>

            <div class="site-header__actions">
                <a class="btn btn--whatsapp btn--sm" href="${WA}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                    ${ICONS.whatsapp}
                    <span class="btn__label">WhatsApp</span>
                </a>
                <a class="btn btn--primary btn--sm" href="${PHONE}" aria-label="Call 084 021 2477">
                    ${ICONS.phone}
                    <span class="btn__label">084 021 2477</span>
                    <span class="btn__label-short">Call</span>
                </a>
            </div>
        </div>
    </header>`;
}

function footer(depth) {
  const pageLinks = NAV.map(
    (item) => `<li><a href="${href(depth, item.path)}">${item.label}</a></li>`,
  ).join("\n                        ");
  const serviceLinks = SERVICES.slice(0, 7)
    .map((s) => `<li><a href="${href(depth, "services/")}#${s.id}">${s.title}</a></li>`)
    .join("\n                        ");

  return `<footer class="site-footer">
        <div class="container">
            <div class="site-footer__grid">
                <div class="site-footer__brand-block">
                    ${brand(depth)}
                    <p class="site-footer__desc">Professional electrical, construction, renovations and fencing services across Johannesburg and surrounding areas.</p>
                </div>
                <nav aria-label="Footer pages">
                    <h3 class="site-footer__heading">Pages</h3>
                    <ul class="site-footer__list">
                        ${pageLinks}
                    </ul>
                </nav>
                <div>
                    <h3 class="site-footer__heading">Services</h3>
                    <ul class="site-footer__list">
                        ${serviceLinks}
                    </ul>
                </div>
                <div>
                    <h3 class="site-footer__heading">Get in touch</h3>
                    <ul class="site-footer__list">
                        <li class="site-footer__contact-item">${ICONS.phone.replace('class="btn__icon"', 'class="site-footer__icon"')} <a href="${PHONE}">084 021 2477</a></li>
                        <li class="site-footer__contact-item">${ICONS.phone.replace('class="btn__icon"', 'class="site-footer__icon"')} <a href="${PHONE_ALT}">063 921 6255</a></li>
                        <li class="site-footer__contact-item">${ICONS.whatsapp.replace('class="btn__icon"', 'class="site-footer__icon"')} <a href="${WA}" target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>
                        <li class="site-footer__contact-item"><svg class="site-footer__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> <a href="${EMAIL}">Specmechelectrical@gmail.com</a></li>
                        <li class="site-footer__contact-item">${ICONS.pin.replace('class="area-card__pin"', 'class="site-footer__icon"')} <span>590 Greenstone Crest, Greenstone Hill, Johannesburg</span></li>
                        <li class="site-footer__contact-item">${ICONS.clock.replace('class="trust-strip__icon"', 'class="site-footer__icon"')} <span>7am – 6pm, Monday to Sunday</span></li>
                    </ul>
                </div>
            </div>
            <div class="site-footer__areas">
                <p><strong>Areas we serve:</strong> ${AREAS.map((a) => a.name).join(" · ")} and surrounding areas.</p>
            </div>
            <div class="site-footer__legal">
                <p class="site-footer__copy">&copy; ${new Date().getFullYear()} Spectrum. All rights reserved.</p>
            </div>
        </div>
    </footer>`;
}

function mobileCta() {
  return `<div class="mobile-cta" aria-label="Quick contact">
        <div class="mobile-cta__grid">
            <a class="mobile-cta__btn mobile-cta__btn--call" href="${PHONE}" aria-label="Call 084 021 2477">
                ${ICONS.phone.replace('class="btn__icon"', "")}
                Call now
            </a>
            <a class="mobile-cta__btn mobile-cta__btn--wa" href="${WA}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                ${ICONS.whatsapp.replace('class="btn__icon"', "")}
                WhatsApp
            </a>
        </div>
    </div>`;
}

function pageHeader(depth, { eyebrow, breadcrumb, title, intro }) {
  return `<section class="page-header">
        <div class="container page-header__grid">
            <div class="page-header__copy">
                <nav aria-label="Breadcrumb">
                    <ol class="page-header__breadcrumb">
                        <li><a href="${href(depth, "")}">Home</a></li>
                        <li aria-hidden="true">/</li>
                        <li aria-current="page">${breadcrumb}</li>
                    </ol>
                </nav>
                ${eyebrow ? `<p class="eyebrow page-header__eyebrow">${eyebrow}</p>` : ""}
                <h1 class="page-header__title">${title}</h1>
                ${intro ? `<p class="page-header__intro">${intro}</p>` : ""}
            </div>
            <div class="page-header__logo" aria-hidden="true">
                <picture>
                    <source srcset="${asset(depth, "images/logo.webp")}" type="image/webp" />
                    <img src="${asset(depth, "logo.jpg")}" alt="" width="180" height="180" decoding="async" />
                </picture>
            </div>
        </div>
    </section>`;
}

function serviceCards(depth, limit = Infinity) {
  return SERVICES.slice(0, limit)
    .map(
      (s) => `<article class="service-card" id="${s.id}">
                    <div class="service-card__media">
                        <picture>
                            <source srcset="${asset(depth, `images/stock/${s.image}.webp`)}" type="image/webp" />
                            <img src="${asset(depth, `images/stock/${s.image}.jpg`)}" alt="${s.title}" width="1400" height="933" loading="lazy" decoding="async" />
                        </picture>
                        <span class="service-card__icon" aria-hidden="true">${s.icon}</span>
                    </div>
                    <div class="service-card__body">
                        <h3 class="service-card__title">${s.title}</h3>
                        <p class="service-card__text">${s.summary}</p>
                        <ul class="service-card__list">
                            ${s.items.map((item) => `<li>${ICONS.check}<span>${item}</span></li>`).join("")}
                        </ul>
                        <a class="service-card__link" href="${href(depth, "contact/")}">Get a quote ${ICONS.arrow}</a>
                    </div>
                </article>`,
    )
    .join("\n                ");
}

function areasGrid() {
  return AREAS.map(
    (a) => `<li class="area-card${a.primary ? " area-card--primary" : ""}">
                        <div class="area-card__top">
                            ${ICONS.pin}
                            <h3 class="area-card__name">${a.name}</h3>
                            ${a.primary ? '<span class="area-card__badge">Priority</span>' : ""}
                        </div>
                        <p class="area-card__note">${a.note}</p>
                    </li>`,
  ).join("\n                    ");
}

function whyGrid() {
  return WHY.map(
    (w) => `<div class="why-card">
                    <span class="why-card__icon" aria-hidden="true">${w.icon}</span>
                    <h3 class="why-card__title">${w.title}</h3>
                    <p class="why-card__text">${w.body}</p>
                </div>`,
  ).join("\n                ");
}

function ctaBand({ emergency = false } = {}) {
  return `<section class="cta-band">
        <div class="container cta-band__inner">
            ${emergency ? '<span class="cta-band__badge">⚡ Need a quote or site support?</span>' : ""}
            <h2 class="cta-band__title">${
              emergency
                ? "Need help on site? Call Spectrum now."
                : "Let's get your next project sorted."
            }</h2>
            <p class="cta-band__text">${
              emergency
                ? "From electrical installs to renovations, fencing and construction — we cover Johannesburg and surrounds."
                : "Get honest advice and a fair quote. Call, WhatsApp or send an enquiry — we respond during business hours."
            }</p>
            <div class="btn-group cta-band__actions">
                <a class="btn btn--primary btn--lg" href="${PHONE}">${ICONS.phone} Call 084 021 2477</a>
                <a class="btn btn--on-dark btn--lg" href="${WA}" target="_blank" rel="noopener noreferrer">${ICONS.whatsapp} WhatsApp</a>
            </div>
            <p class="cta-band__alt">Prefer the second line? <a href="${PHONE_ALT}">063 921 6255</a></p>
        </div>
    </section>`;
}

function mapBlock() {
  return `<div class="map-section">
                    <h3 class="card__title">Find us</h3>
                    <p class="card__text map-section__address">590 Greenstone Crest, Stoneridge Drive, Greenstone Hill, Johannesburg</p>
                    <div class="map-embed">
                        <iframe
                            title="Map showing Spectrum location in Greenstone Hill, Johannesburg"
                            src="https://www.google.com/maps?q=590+Greenstone+Crest,+Stoneridge+Drive,+Greenstone+Hill,+Johannesburg,+South+Africa&amp;output=embed"
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                            allowfullscreen
                        ></iframe>
                    </div>
                    <a
                        class="map-link"
                        href="https://www.google.com/maps/search/?api=1&amp;query=590+Greenstone+Crest+Stoneridge+Drive+Greenstone+Hill+Johannesburg"
                        target="_blank"
                        rel="noopener noreferrer"
                    >Open in Google Maps</a>
                </div>`;
}

function galleryMarkup(depth) {
  const imgs = [
    ["IMG-20250604-WA0046", "Electrical installation work on a commercial panel"],
    ["IMG-20250604-WA0048", "Construction project in progress"],
    ["IMG-20250604-WA0049", "Electric fencing installation on a property perimeter"],
    ["IMG-20250604-WA0050", "Spectrum team at a transformer sub-station"],
    ["IMG-20250604-WA0052", "Completed floor tiling with clean grout lines"],
    ["IMG-20250604-WA0051", "Tiling detail showing precision finish"],
    ["IMG-20250604-WA0053", "Large-format floor tiles being installed"],
    ["IMG-20250604-WA0054", "Tiled floor area with modern finish"],
    ["IMG-20250604-WA0055", "Completed tiling project in a living area"],
  ];

  const slides = imgs
    .map(
      ([name, alt]) => `<figure class="carousel__slide">
                        <picture>
                            <source srcset="${asset(depth, `images/${name}.webp`)}" type="image/webp" />
                            <img src="${asset(depth, `${name}.jpg`)}" alt="${alt}" width="576" height="1280" loading="lazy" decoding="async" />
                        </picture>
                    </figure>`,
    )
    .join("\n                    ");

  // Duplicate track for seamless infinite scroll (left → right)
  return `<div class="carousel" aria-label="Project photo carousel">
                    <div class="carousel__viewport">
                        <div class="carousel__track">
                    ${slides}
                    ${slides}
                        </div>
                    </div>
                </div>`;
}

function shell({ depth, active, title, description, canonicalPath, body, jsonLd }) {
  const canonical = `https://donaldmaparura.github.io/Spectrum/${canonicalPath}`;
  return `<!DOCTYPE html>
<html lang="en-ZA">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${asset(depth, "logo.jpg")}" />
    <meta property="og:locale" content="en_ZA" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />

    <link rel="icon" href="${asset(depth, "images/logo.webp")}" type="image/webp" />
    <link rel="preload" href="${asset(depth, "css/main.css")}" as="style" />
    <link rel="stylesheet" href="${asset(depth, "css/main.css")}" />
    ${jsonLd || ""}
</head>
<body>
    <a class="skip-link" href="#main-content">Skip to main content</a>

    ${header(depth, active)}

    <main id="main-content">
${body}
    </main>

    ${footer(depth)}
    ${mobileCta()}

    <script src="${asset(depth, "js/main.js")}" defer></script>
</body>
</html>
`;
}

/* ---------- Pages ---------- */

const home = shell({
  depth: 0,
  active: "home",
  title: "Spectrum | Electrical, Construction & Renovation Services in Johannesburg",
  description:
    "Spectrum provides professional electrical installations, renovations, solar, construction and fencing across Johannesburg. Available 7 days a week.",
  canonicalPath: "",
  jsonLd: `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Spectrum",
      "description": "Professional electrical, construction and renovation services in Johannesburg.",
      "telephone": "+27840212477",
      "email": "Specmechelectrical@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "590 Greenstone Crest, Stoneridge Drive, Greenstone Hill",
        "addressLocality": "Johannesburg",
        "addressCountry": "ZA"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "07:00",
        "closes": "18:00"
      },
      "areaServed": "Johannesburg",
      "image": "logo.jpg"
    }
    </script>
    <link rel="preload" href="images/hero.webp" as="image" type="image/webp" fetchpriority="high" />`,
  body: `
        <section class="hero" id="top" aria-labelledby="hero-title">
            <div class="hero__bg" aria-hidden="true">
                <picture>
                    <source srcset="images/hero.webp" type="image/webp" />
                    <img src="images/hero.jpg" alt="" width="1920" height="1280" decoding="async" fetchpriority="high" />
                </picture>
            </div>
            <div class="hero__overlay" aria-hidden="true"></div>
            <div class="container hero__inner">
                <div class="hero__content">
                    <p class="eyebrow hero__eyebrow">Johannesburg &amp; surrounds</p>
                    <h1 class="hero__title" id="hero-title">Professional services you can trust, delivered on time</h1>
                    <p class="hero__description">
                        From electrical installations to full renovations, solar, and fencing — Spectrum keeps your home and business running safely.
                    </p>
                    <div class="btn-group btn-group--hero">
                        <a class="btn btn--primary btn--lg" href="${PHONE}">${ICONS.phone} Call 084 021 2477</a>
                        <a class="btn btn--whatsapp btn--lg" href="${WA}" target="_blank" rel="noopener noreferrer">${ICONS.whatsapp} WhatsApp</a>
                        <a class="btn btn--secondary btn--lg btn--on-dark" href="contact/">Get a quote</a>
                    </div>
                </div>
            </div>
        </section>

        <div class="trust-strip">
            <div class="container trust-strip__grid">
                <div class="trust-strip__item">${ICONS.shield}<span class="trust-strip__label">Safety-compliant work</span></div>
                <div class="trust-strip__item">${ICONS.zap}<span class="trust-strip__label">Electrical &amp; construction</span></div>
                <div class="trust-strip__item">${ICONS.clock}<span class="trust-strip__label">Open 7 days a week</span></div>
                <div class="trust-strip__item">${ICONS.map}<span class="trust-strip__label">Johannesburg &amp; surrounds</span></div>
            </div>
        </div>

        <section class="section" aria-labelledby="services-title">
            <div class="container">
                <div class="section__toolbar">
                    <header class="section__header">
                        <p class="eyebrow">What we do</p>
                        <h2 class="section-title" id="services-title">Electrical, construction &amp; renovations — done right</h2>
                        <p class="section-subtitle">Comprehensive solutions for residential, commercial, and industrial clients across Johannesburg.</p>
                    </header>
                    <a class="btn btn--secondary" href="services/">All services ${ICONS.arrow}</a>
                </div>
                <div class="service-cards">
                ${serviceCards(0, 6)}
                </div>
            </div>
        </section>

        <section class="section section--muted" aria-labelledby="why-title">
            <div class="container">
                <header class="section__header">
                    <p class="eyebrow">Why Spectrum</p>
                    <h2 class="section-title" id="why-title">No shortcuts. Just proper work, delivered on time.</h2>
                    <p class="section-subtitle">We keep it simple: turn up when we say we will, do the job properly, and leave it safe and compliant.</p>
                </header>
                <div class="why-grid">
                ${whyGrid()}
                </div>
            </div>
        </section>

        <section class="section" aria-labelledby="gallery-title">
            <div class="container">
                <div class="section__toolbar">
                    <header class="section__header">
                        <p class="eyebrow">Our work</p>
                        <h2 class="section-title" id="gallery-title">Project Gallery</h2>
                        <p class="section-subtitle">Recent projects across electrical, construction, fencing, and flooring work.</p>
                    </header>
                    <a class="btn btn--secondary" href="gallery/">View gallery ${ICONS.arrow}</a>
                </div>
                ${galleryMarkup(0)}
            </div>
        </section>

        <section class="section section--muted" aria-labelledby="areas-title">
            <div class="container">
                <header class="section__header">
                    <p class="eyebrow">Service areas</p>
                    <h2 class="section-title" id="areas-title">We come to you across Johannesburg</h2>
                    <p class="section-subtitle">Based in Greenstone Hill, with coverage across the east and surrounding suburbs.</p>
                </header>
                <div class="areas-layout">
                    <ul class="areas-grid">
                    ${areasGrid()}
                    </ul>
                    ${mapBlock()}
                </div>
                <a class="text-link" href="service-areas/">See all service areas ${ICONS.arrow}</a>
            </div>
        </section>

        ${ctaBand({ emergency: true })}
`,
});

const servicesPage = shell({
  depth: 1,
  active: "services",
  title: "Services | Spectrum Electrical, Construction & Renovations",
  description:
    "Electrical installations, solar, renovations, construction and fencing across Johannesburg.",
  canonicalPath: "services/",
  body: `
        ${pageHeader(1, {
          eyebrow: "Services",
          breadcrumb: "Services",
          title: "Everything we do for home and business",
          intro:
            "From electrical installs to renovations, solar and fencing — one team for the full job.",
        })}

        <section class="section">
            <div class="container">
                <div class="service-cards">
                ${serviceCards(1)}
                </div>
            </div>
        </section>

        <section class="section section--muted">
            <div class="container">
                <header class="section__header">
                    <p class="eyebrow">The full list</p>
                    <h2 class="section-title">Every service we offer</h2>
                    <p class="section-subtitle">Not sure which category your job falls under? Here's everything we do — call us if you don't see it.</p>
                </header>
                <ul class="service-checklist">
                    ${ALL_SERVICE_NAMES.map((n) => `<li>${ICONS.check.replace('class="service-card__check"', 'class="service-card__check"')}<span>${n}</span></li>`).join("\n                    ")}
                </ul>
            </div>
        </section>

        ${ctaBand()}
`,
});

const areasPage = shell({
  depth: 1,
  active: "areas",
  title: "Service Areas | Spectrum Johannesburg",
  description:
    "Spectrum serves Greenstone Hill, Edenvale, Modderfontein, Sandton, Bedfordview, Kempton Park, Midrand and Johannesburg East.",
  canonicalPath: "service-areas/",
  body: `
        ${pageHeader(1, {
          eyebrow: "Coverage",
          breadcrumb: "Service Areas",
          title: "Serving Johannesburg & surrounds",
          intro:
            "We're a mobile service — we come to you. Based in Greenstone Hill with priority response locally, covering the east and greater Johannesburg. Not sure if we reach you? Give us a call.",
        })}

        <section class="section">
            <div class="container">
                <div class="areas-layout">
                    <ul class="areas-grid">
                    ${areasGrid()}
                    </ul>
                    ${mapBlock()}
                </div>
            </div>
        </section>

        ${ctaBand()}
`,
});

const galleryPage = shell({
  depth: 1,
  active: "gallery",
  title: "Project Gallery | Spectrum",
  description:
    "See recent Spectrum projects — electrical, construction, fencing and tiling work across Johannesburg.",
  canonicalPath: "gallery/",
  body: `
        ${pageHeader(1, {
          eyebrow: "Our work",
          breadcrumb: "Gallery",
          title: "Project gallery",
          intro: "A look at recent electrical, construction, fencing and flooring projects completed by the Spectrum team.",
        })}

        <section class="section">
            <div class="container">
                ${galleryMarkup(1)}
            </div>
        </section>

        ${ctaBand()}
`,
});

const aboutPage = shell({
  depth: 1,
  active: "about",
  title: "About Spectrum | Johannesburg Electrical & Construction",
  description:
    "Spectrum is a Johannesburg-based team delivering electrical, construction and renovation services with reliable workmanship and 7-day availability.",
  canonicalPath: "about/",
  body: `
        ${pageHeader(1, {
          eyebrow: "About us",
          breadcrumb: "About",
          title: "Your local electrical, construction & renovations team",
          intro:
            "Spectrum is built on a simple idea: turn up reliably, do proper work, and treat people's homes and businesses with respect.",
        })}

        <section class="section">
            <div class="container about-split">
                <div>
                    <p class="eyebrow">Who we are</p>
                    <h2 class="section-title">Reliable when it matters, thorough where it counts</h2>
                    <div class="section-subtitle" style="max-width:none;margin-top:1.5rem">
                        <p>We're a residential, commercial and industrial service team based in Greenstone Hill, Johannesburg. Our work covers electrical installations, renovations, solar, construction and fencing.</p>
                        <p style="margin-top:1rem">Whether you're a homeowner, estate agent, body corporate or business, you get the same thing: work done properly, safely and on time.</p>
                    </div>
                    <div class="btn-group" style="margin-top:2rem">
                        <a class="btn btn--primary" href="${PHONE}">${ICONS.phone} Call 084 021 2477</a>
                        <a class="btn btn--secondary" href="../contact/">Contact us</a>
                    </div>
                </div>
                <div class="about-split__media">
                    <picture>
                        <source srcset="../images/IMG-20250604-WA0050.webp" type="image/webp" />
                        <img src="../IMG-20250604-WA0050.jpg" alt="Spectrum team on site" width="576" height="1280" loading="lazy" decoding="async" />
                    </picture>
                    <div class="about-split__badge">
                        <p><strong>Electrical · Construction · Renovations</strong></p>
                        <p>Contact: Mr Forbes · Greenstone Hill</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="section section--muted">
            <div class="container">
                <header class="section__header">
                    <p class="eyebrow">How we work</p>
                    <h2 class="section-title">Simple, straightforward, no surprises</h2>
                    <p class="section-subtitle">Four steps from your first call to a job signed off and safe.</p>
                </header>
                <ol class="steps-grid">
                    <li class="step-card">
                        <span class="step-card__num">01</span>
                        <h3 class="step-card__title">Call or WhatsApp</h3>
                        <p class="step-card__text">Tell us what's going on and how we can help.</p>
                    </li>
                    <li class="step-card">
                        <span class="step-card__num">02</span>
                        <h3 class="step-card__title">Assess &amp; quote</h3>
                        <p class="step-card__text">We assess the job and give you a clear, fair price before starting.</p>
                    </li>
                    <li class="step-card">
                        <span class="step-card__num">03</span>
                        <h3 class="step-card__title">Do the work</h3>
                        <p class="step-card__text">Tidy, compliant workmanship — done right the first time.</p>
                    </li>
                    <li class="step-card">
                        <span class="step-card__num">04</span>
                        <h3 class="step-card__title">Sign-off</h3>
                        <p class="step-card__text">We walk you through the finished job so you're happy before we leave.</p>
                    </li>
                </ol>
            </div>
        </section>

        ${ctaBand()}
`,
});

const contactForm = `
                        <form class="contact-form form-stack" action="mailto:Specmechelectrical@gmail.com" method="post" enctype="text/plain">
                            <div class="form-group">
                                <label class="form-label" for="name">Full name</label>
                                <input class="form-input" type="text" id="name" name="name" autocomplete="name" required />
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="phone">Phone number</label>
                                <input class="form-input" type="tel" id="phone" name="phone" autocomplete="tel" required />
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="service">Service needed</label>
                                <select class="form-select" id="service" name="service" required>
                                    <option value="">Select a service</option>
                                    ${SERVICES.map((s) => `<option value="${s.id}">${s.title}</option>`).join("\n                                    ")}
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="message">Message</label>
                                <textarea class="form-textarea" id="message" name="message" placeholder="Tell us about your project…"></textarea>
                                <span class="form-hint">Include location and preferred contact time if possible.</span>
                            </div>
                            <button class="btn btn--primary btn--lg" type="submit">Send request</button>
                        </form>`;

const contactPage = shell({
  depth: 1,
  active: "contact",
  title: "Contact Spectrum | Get a Quote",
  description:
    "Call, WhatsApp or send an enquiry to Spectrum in Greenstone Hill, Johannesburg. Available 7 days a week.",
  canonicalPath: "contact/",
  body: `
        ${pageHeader(1, {
          eyebrow: "Contact",
          breadcrumb: "Contact",
          title: "Get in touch — we'll get right back to you",
          intro:
            "Call or WhatsApp for the fastest response, or send an enquiry below.",
        })}

        <div class="emergency-banner">
            <div class="container emergency-banner__inner">
                <p class="emergency-banner__text">⚡ Need a quote or site visit? Call us today.</p>
                <a class="btn btn--sm" href="${PHONE}">${ICONS.phone} Call 084 021 2477</a>
            </div>
        </div>

        <section class="section">
            <div class="container">
                <div class="contact-quick">
                    <div class="contact-quick__card">
                        <span class="contact-quick__icon contact-quick__icon--call" aria-hidden="true">${ICONS.phone}</span>
                        <h2 class="contact-quick__title">Call us</h2>
                        <ul class="contact-quick__links">
                            <li><a href="${PHONE}">084 021 2477</a></li>
                            <li><a href="${PHONE_ALT}">063 921 6255</a></li>
                        </ul>
                    </div>
                    <div class="contact-quick__card">
                        <span class="contact-quick__icon contact-quick__icon--wa" aria-hidden="true">${ICONS.whatsapp}</span>
                        <h2 class="contact-quick__title">WhatsApp</h2>
                        <ul class="contact-quick__links">
                            <li><a href="${WA}" target="_blank" rel="noopener noreferrer">084 021 2477</a></li>
                        </ul>
                    </div>
                    <div class="contact-quick__card">
                        <span class="contact-quick__icon contact-quick__icon--email" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>
                        <h2 class="contact-quick__title">Email</h2>
                        <ul class="contact-quick__links">
                            <li><a href="${EMAIL}">Specmechelectrical@gmail.com</a></li>
                        </ul>
                    </div>
                </div>

                <div class="contact-layout">
                    <div>
                        <h2 class="section-title" style="font-size:1.5rem">Send an enquiry</h2>
                        <p class="card__text" style="margin-top:0.5rem">Leave your details and we'll get back to you during working hours. Contact person: Mr Forbes.</p>
                        <div style="margin-top:1.5rem">${contactForm}</div>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:1.5rem">
                        <div class="hours-panel">
                            <h3 class="hours-panel__title">Operating hours</h3>
                            <ul class="hours-list">
                                <li><span class="hours-list__label">Monday – Sunday</span><span class="hours-list__value">7:00 – 18:00</span></li>
                            </ul>
                        </div>
                        ${mapBlock()}
                    </div>
                </div>
            </div>
        </section>
`,
});

const pages = [
  ["index.html", home],
  ["services/index.html", servicesPage],
  ["service-areas/index.html", areasPage],
  ["gallery/index.html", galleryPage],
  ["about/index.html", aboutPage],
  ["contact/index.html", contactPage],
];

for (const [rel, html] of pages) {
  const out = join(root, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, "utf8");
  console.log("Wrote", rel);
}

console.log("Done.");
