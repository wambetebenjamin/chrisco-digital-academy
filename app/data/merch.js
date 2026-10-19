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
    name: "PURSUE Classic Tee",
    category: "T-shirts",
    colour: "Navy",
    price: 45000,
    img: "/merch/tshirt-navy.png",
    sizes: sizeSets.apparel,
    desc: "Heavyweight combed cotton tee with the PURSUE flame mark screen printed on the chest.",
  },
  {
    code: "TS-02",
    name: "PURSUE Classic Tee",
    category: "T-shirts",
    colour: "White",
    price: 45000,
    img: "/merch/tshirt-white.png",
    sizes: sizeSets.apparel,
    desc: "The same heavyweight tee in crisp white, with the mark printed in deep navy.",
  },
  {
    code: "HD-01",
    name: "PURSUE Pullover Hoodie",
    category: "Hoodies",
    colour: "Navy",
    price: 95000,
    img: "/merch/hoodie-navy.png",
    sizes: sizeSets.apparel,
    desc: "Brushed fleece hoodie with a kangaroo pocket and the flame mark across the chest.",
  },
  {
    code: "PL-01",
    name: "PURSUE Pique Polo",
    category: "Polos",
    colour: "White",
    price: 65000,
    img: "/merch/polo-white.png",
    sizes: sizeSets.apparel,
    desc: "Cotton pique polo with a two-button placket and a small embroidered left-chest mark.",
  },
  {
    code: "CP-01",
    name: "PURSUE Six Panel Cap",
    category: "Caps",
    colour: "Navy",
    price: 35000,
    img: "/merch/cap-navy.png",
    sizes: sizeSets.oneSize,
    desc: "Structured twill cap with an embroidered flame mark and an adjustable metal clasp.",
  },
  {
    code: "TB-01",
    name: "PURSUE Canvas Tote",
    category: "Bags",
    colour: "Natural",
    price: 30000,
    img: "/merch/tote-natural.png",
    sizes: sizeSets.oneSize,
    desc: "Heavy undyed canvas tote for books, a laptop and market runs, screen printed in navy.",
  },
  {
    code: "MG-01",
    name: "PURSUE Ceramic Mug",
    category: "Drinkware",
    colour: "White",
    price: 25000,
    img: "/merch/mug-white.png",
    sizes: sizeSets.volume,
    desc: "Matte ceramic mug with a wrap print and a mint hairline under the mark.",
  },
  {
    code: "NB-01",
    name: "PURSUE A5 Notebook",
    category: "Stationery",
    colour: "Navy",
    price: 20000,
    img: "/merch/notebook-navy.png",
    sizes: sizeSets.oneSize,
    desc: "Hardcover A5 notebook with an elastic closure, ribbon marker and the mark foiled in green.",
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
