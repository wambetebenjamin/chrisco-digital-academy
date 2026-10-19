/*
 * Merchandise catalogue.
 *
 * Two collections sit side by side:
 *  - "pursue": the PURSUE artwork (sunrise warrior, golden arrow, 1 Samuel 30:8)
 *  - "faith": quieter Christian affirmations set in type
 *
 * Prices carry both currencies. KSh is the primary figure, UGX is shown
 * alongside so nobody has to convert. Figures are indicative and confirmed on
 * order.
 */
export const sizeSets = {
  apparel: ["S", "M", "L", "XL", "XXL"],
  oneSize: ["One size"],
  volume: ["350ml", "450ml"],
}

export const collections = [
  { id: "all", label: "All merchandise" },
  { id: "pursue", label: "PURSUE" },
  { id: "faith", label: "Faith affirmations" },
]

export const merchCategories = [
  { name: "T-shirts", icon: "tshirt" },
  { name: "Hoodies", icon: "layers" },
  { name: "Polos", icon: "users" },
  { name: "Caps", icon: "cap" },
  { name: "Bags", icon: "briefcase" },
  { name: "Drinkware", icon: "clipboard" },
  { name: "Stationery", icon: "book" },
]

const tee = { kes: 1600, ugx: 45000 }
const hoodie = { kes: 3400, ugx: 95000 }
const polo = { kes: 2300, ugx: 65000 }
const cap = { kes: 1250, ugx: 35000 }
const tote = { kes: 1100, ugx: 30000 }
const mug = { kes: 900, ugx: 25000 }
const notebook = { kes: 700, ugx: 20000 }

