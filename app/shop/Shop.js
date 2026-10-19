"use client"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Icon from "../components/Icon"
import { merch, merchCategories, recommendationsFor, formatPrice, findMerch } from "../data/merch"
import { readMyCode, buildRefLink } from "../lib/referral"
import { org } from "../data/org"

const CART_KEY = "chrisco:merch-order"

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

function orderMessage(items) {
  const lines = items.map(
    (line) => `${line.qty} x ${line.code} ${line.name} (${line.colour}) size ${line.size}`
  )
  return `Hello CHRISCO Youth Aflame, I would like to order:%0A${encodeURIComponent(lines.join("\n"))}`
}

export default function Shop({ initialCode = "" }) {
  const [category, setCategory] = useState("All")
  const [activeCode, setActiveCode] = useState(initialCode || "")
  const [size, setSize] = useState("")
  const [qty, setQty] = useState(1)
  const [cart, setCart] = useState([])
  const [trayOpen, setTrayOpen] = useState(false)
  const [copied, setCopied] = useState("")

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

  const filtered = useMemo(
    () => (category === "All" ? merch : merch.filter((m) => m.category === category)),
    [category]
  )

  const total = cart.reduce((sum, line) => sum + line.price * line.qty, 0)
  const count = cart.reduce((sum, line) => sum + line.qty, 0)

  function openItem(item) {
    setActiveCode(item.code)
    setSize(item.sizes.length === 1 ? item.sizes[0] : "")
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

  return (
    <>
      {/* ---------- design template ---------- */}
      <section className="section-frost" style={{ padding: "44px 0" }}>
        <div className="container shop-template">
          <div className="shop-template-mark">
            <span className="shop-flame"><Icon name="flame" size={20} strokeWidth={2} /></span>
            <span className="shop-wordmark">PURSUE</span>
            <span className="shop-sub">CHRISCO Youth Aflame</span>
          </div>
          <div className="shop-template-copy">
            <span className="eyebrow">The design template</span>
            <h2 className="shop-template-title">One mark, three placements</h2>
            <p className="shop-template-body">
              Every piece carries the PURSUE flame mark from the same artwork. Full chest for tees and hoodies,
              left chest for polos, wrap print for mugs, embroidery for caps.
            </p>
          </div>
          <div className="shop-template-specs">
            {[
              { k: "Ink", v: "Mint on navy, navy on white" },
              { k: "Mark", v: "PURSUE flame, condensed caps" },
              { k: "Finish", v: "Screen print, embroidery, foil" },
            ].map((s) => (
              <div key={s.k} className="shop-spec">
                <span>{s.k}</span>
                <strong>{s.v}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- catalogue ---------- */}
      <section className="section-frost-alt" style={{ padding: "56px 0 84px" }}>
        <div className="container">
          <div className="shop-head">
            <div>
              <span className="eyebrow">Merchandise</span>
              <h2 className="title" style={{ marginTop: 14 }}>
                Wear the <span className="accent">pursuit</span>
              </h2>
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

          <div className="merch-grid">
            {filtered.map((item) => (
              <article key={item.code} className="merch-card">
                <button type="button" className="merch-media" onClick={() => openItem(item)} aria-label={`View ${item.name} (${item.code})`}>
                  <span className="merch-code">{item.code}</span>
                  <Image
                    src={item.img}
                    alt={`${item.name} in ${item.colour} with the PURSUE flame mark`}
                    width={640}
                    height={800}
                    className="merch-img"
                    sizes="(min-width: 1024px) 300px, (min-width: 600px) 45vw, 90vw"
                  />
                  <span className="merch-quick">Choose size &amp; quantity</span>
                </button>
                <div className="merch-body">
                  <div className="merch-row">
                    <h3>{item.name}</h3>
                    <span className="merch-price">{formatPrice(item.price)}</span>
                  </div>
                  <p className="merch-meta">
                    {item.colour} · {item.category}
                  </p>
                  <div className="merch-sizes">
                    {item.sizes.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="shop-note">
            Prices are indicative and confirmed on order. Bulk orders for churches, schools and teams get a
            discount. Order by code, for example <strong>TS-01, M, 2 pieces</strong>.
          </p>
        </div>
      </section>

      {/* ---------- product modal ---------- */}
      {active && (
        <div className="overlay" onClick={closeItem}>
          <div className="shop-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="shop-modal-close" onClick={closeItem} aria-label="Close">
              <Icon name="x" size={18} strokeWidth={2.2} />
            </button>

            <div className="shop-modal-grid">
              <div className="shop-modal-media">
                <Image src={active.img} alt={active.name} width={720} height={900} sizes="(min-width: 900px) 420px, 90vw" className="shop-modal-img" />
                <span className="merch-code">{active.code}</span>
              </div>

              <div className="shop-modal-body">
                <span className="eyebrow" style={{ fontSize: 11 }}>{active.category}</span>
                <h3 className="shop-modal-title">{active.name}</h3>
                <p className="shop-modal-price">{formatPrice(active.price)} <span>· {active.colour}</span></p>
                <p className="shop-modal-desc">{active.desc}</p>

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
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="shop-field">
                  <span className="shop-label">Quantity</span>
                  <div className="shop-qty">
                    <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
                    <span>{qty}</span>
                    <button type="button" onClick={() => setQty(Math.min(99, qty + 1))} aria-label="Increase quantity">+</button>
                    <span className="shop-line-total">{formatPrice(active.price * qty)}</span>
                  </div>
                </div>

                <div className="shop-modal-actions">
                  <button type="button" className="btn btn-green" onClick={addToOrder} disabled={!size} style={{ cursor: size ? "pointer" : "not-allowed", opacity: size ? 1 : 0.55 }}>
                    Add to order
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => shareItem(active)}>
                    <Icon name="send" size={15} /> {copied === active.code ? "Link copied" : "Share"}
                  </button>
                </div>
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
                      <span className="shop-rec-price">{formatPrice(rec.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                      <span className="shop-line-price">{formatPrice(line.price * line.qty)}</span>
                    </li>
                  ))}
                </ul>

                <div className="shop-total">
                  <span>Estimated total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>

                <a
                  className="btn btn-green btn-block"
                  style={{ textDecoration: "none" }}
                  href={`${org.whatsapp}?text=${orderMessage(cart)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="whatsapp" size={16} /> Send order on WhatsApp
                </a>
                <a
                  className="btn btn-outline btn-block"
                  style={{ textDecoration: "none", marginTop: 10 }}
                  href={`mailto:${org.email}?subject=${encodeURIComponent("Merchandise order")}&body=${orderMessage(cart).replace(/%0A/g, "%0D%0A").replace("Hello CHRISCO Youth Aflame, I would like to order:", "Hello CHRISCO Youth Aflame, I would like to order:")}`}
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
