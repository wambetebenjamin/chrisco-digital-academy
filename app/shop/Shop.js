"use client"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Icon from "../components/Icon"
import {
  merch,
  merchCategories,
  collections,
  sizeSets,
  recommendationsFor,
  findMerch,
  formatKsh,
  formatUgx,
  priceKsh,
  priceUgx,
  whatsappInquiry,
} from "../data/merch"
import { readMyCode, buildRefLink } from "../lib/referral"
import { org } from "../data/org"

const CART_KEY = "chrisco:merch-order"

const COLOUR_SWATCHES = {
  Cocoa: "#5A4232",
  Cream: "#EFE6D4",
  Ink: "#191A1C",
  Chalk: "#F6F4EF",
  Sand: "#D8CCB2",
  "Deep teal": "#0E2A38",
}

const COLLECTION_META = {
  pursue: {
    num: "01",
    eyebrow: "Signature Collection · 1 Samuel 30:8",
    title: "The PURSUE Collection",
    subtitle:
      "Core academy apparel and study companions built around the PURSUE emblem across cocoa, cream, ink, chalk and sand.",
  },
  faith: {
    num: "02",
    eyebrow: "Everyday Witness",
    title: "Faith Affirmations",
    subtitle:
      "Typographic pieces and embroidered essentials designed for campus life, fellowship, and daily wear.",
  },
  scripture: {
    num: "03",
    eyebrow: "Word in Full · 1 Samuel 30:8 & Epistles",
    title: "Scripture Statements",
    subtitle:
      "Statement garments and desk pieces carrying the full promise of 1 Samuel 30:8, 2 Corinthians 5:7, 2 Corinthians 6:2 and Matthew 4:19.",
  },
  drops: {
    num: "04",
    eyebrow: "Original Ministry Art",
    title: "Community Design Drops",
    subtitle:
      "Illustrated youth convention, Christ Fest and media ministry graphics printed faithfully as drawn.",
  },
}

function readCart() {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(window.localStorage.getItem(CART_KEY) || "[]")
  } catch {
    return []
  }
}

function saveCart(items) {
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {
    /* storage unavailable */
  }
}

function orderMessage(items, ref) {
  const lines = items.map(
    (line) =>
      `${line.qty} x ${line.code} ${line.name} (${line.colour}) size ${line.size} - ${formatKsh(priceKsh(line) * line.qty)} / ${formatUgx(priceUgx(line) * line.qty)}`
  )
  if (ref) lines.push(`Referred by: ${ref}`)
  return encodeURIComponent(lines.join("\n"))
}