export const merch = [
  /* ---------------- PURSUE collection ---------------- */
  {
    code: "TS-01",
    name: "PURSUE Sunrise Tee",
    collection: "pursue",
    category: "T-shirts",
    colour: "Brown",
    price: tee,
    img: "/merch/tshirt-brown.png",
    sizes: sizeSets.apparel,
    specs: ["240gsm combed cotton", "Unisex regular fit", "Screen print, 44% chest"],
    desc: "Heavyweight combed cotton in chocolate brown, with the full PURSUE artwork centred on the chest. The golds sit best on this colourway.",
  },
  {
    code: "TS-02",
    name: "PURSUE Sunrise Tee",
    collection: "pursue",
    category: "T-shirts",
    colour: "Cream",
    price: tee,
    img: "/merch/tshirt-cream.png",
    sizes: sizeSets.apparel,
    specs: ["240gsm combed cotton", "Unisex regular fit", "Screen print, 44% chest"],
    desc: "The same artwork on a warm cream tee, where the sunrise print reads brightest.",
  },
  {
    code: "TS-03",
    name: "PURSUE Sunrise Tee",
    collection: "pursue",
    category: "T-shirts",
    colour: "Black",
    price: tee,
    img: "/merch/tshirt-black.png",
    sizes: sizeSets.apparel,
    specs: ["240gsm combed cotton", "Unisex regular fit", "Screen print, 44% chest"],
    desc: "Deep black heavyweight cotton that makes the golden arrow the loudest thing in the room.",
  },
  {
    code: "TS-04",
    name: "PURSUE Sunrise Tee",
    collection: "pursue",
    category: "T-shirts",
    colour: "White",
    price: tee,
    img: "/merch/tshirt-white.png",
    sizes: sizeSets.apparel,
    specs: ["240gsm combed cotton", "Unisex regular fit", "Screen print, 44% chest"],
    desc: "The classic white tee, with the artwork printed on a light panel so the sky keeps its colour.",
  },
  {
    code: "HD-01",
    name: "PURSUE Pullover Hoodie",
    collection: "pursue",
    category: "Hoodies",
    colour: "Brown",
    price: hoodie,
    img: "/merch/hoodie-brown.png",
    sizes: sizeSets.apparel,
    specs: ["320gsm brushed fleece", "Kangaroo pocket", "Screen print, 38% chest"],
    desc: "Brushed fleece hoodie with a kangaroo pocket, the artwork printed between the drawstrings and the pocket.",
  },
  {
    code: "HD-02",
    name: "PURSUE Pullover Hoodie",
    collection: "pursue",
    category: "Hoodies",
    colour: "Cream",
    price: hoodie,
    img: "/merch/hoodie-cream.png",
    sizes: sizeSets.apparel,
    specs: ["320gsm brushed fleece", "Kangaroo pocket", "Screen print, 38% chest"],
    desc: "The hoodie in warm cream, with the sunrise artwork sitting softly against the fabric.",
  },
  {
    code: "PL-01",
    name: "PURSUE Pique Polo",
    collection: "pursue",
    category: "Polos",
    colour: "Brown",
    price: polo,
    img: "/merch/polo-brown.png",
    sizes: sizeSets.apparel,
    specs: ["220gsm cotton pique", "Two-button placket", "Left chest print, 85mm"],
    desc: "Cotton pique polo with a two-button placket and the artwork as a small, neatly centred left-chest print.",
  },
  {
    code: "PL-02",
    name: "PURSUE Pique Polo",
    collection: "pursue",
    category: "Polos",
    colour: "White",
    price: polo,
    img: "/merch/polo-white.png",
    sizes: sizeSets.apparel,
    specs: ["220gsm cotton pique", "Two-button placket", "Left chest print, 85mm"],
    desc: "A crisp white polo for graduations, church and the office, with the mark kept small on the chest.",
  },
  {
    code: "CP-01",
    name: "PURSUE Six Panel Cap",
    collection: "pursue",
    category: "Caps",
    colour: "Brown",
    price: cap,
    img: "/merch/cap-brown.png",
    sizes: sizeSets.oneSize,
    specs: ["Cotton twill, six panels", "Metal buckle strap", "Embroidery, 58mm"],
    desc: "Structured twill cap with the artwork embroidered on the front panel in gold and cream thread.",
  },
  {
    code: "TB-01",
    name: "PURSUE Canvas Tote",
    collection: "pursue",
    category: "Bags",
    colour: "Natural",
    price: tote,
    img: "/merch/tote-natural.png",
    sizes: sizeSets.oneSize,
    specs: ["12oz undyed canvas", "Reinforced handles", "Screen print, 42% width"],
    desc: "Heavy canvas tote for books and market runs, carrying the full print centred on the front.",
  },
  {
    code: "MG-01",
    name: "PURSUE Ceramic Mug",
    collection: "pursue",
    category: "Drinkware",
    colour: "Cream",
    price: mug,
    img: "/merch/mug-cream.png",
    sizes: sizeSets.volume,
    specs: ["Ceramic, glossy glaze", "Dishwasher safe", "Sublimation, 55% height"],
    desc: "Warm cream ceramic mug with the artwork sublimated on the front face.",
  },
  {
    code: "NB-01",
    name: "PURSUE A5 Journal",
    collection: "pursue",
    category: "Stationery",
    colour: "Brown",
    price: notebook,
    img: "/merch/notebook-brown.png",
    sizes: sizeSets.oneSize,
    specs: ["Hardcover, 160 pages", "Elastic closure, ribbon", "Gold foil emblem"],
    desc: "A quieter take on the artwork: a small gold foil flame emblem and the PURSUE wordmark, no full picture. Made to be carried every day.",
  },

  /* ---------------- Faith affirmations ---------------- */
  {
    code: "TS-05",
    name: "Faith Over Fear Tee",
    collection: "faith",
    category: "T-shirts",
    colour: "White",
    price: tee,
    img: "/merch/tshirt-faith.png",
    sizes: sizeSets.apparel,
    specs: ["240gsm combed cotton", "Unisex regular fit", "Gold screen print"],
    desc: "Faith over fear, set in bold gold caps with a hairline rule. Type only, no picture.",
  },
  {
    code: "TS-06",
    name: "Chosen Tee",
    collection: "faith",
    category: "T-shirts",
    colour: "Black",
    price: tee,
    img: "/merch/tshirt-chosen.png",
    sizes: sizeSets.apparel,
    specs: ["240gsm combed cotton", "Unisex regular fit", "Left chest print, 75mm"],
    desc: "A small gold CHOSEN on the left chest with a cross mark. Quiet enough for any day.",
  },
  {
    code: "HD-03",
    name: "Be Still Hoodie",
    collection: "faith",
    category: "Hoodies",
    colour: "Black",
    price: hoodie,
    img: "/merch/hoodie-black.png",
    sizes: sizeSets.apparel,
    specs: ["320gsm brushed fleece", "Kangaroo pocket", "Cream and gold print"],
    desc: "Be still and know, in cream and gold type across the chest. The calmest piece in the range.",
  },
  {
    code: "CP-02",
    name: "Anchored Cap",
    collection: "faith",
    category: "Caps",
    colour: "White",
    price: cap,
    img: "/merch/cap-white.png",
    sizes: sizeSets.oneSize,
    specs: ["Cotton twill, six panels", "Gold buckle strap", "Embroidery, 58mm"],
    desc: "Anchored, embroidered in gold with an anchor mark above the word.",
  },
  {
    code: "TB-02",
    name: "Grace Canvas Tote",
    collection: "faith",
    category: "Bags",
    colour: "Natural",
    price: tote,
    img: "/merch/tote-grace.png",
    sizes: sizeSets.oneSize,
    specs: ["12oz undyed canvas", "Reinforced handles", "Brown screen print"],
    desc: "Grace upon grace, printed in deep brown type on undyed canvas.",
  },
  {
    code: "MG-02",
    name: "Risen Mug",
    collection: "faith",
    category: "Drinkware",
    colour: "White",
    price: mug,
    img: "/merch/mug-white.png",
    sizes: sizeSets.volume,
    specs: ["Ceramic, glossy glaze", "Dishwasher safe", "Gold print"],
    desc: "Risen, with a small gold cross. A morning reminder in a mug.",
  },
  {
    code: "NB-02",
    name: "Wonderfully Made Journal",
    collection: "faith",
    category: "Stationery",
    colour: "Cream",
    price: notebook,
    img: "/merch/notebook-cream.png",
    sizes: sizeSets.oneSize,
    specs: ["Hardcover, 160 pages", "Elastic closure, ribbon", "Gold foil lettering"],
    desc: "Wonderfully made, foil blocked on a cream cover, with a small leaf emblem above the words.",
  },
]

