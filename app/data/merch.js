/*
 * PURSUE merchandise catalogue.
 *
 * Every item carries a short code (e.g. TS-01) that students can quote on
 * WhatsApp or at the campus desk. Prices are indicative in UGX and confirmed
 * when an order is placed.
 */
export const sizeSets = {
  apparel: ["S", "M", "L", "XL", "XXL"],
  oneSize: ["One size"],
  volume: ["350ml", "450ml"],
}

export const merchCategories = [
  { name: "T-shirts", icon: "tshirt" },
  { name: "Hoodies", icon: "layers" },
  { name: "Polos", icon: "users" },
  { name: "Caps", icon: "cap" },
  { name: "Bags", icon: "briefcase" },
  { name: "Drinkware", icon: "clipboard" },
  { name: "Stationery", icon: "book" },
]

export const merch = [
  {
    code: "TS-01",
    name: "PURSUE Sunrise Tee",
    category: "T-shirts",
    colour: "Brown",
    price: 45000,
    img: "/merch/tshirt-brown.png",
    sizes: sizeSets.apparel,
    desc: "Heavyweight combed cotton in chocolate brown, with the full PURSUE artwork centred on the chest. The golds sit best on this colourway.",
  },
  {
    code: "TS-02",
    name: "PURSUE Sunrise Tee",
    category: "T-shirts",
    colour: "Cream",
    price: 45000,
    img: "/merch/tshirt-cream.png",
    sizes: sizeSets.apparel,
    desc: "The same artwork on a warm cream tee, where the sunrise print reads brightest and the edges of the design almost disappear into the cloth.",
  },
  {
    code: "TS-03",
    name: "PURSUE Sunrise Tee",
    category: "T-shirts",
    colour: "Black",
    price: 45000,
    img: "/merch/tshirt-black.png",
    sizes: sizeSets.apparel,
    desc: "Deep black heavyweight cotton that makes the golden arrow the loudest thing in the room.",
  },
  {
    code: "HD-01",
    name: "PURSUE Pullover Hoodie",
    category: "Hoodies",
    colour: "Brown",
    price: 95000,
    img: "/merch/hoodie-brown.png",
    sizes: sizeSets.apparel,
    desc: "Brushed fleece hoodie with a kangaroo pocket, the artwork printed between the drawstrings and the pocket.",
  },
  {
    code: "HD-02",
    name: "PURSUE Pullover Hoodie",
    category: "Hoodies",
    colour: "Cream",
    price: 95000,
    img: "/merch/hoodie-cream.png",
    sizes: sizeSets.apparel,
    desc: "The hoodie in warm cream, with the sunrise artwork sitting softly against the fabric.",
  },
  {
    code: "PL-01",
    name: "PURSUE Pique Polo",
    category: "Polos",
    colour: "Brown",
    price: 65000,
    img: "/merch/polo-brown.png",
    sizes: sizeSets.apparel,
    desc: "Cotton pique polo with a two-button placket and the artwork as a small, neatly centred left-chest print.",
  },
  {
    code: "CP-01",
    name: "PURSUE Six Panel Cap",
    category: "Caps",
    colour: "Brown",
    price: 35000,
    img: "/merch/cap-brown.png",
    sizes: sizeSets.oneSize,
    desc: "Structured twill cap with the artwork embroidered on the front panel in gold and cream thread.",
  },
  {
    code: "TB-01",
    name: "PURSUE Canvas Tote",
    category: "Bags",
    colour: "Natural",
    price: 30000,
    img: "/merch/tote-natural.png",
    sizes: sizeSets.oneSize,
    desc: "Heavy undyed canvas tote for books and market runs, carrying the full print centred on the front.",
  },
  {
    code: "MG-01",
    name: "PURSUE Ceramic Mug",
    category: "Drinkware",
    colour: "Cream",
    price: 25000,
    img: "/merch/mug-cream.png",
    sizes: sizeSets.volume,
    desc: "Warm cream ceramic mug with the artwork sublimated on the front face.",
  },
  {
    code: "NB-01",
    name: "PURSUE A5 Notebook",
    category: "Stationery",
    colour: "Brown",
    price: 20000,
    img: "/merch/notebook-brown.png",
    sizes: sizeSets.oneSize,
    desc: "Hardcover A5 notebook with an elastic closure and ribbon marker, the artwork on the cover.",
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

export function formatPrice(amount) {
  return `UGX ${amount.toLocaleString("en-UG")}`
}