export default function Shop({ initialCode = "" }) {
  const [collection, setCollection] = useState("all")
  const [category, setCategory] = useState("All")
  const [colourFilter, setColourFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCode, setActiveCode] = useState(initialCode || "")
  const [size, setSize] = useState("")
  const [qty, setQty] = useState(1)
  const [cart, setCart] = useState([])
  const [trayOpen, setTrayOpen] = useState(false)
  const [copied, setCopied] = useState("")
  const [sizeGuide, setSizeGuide] = useState(false)

  useEffect(() => {
    // One-shot hydration of the saved order from localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(readCart())
  }, [])

  const active = activeCode ? findMerch(activeCode) : null
  const recommended = useMemo(
    () => (active ? recommendationsFor(active.code, 3) : []),
    [active]
  )

  const activeSiblings = useMemo(() => {
    if (!active) return []
    return merch.filter((m) => m.name === active.name && m.category === active.category)
  }, [active])

  const siblingsByName = useMemo(() => {
    const map = new Map()
    for (const item of merch) {
      const key = `${item.category}::${item.name}`
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(item)
    }
    return map
  }, [])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return merch.filter((m) => {
      if (collection !== "all" && m.collection !== collection) return false
      if (category !== "All" && m.category !== category) return false
      if (colourFilter !== "All" && m.colour !== colourFilter) return false
      if (q) {
        const hay = `${m.code} ${m.name} ${m.colour} ${m.category} ${m.desc}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [collection, category, colourFilter, searchQuery])

  const groupedSections = useMemo(() => {
    const order = ["pursue", "faith", "scripture", "drops"]
    const activeOrder = collection === "all" ? order : order.filter((id) => id === collection)
    return activeOrder
      .map((colId) => ({
        id: colId,
        meta: COLLECTION_META[colId],
        items: filtered.filter((m) => m.collection === colId),
      }))
      .filter((sec) => sec.items.length > 0)
  }, [filtered, collection])

  const totalKes = cart.reduce((sum, line) => sum + priceKsh(line) * line.qty, 0)
  const totalUgx = cart.reduce((sum, line) => sum + priceUgx(line) * line.qty, 0)
  const count = cart.reduce((sum, line) => sum + line.qty, 0)

  function openItem(item, preselectedSize = "") {
    setActiveCode(item.code)
    if (preselectedSize) {
      setSize(preselectedSize)
    } else {
      setSize(item.sizes.length === 1 ? item.sizes[0] : "")
    }
    setQty(1)
  }

  function closeItem() {
    setActiveCode("")
    setSize("")
    setQty(1)
  }

  function addToOrder() {
    if (!active || !size) return
    const next = [...cart]
    const key = `${active.code}-${size}`
    const existing = next.find((line) => line.key === key)
    if (existing) existing.qty += qty
    else
      next.push({
        key,
        code: active.code,
        name: active.name,
        colour: active.colour,
        img: active.img,
        price: active.price,
        collection: active.collection,
        size,
        qty,
      })
    setCart(next)
    saveCart(next)
    setTrayOpen(true)
    closeItem()
  }

  function changeQty(key, delta) {
    const next = cart
      .map((line) => (line.key === key ? { ...line, qty: Math.max(0, line.qty + delta) } : line))
      .filter((line) => line.qty > 0)
    setCart(next)
    saveCart(next)
  }

  async function shareItem(item) {
    const code = readMyCode()
    const url = code
      ? buildRefLink(code, `/shop?item=${item.code}`)
      : `${window.location.origin}/shop?item=${item.code}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(item.code)
      setTimeout(() => setCopied(""), 2200)
    } catch {
      setCopied("")
    }
  }

  function resetAllFilters() {
    setCollection("all")
    setCategory("All")
    setColourFilter("All")
    setSearchQuery("")
  }

  function renderCard(item) {
    const siblings = siblingsByName.get(`${item.category}::${item.name}`) || []
    const swatchHex = COLOUR_SWATCHES[item.colour] || "#5A4232"
    return (
      <article key={item.code} className="merch-card">
        <button
          type="button"
          className="merch-media"
          onClick={() => openItem(item)}
          aria-label={`View ${item.name} (${item.code})`}
        >
          <span className="merch-code">{item.code}</span>
          <span className="merch-colour-tag">
            <span
              className="merch-colour-dot"
              style={{ backgroundColor: swatchHex }}
              aria-hidden="true"
            />
            {item.colour}
          </span>
          <Image
            src={item.img}
            alt={`${item.name}, ${item.colour} colourway`}
            width={640}
            height={800}
            className="merch-img"
            sizes="(min-width: 1200px) 280px, (min-width: 768px) 32vw, 90vw"
          />
          <span className="merch-view">Quick view &amp; sizes</span>
        </button>

        <div className="merch-body">
          <div className="merch-meta-top">
            <span className="merch-meta">
              {item.colour} · {item.category}
            </span>
            {siblings.length > 1 && (
              <div className="merch-sibling-dots" title={`${siblings.length} colourways available`}>
                {siblings.map((sib) => (
                  <span
                    key={sib.code}
                    className={`merch-sibling-dot${sib.code === item.code ? " is-current" : ""}`}
                    style={{ backgroundColor: COLOUR_SWATCHES[sib.colour] || "#5A4232" }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="merch-row">
            <h3 onClick={() => openItem(item)} style={{ cursor: "pointer" }}>
              {item.name}
            </h3>
          </div>

          <p className="merch-desc-snippet">{item.desc}</p>

          <div className="merch-price-row">
            <span className="merch-price">{formatKsh(priceKsh(item))}</span>
            <span className="merch-price-alt">{formatUgx(priceUgx(item))}</span>
          </div>

          <div className="merch-sizes">
            {item.sizes.map((s) => (
              <span
                key={s}
                title={`Select size ${s}`}
                onClick={() => openItem(item, s)}
              >
                {s}
              </span>
            ))}
          </div>

          <div className="merch-card-actions">
            <button
              type="button"
              className="merch-quick-btn"
              onClick={() => openItem(item)}
            >
              Select size
            </button>
            <a
              className="merch-wa"
              href={`${org.whatsapp}?text=${whatsappInquiry(item, { ref: readMyCode() })}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Message on WhatsApp about ${item.name} (${item.code})`}
            >
              <Icon name="whatsapp" size={14} />
              <span>WhatsApp</span>
              <em>{item.code}</em>
            </a>
          </div>
        </div>
      </article>
    )
  }

  return (
    <>
      {/* ---------- catalogue ---------- */}
      <section className="section-frost" style={{ padding: "56px 0 88px" }}>
        <div className="container">
          <div className="shop-head">
            <div>
              <span className="eyebrow">Official Merchandise Catalogue</span>
              <h2 className="title" style={{ marginTop: 12 }}>
                Wear the <span className="accent">pursuit</span>
              </h2>
              <p className="shop-head-sub">
                35 studio-crafted pieces across four collections in Cocoa, Cream, Ink, Chalk, Sand and Deep Teal.
              </p>
            </div>
            <button
              type="button"
              className={`shop-tray-btn${count ? " has-items" : ""}`}
              onClick={() => setTrayOpen(true)}
            >
              <Icon name="clipboard" size={16} strokeWidth={2} />
              My order
              <span className="shop-tray-count">{count}</span>
            </button>
          </div>

          <div className="shop-wa-strip">
            <div className="shop-wa-copy">
              <span className="shop-wa-ico">
                <Icon name="whatsapp" size={18} />
              </span>
              <p>
                <strong>Order straight on WhatsApp.</strong> Pick a design, note its code, or add multiple pieces to{" "}
                <strong>My order</strong>. We confirm size, colour, total and delivery in the chat.
              </p>
            </div>
            <a
              className="btn btn-green btn-sm shop-wa-btn"
              style={{ textDecoration: "none" }}
              href={`${org.whatsapp}?text=${encodeURIComponent(
                "Hi CHRISCO, I would like to order merchandise. Here is the design code: "
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" size={15} /> Message on WhatsApp
            </a>
          </div>

          {/* ---------- console / filters ---------- */}
          <div className="shop-filters-wrap">
            <div className="shop-filter-group">
              <span className="shop-filter-label">Collection</span>
              <div className="shop-filters shop-filters-collection">
                {collections.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCollection(c.id)}
                    className={`pill pill-sm${collection === c.id ? " is-active" : ""}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="shop-filter-group">
              <span className="shop-filter-label">Garment &amp; Item Type</span>
              <div className="shop-filters">
                {["All", ...merchCategories.map((c) => c.name)].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setCategory(name)}
                    className={`pill pill-sm${category === name ? " is-active" : ""}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="shop-filter-bar-bottom">
              <div className="shop-colour-filters">
                <span className="shop-filter-label">Shade</span>
                <div className="shop-colour-pills">
                  {["All", ...Object.keys(COLOUR_SWATCHES)].map((colName) => (
                    <button
                      key={colName}
                      type="button"
                      onClick={() => setColourFilter(colName)}
                      className={`shop-colour-pill${colourFilter === colName ? " is-active" : ""}`}
                    >
                      {colName !== "All" && (
                        <span
                          className="shop-colour-pill-dot"
                          style={{ backgroundColor: COLOUR_SWATCHES[colName] }}
                          aria-hidden="true"
                        />
                      )}
                      {colName === "All" ? "All shades" : colName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="shop-search-box">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by code (TS-07), verse or name…"
                  aria-label="Search merchandise"
                  className="shop-search-input"
                />
                {(collection !== "all" || category !== "All" || colourFilter !== "All" || searchQuery) && (
                  <button type="button" className="shop-reset-btn" onClick={resetAllFilters}>
                    Reset ({filtered.length})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ---------- grouped collection sections ---------- */}
          {groupedSections.length === 0 ? (
            <div className="shop-empty-filter">
              <p>No merchandise items match your current filter combination.</p>
              <button type="button" className="btn btn-outline btn-sm" onClick={resetAllFilters}>
                Show all 35 designs
              </button>
            </div>
          ) : (
            <div className="shop-sections-stack">
              {groupedSections.map((section) => (
                <div key={section.id} className="shop-collection-block">
                  <div className="shop-collection-header">
                    <div className="shop-collection-title-wrap">
                      <span className="shop-collection-num">{section.meta.num}</span>
                      <div>
                        <span className="shop-collection-eyebrow">{section.meta.eyebrow}</span>
                        <h3 className="shop-collection-title">{section.meta.title}</h3>
                        <p className="shop-collection-sub">{section.meta.subtitle}</p>
                      </div>
                    </div>
                    <span className="shop-collection-count">
                      {section.items.length} {section.items.length === 1 ? "piece" : "pieces"}
                    </span>
                  </div>

                  <div className="merch-grid">
                    {section.items.map((item) => renderCard(item))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="shop-note">
            Every design carries a code. Message us on WhatsApp with that code and we confirm size, colour, total
            and delivery in the chat. Prices are shown in KSh with the UGX figure alongside, delivery is quoted
            separately, and bulk orders for churches, schools and teams get a discount. For example{" "}
            <strong>TS-07, M, 2 pieces</strong>.
          </p>
        </div>
      </section>

      {/* ---------- sticky order pill (phones) ---------- */}
      {count > 0 && (
        <button type="button" className="shop-mobile-cta" onClick={() => setTrayOpen(true)}>
          <Icon name="clipboard" size={15} strokeWidth={2} />
          {count} item{count > 1 ? "s" : ""} · {formatKsh(totalKes)}
        </button>
      )}

      {/* ---------- product modal ---------- */}
      {active && (
        <div className="overlay overlay-sheet" onClick={closeItem}>
          <div className="shop-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="shop-modal-close" onClick={closeItem} aria-label="Close">
              <Icon name="x" size={18} strokeWidth={2.2} />
            </button>

            <div className="shop-modal-grid">
              <div className="shop-modal-media">
                <Image
                  src={active.img}
                  alt={active.name}
                  width={720}
                  height={900}
                  sizes="(min-width: 900px) 420px, 90vw"
                  className="shop-modal-img"
                />
                <span className="merch-code">{active.code}</span>
              </div>

              <div className="shop-modal-body">
                <span className="eyebrow" style={{ fontSize: 11 }}>{active.category}</span>
                <h3 className="shop-modal-title">{active.name}</h3>
                <p className="shop-modal-price">
                  {formatKsh(priceKsh(active))} <span>· {formatUgx(priceUgx(active))} · {active.colour}</span>
                </p>
                <p className="shop-modal-desc">{active.desc}</p>

                {activeSiblings.length > 1 && (
                  <div className="shop-field">
                    <span className="shop-label">
                      Colourway <strong>{active.colour}</strong>
                    </span>
                    <div className="shop-sibling-row">
                      {activeSiblings.map((sib) => (
                        <button
                          key={sib.code}
                          type="button"
                          onClick={() => openItem(sib, size)}
                          className={`shop-sibling-chip${sib.code === active.code ? " is-active" : ""}`}
                        >
                          <span
                            className="shop-colour-pill-dot"
                            style={{ backgroundColor: COLOUR_SWATCHES[sib.colour] || "#5A4232" }}
                          />
                          {sib.colour} <em>({sib.code})</em>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <ul className="shop-specs">
                  {(active.specs || []).map((spec) => (
                    <li key={spec}>
                      <Icon name="checkCircle" size={13} strokeWidth={2.2} />
                      {spec}
                    </li>
                  ))}
                </ul>

                <div className="shop-field">
                  <span className="shop-label">
                    Size {size ? <strong>{size}</strong> : <em>select one</em>}
                  </span>
                  <div className="shop-size-row">
                    {active.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`shop-size${size === s ? " is-active" : ""}`}
                        aria-pressed={size === s}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {active.sizes === sizeSets.apparel && (
                    <button type="button" className="shop-size-guide-btn" onClick={() => setSizeGuide(true)}>
                      Size guide
                    </button>
                  )}
                </div>

                <div className="shop-field">
                  <span className="shop-label">Quantity</span>
                  <div className="shop-qty">
                    <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
                    <span>{qty}</span>
                    <button type="button" onClick={() => setQty(Math.min(99, qty + 1))} aria-label="Increase quantity">+</button>
                    <span className="shop-line-total">
                      {formatKsh(priceKsh(active) * qty)}
                      <em>{formatUgx(priceUgx(active) * qty)}</em>
                    </span>
                  </div>
                </div>

                <div className="shop-modal-actions">
                  <a
                    className="btn btn-green"
                    style={{ textDecoration: "none" }}
                    href={`${org.whatsapp}?text=${whatsappInquiry(active, { size, qty, ref: readMyCode() })}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="whatsapp" size={16} /> Send code on WhatsApp
                  </a>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={addToOrder}
                    disabled={!size}
                    style={{ cursor: size ? "pointer" : "not-allowed", opacity: size ? 1 : 0.55 }}
                  >
                    Add to order
                  </button>
                  <button type="button" className="btn btn-outline shop-modal-share" onClick={() => shareItem(active)} aria-label="Copy share link">
                    <Icon name="send" size={15} /> {copied === active.code ? "Copied" : "Share"}
                  </button>
                </div>
                <p className="shop-modal-hint">
                  {size
                    ? `Your message will include ${active.code}, size ${size} and quantity ${qty}.`
                    : `Pick a size to include it automatically, or send the code ${active.code} and we will confirm sizes in the chat.`}
                </p>
              </div>
            </div>

            {recommended.length > 0 && (
              <div className="shop-recs">
                <div className="shop-recs-head">
                  <span className="eyebrow" style={{ fontSize: 11 }}>Recommended</span>
                  <span className="shop-recs-hint">Pairs well with your selection</span>
                </div>
                <div className="shop-recs-row">
                  {recommended.map((rec) => (
                    <button key={rec.code} type="button" className="shop-rec" onClick={() => openItem(rec)}>
                      <Image src={rec.img} alt={rec.name} width={160} height={200} sizes="120px" />
                      <span className="shop-rec-code">{rec.code}</span>
                      <span className="shop-rec-name">{rec.name}</span>
                      <span className="shop-rec-price">{formatKsh(priceKsh(rec))}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- size guide ---------- */}
      {sizeGuide && (
        <div className="overlay" onClick={() => setSizeGuide(false)}>
          <div className="shop-guide" onClick={(e) => e.stopPropagation()}>
            <div className="shop-tray-head">
              <div>
                <span className="eyebrow" style={{ fontSize: 11 }}>Fit</span>
                <h3>Size guide</h3>
              </div>
              <button type="button" className="shop-modal-close static" onClick={() => setSizeGuide(false)} aria-label="Close size guide">
                <Icon name="x" size={18} strokeWidth={2.2} />
              </button>
            </div>
            <table className="shop-guide-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (cm)</th>
                  <th>Length (cm)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["S", "96", "68"],
                  ["M", "102", "71"],
                  ["L", "108", "74"],
                  ["XL", "114", "77"],
                  ["XXL", "120", "80"],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="shop-guide-note">
              Measured flat across the chest on a relaxed fit. If you are between sizes, take the larger one. Bulk
              size runs can be mixed per code.
            </p>
          </div>
        </div>
      )}

      {/* ---------- order tray ---------- */}
      {trayOpen && (
        <div className="overlay" onClick={() => setTrayOpen(false)}>
          <aside className="shop-tray" onClick={(e) => e.stopPropagation()} aria-label="My order">
            <div className="shop-tray-head">
              <div>
                <span className="eyebrow" style={{ fontSize: 11 }}>Order summary</span>
                <h3>My order</h3>
              </div>
              <button type="button" className="shop-modal-close static" onClick={() => setTrayOpen(false)} aria-label="Close order">
                <Icon name="x" size={18} strokeWidth={2.2} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="shop-empty">
                <Icon name="clipboard" size={26} strokeWidth={1.6} />
                <p>No items yet. Choose a size and quantity to start an order.</p>
              </div>
            ) : (
              <>
                <ul className="shop-lines">
                  {cart.map((line) => (
                    <li key={line.key} className="shop-line">
                      <Image src={line.img} alt="" width={64} height={80} sizes="64px" />
                      <div className="shop-line-copy">
                        <strong>{line.code} · {line.name}</strong>
                        <span>{line.colour} · size {line.size}</span>
                        <div className="shop-line-qty">
                          <button type="button" onClick={() => changeQty(line.key, -1)} aria-label={`Remove one ${line.code}`}>−</button>
                          <span>{line.qty}</span>
                          <button type="button" onClick={() => changeQty(line.key, 1)} aria-label={`Add one ${line.code}`}>+</button>
                        </div>
                      </div>
                      <span className="shop-line-price">
                        {formatKsh(priceKsh(line) * line.qty)}
                        <em>{formatUgx(priceUgx(line) * line.qty)}</em>
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="shop-total">
                  <span>Estimated total</span>
                  <strong>
                    {formatKsh(totalKes)}
                    <em>{formatUgx(totalUgx)}</em>
                  </strong>
                </div>

                <a
                  className="btn btn-green btn-block"
                  style={{ textDecoration: "none" }}
                  href={`${org.whatsapp}?text=${orderMessage(cart, readMyCode())}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="whatsapp" size={16} /> Send this order on WhatsApp
                </a>
                <a
                  className="btn btn-outline btn-block"
                  style={{ textDecoration: "none", marginTop: 10 }}
                  href={`mailto:${org.email}?subject=${encodeURIComponent("Merchandise order")}&body=${orderMessage(cart, readMyCode()).replace(/%0A/g, "%0D%0A")}`}
                >
                  <Icon name="mail" size={15} /> Order by email
                </a>
                <p className="shop-tray-note">
                  Your order is not paid online. We confirm size, colour and delivery on WhatsApp, then send payment
                  details.
                </p>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  )
}