export const merchCodes = merch.map((item) => item.code)

export function findMerch(code) {
  return merch.find((item) => item.code === code) || null
}

/* Recommended items: same category siblings first, then a complementary
   category, never the item being viewed. */
export function recommendationsFor(code, limit = 3) {
  const current = findMerch(code)
  if (!current) return merch.slice(0, limit)

  const complements = {
    "T-shirts": ["Hoodies", "Caps", "Bags"],
    Hoodies: ["T-shirts", "Caps", "Stationery"],
    Polos: ["Caps", "Bags", "T-shirts"],
    Caps: ["T-shirts", "Hoodies", "Bags"],
    Bags: ["Stationery", "Drinkware", "T-shirts"],
    Drinkware: ["Stationery", "Bags", "T-shirts"],
    Stationery: ["Bags", "Drinkware", "Caps"],
  }

  const order = [...(complements[current.category] || []), current.category]
  const pool = merch.filter((item) => item.code !== code)
  const picks = []

  for (const category of order) {
    for (const item of pool) {
      if (picks.length >= limit) break
      if (item.category === category && !picks.includes(item)) picks.push(item)
    }
  }
  for (const item of pool) {
    if (picks.length >= limit) break
    if (!picks.includes(item)) picks.push(item)
  }
  return picks
}

/* ---------- pricing ---------- */
export function priceKsh(item) {
  return item?.price?.kes ?? 0
}

export function priceUgx(item) {
  return item?.price?.ugx ?? 0
}

export function formatKsh(amount) {
  return `KSh ${Number(amount).toLocaleString("en-KE")}`
}

export function formatUgx(amount) {
  return `UGX ${Number(amount).toLocaleString("en-UG")}`
}

/* "KSh 1,600" plus the UGX figure for reference. */
export function formatPricePair(item) {
  return { primary: formatKsh(priceKsh(item)), secondary: formatUgx(priceUgx(item)) }
}

/* Line total for an order, e.g. 2 hoodies at KSh 3,400. */
export function lineTotals(line) {
  return {
    kes: priceKsh(line) * line.qty,
    ugx: priceUgx(line) * line.qty,
  }
}
