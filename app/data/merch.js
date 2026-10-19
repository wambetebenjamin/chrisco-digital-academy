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
    colour: "Navy",
    price: 45000,
    img: "/merch/tshirt-navy.png",
    sizes: sizeSets.apparel,
    desc: "Heavyweight combed cotton tee carrying the full PURSUE artwork, the sunrise warrior and the golden arrow, printed on the chest.",
  },
  {
    code: "TS-02",
    name: "PURSUE Sunrise Tee",
    category: "T-shirts",
    colour: "White",
    price: 45000,
    img: "/merch/tshirt-white.png",
    sizes: sizeSets.apparel,
    desc: "The same artwork on a crisp white tee, where the golds and warm light of the print read at their brightest.",
  },
  {
    code: "TS-03",
    name: "PURSUE Sunrise Tee",
    category: "T-shirts",
    colour: "Sand",
    price: 45000,
    img: "/merch/tshirt-sand.png",
    sizes: sizeSets.apparel,
    desc: "A warm sand colourway that lets the artwork's sunrise blend into the fabric for a softer, tonal look.",
  },
  {
    code: "HD-01",
    name: "PURSUE Pullover Hoodie",
    category: "Hoodies",
    colour: "Navy",
    price: 95000,
    img: "/merch/hoodie-navy.png",
    sizes: sizeSets.apparel,
    desc: "Brushed fleece hoodie with a kangaroo pocket and the full PURSUE artwork printed between the drawstrings and the pocket.",
  },
  {
    code: "PL-01",
    name: "PURSUE Pique Polo",
    category: "Polos",
    colour: "Navy",
    price: 65000,
    img: "/merch/polo-navy.png",
    sizes: sizeSets.apparel,
    desc: "Cotton pique polo with a two-button placket and the artwork as a small left-chest print, quietly carried.",
  },
  {
    code: "CP-01",
    name: "PURSUE Six Panel Cap",
    category: "Caps",
    colour: "Navy",
    price: 35000,
    img: "/merch/cap-navy.png",
    sizes: sizeSets.oneSize,
    desc: "Structured twill cap with the artwork embroidered on the front panel and an adjustable metal clasp.",
  },
  {
    code: "TB-01",
    name: "PURSUE Canvas Tote",
    category: "Bags",
    colour: "Natural",
    price: 30000,
    img: "/merch/tote-natural.png",
    sizes: sizeSets.oneSize,
    desc: "Heavy undyed canvas tote for books, a laptop and market runs, carrying the full print on the front.",
  },
  {
    code: "MG-01",
    name: "PURSUE Ceramic Mug",
    category: "Drinkware",
    colour: "White",
    price: 25000,
    img: "/merch/mug-white.png",
    sizes: sizeSets.volume,
    desc: "Matte ceramic mug with the artwork sublimated on the front, for slow mornings and long study sessions.",
  },
  {
    code: "NB-01",
    name: "PURSUE A5 Notebook",
    category: "Stationery",
    colour: "Navy",
    price: 20000,
    img: "/merch/notebook-navy.png",
    sizes: sizeSets.oneSize,
    desc: "Hardcover A5 notebook with an elastic closure and ribbon marker, the artwork reproduced on the cover.",
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
