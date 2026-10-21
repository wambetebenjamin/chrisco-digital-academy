"use client"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
import { submitAcademyIntake } from "../lib/intakeClient"
import AutoReplyReceipt from "../components/AutoReplyReceipt"

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
  const [activeCode, setActiveCode] = useState(initialCode || "")
  const [size, setSize] = useState("")
  const [qty, setQty] = useState(1)
  const [cart, setCart] = useState([])
  const [trayOpen, setTrayOpen] = useState(false)
  const [copied, setCopied] = useState("")
  const [sizeGuide, setSizeGuide] = useState(false)
  const [orderName, setOrderName] = useState("")
  const [orderContact, setOrderContact] = useState("")
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderReceipt, setOrderReceipt] = useState(null)

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
    () =>
      merch.filter(
        (m) =>
          (collection === "all" || m.collection === collection) &&
          (category === "All" || m.category === category)
      ),
    [collection, category]
  )

  const totalKes = cart.reduce((sum, line) => sum + priceKsh(line) * line.qty, 0)
  const totalUgx = cart.reduce((sum, line) => sum + priceUgx(line) * line.qty, 0)
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

  return (
    <>
      {/* ---------- catalogue ---------- */}
      <section className="section-frost" style={{ padding: "64px 0 88px" }}>
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

          <div className="shop-wa-strip">
            <div className="shop-wa-copy">
              <span className="shop-wa-ico">
                <Icon name="whatsapp" size={18} />
              </span>
              <p>
                <strong>Order straight on WhatsApp.</strong> Pick a design, note its code, and message us with
                that code. We confirm size, colour, total and delivery in the chat.
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

          <div className="shop-filters-wrap">
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

          <div className="merch-grid">
            {filtered.map((item) => (
              <article key={item.code} className="merch-card">
                <button type="button" className="merch-media" onClick={() => openItem(item)} aria-label={`View ${item.name} (${item.code})`}>
                  <span className="merch-code">{item.code}</span>
                  <Image
                    src={item.img}
                    alt={`${item.name}, ${item.colour} colourway`}
                    width={640}
                    height={800}
                    className="merch-img"
                    sizes="(min-width: 1024px) 300px, (min-width: 600px) 45vw, 90vw"
                  />
                  <span className="merch-view">View &amp; order</span>
                </button>
                <div className="merch-body">
                  <div className="merch-row">
                    <h3>{item.name}</h3>
                  </div>
                  <p className="merch-meta">
                    {item.colour} · {item.category}
                  </p>
                  <div className="merch-price-row">
                    <span className="merch-price">{formatKsh(priceKsh(item))}</span>
                    <span className="merch-price-alt">{formatUgx(priceUgx(item))}</span>
                  </div>
                  <div className="merch-sizes">
                    {item.sizes.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                  <a
                    className="merch-wa"
                    href={`${org.whatsapp}?text=${whatsappInquiry(item, { ref: readMyCode() })}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Message on WhatsApp about ${item.name} (${item.code})`}
                  >
                    <Icon name="whatsapp" size={14} />
                    <span>Message on WhatsApp</span>
                    <em>{item.code}</em>
                  </a>
                </div>
              </article>
            ))}
          </div>

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
                <Image src={active.img} alt={active.name} width={720} height={900} sizes="(min-width: 900px) 420px, 90vw" className="shop-modal-img" />
                <span className="merch-code">{active.code}</span>
              </div>

              <div className="shop-modal-body">
                <span className="eyebrow" style={{ fontSize: 11 }}>{active.category}</span>
                <h3 className="shop-modal-title">{active.name}</h3>
                <p className="shop-modal-price">
                  {formatKsh(priceKsh(active))} <span>· {formatUgx(priceUgx(active))} · {active.colour}</span>
                </p>
                <p className="shop-modal-desc">{active.desc}</p>

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

                <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>
                    Or log your order for an instant confirmation from {org.email}:
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input
                      className="input"
                      placeholder="Your name"
                      value={orderName}
                      onChange={(e) => setOrderName(e.target.value)}
                      style={{ padding: "8px 12px", fontSize: 12.5 }}
                    />
                    <input
                      className="input"
                      placeholder="Email or phone"
                      value={orderContact}
                      onChange={(e) => setOrderContact(e.target.value)}
                      style={{ padding: "8px 12px", fontSize: 12.5 }}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={orderSubmitting || !orderName.trim()}
                    onClick={async () => {
                      setOrderSubmitting(true)
                      const decodedSummary = decodeURIComponent(orderMessage(cart, readMyCode()))
                      const isEmail = orderContact.includes("@")
                      const res = await submitAcademyIntake({
                        action: "merch_order",
                        name: orderName.trim(),
                        email: isEmail ? orderContact.trim() : org.email,
                        phone: !isEmail ? orderContact.trim() : "",
                        message: `${decodedSummary}\nTotal: ${formatKsh(totalKes)} / ${formatUgx(totalUgx)}`,
                        ref: readMyCode() || null,
                      })
                      setOrderReceipt(res?.auto_reply || null)
                      setOrderSubmitting(false)
                    }}
                    className="btn btn-navy btn-sm btn-block"
                    style={{ cursor: orderName.trim() ? "pointer" : "not-allowed", width: "100%" }}
                  >
                    {orderSubmitting ? "Saving Order..." : "Confirm & Receive Email Receipt"}
                  </button>
                  {orderReceipt && <AutoReplyReceipt receipt={orderReceipt} compact />}
                </div>

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
