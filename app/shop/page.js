"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import emailjs from "@emailjs/browser"
import Navbar from "../Navbar"
import Footer from "../components/Footer"
import Chatbot from "../Chatbot"
import PageBackdrop from "../components/PageBackdrop"
import PhotoBand from "../components/PhotoBand"
import Icon from "../components/Icon"
import { useGamification } from "../GamificationContext"

const SERVICE_ID = "service_m86zbad"
const TEMPLATE_ID = "template_i5wg4c8"
const PUBLIC_KEY = "eVsfqNv-Jtq46-4b2"
const SHOP_EMAIL = "chriscoyouthaflame2025@gmail.com"
const WHATSAPP = "+254112272061"

const categories = ["All", "Apparel", "Books", "Accessories"]

const products = [
  {
    id: "tshirt-logo",
    name: "CHRISCO Logo Tee",
    price: "KSh 1,200",
    category: "Apparel",
    color: "lime",
    tag: "Bestseller",
    desc: "Heavyweight cotton tee in black with the signature electric lime CHRISCO wordmark. Unisex fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    img: "/images/merch-tshirt.jpg",
  },
  {
    id: "hoodie-youth",
    name: "Digital Youth Hoodie",
    price: "KSh 2,800",
    category: "Apparel",
    color: "pink",
    tag: "New",
    desc: "Heavy blend pullover hoodie in hot pink with purple chest print. Kangaroo pocket, drawstring hood.",
    sizes: ["S", "M", "L", "XL"],
    img: "/images/merch-hoodie.jpg",
  },
  {
    id: "cap-c",
    name: "C Logo Snapback",
    price: "KSh 950",
    category: "Apparel",
    color: "yellow",
    desc: "Structured 6 panel snapback in black with embroidered lime C logo. Adjustable.",
    sizes: ["One Size"],
    img: "/images/merch-cap.jpg",
  },
  {
    id: "tote-skills",
    name: "Skills Pay Tote",
    price: "KSh 700",
    category: "Accessories",
    color: "purple",
    desc: "Thick 100% cotton canvas tote in natural cream. Bold Skills Pay graphic on both sides.",
    sizes: ["One Size"],
    img: "/images/merch-tote.jpg",
  },
  {
    id: "books-starter",
    name: "Digital Skills Starter Book",
    price: "KSh 850",
    category: "Books",
    color: "yellow",
    tag: "Study",
    desc: "A4 printed study guide covering freelancing basics, AI prompts and design checklists. 64 pages.",
    sizes: ["Printed"],
    img: "/images/merch-books.jpg",
  },
  {
    id: "stickers-pack",
    name: "CHRISCO Sticker Pack",
    price: "KSh 300",
    category: "Accessories",
    color: "lime",
    desc: "12 die-cut vinyl stickers: bolts, flames, C logos and motivational quotes. Laptop and water bottle safe.",
    sizes: ["One Pack"],
    img: "/images/merch-stickers.jpg",
  },
]

export default function Shop() {
  const gam = useGamification()
  const [cat, setCat] = useState("All")
  const [selected, setSelected] = useState(null)
  const [size, setSize] = useState("")
  const [qty, setQty] = useState(1)
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState("")

  const filtered = cat === "All" ? products : products.filter((p) => p.category === cat)

  function openProduct(p) {
    setSelected(p)
    setSize(p.sizes[0])
    setQty(1)
    setSent(false)
    setErr("")
  }

  async function handleOrder(e) {
    e.preventDefault()
    if (!form.name || !form.phone) {
      setErr("Please fill in your name and phone/WhatsApp number.")
      return
    }
    setSending(true)
    setErr("")
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: form.name,
        from_email: form.email || SHOP_EMAIL,
        phone: form.phone,
        message:
          `CHRISCO Shop Order:\n` +
          `Item: ${selected.name}\n` +
          `Size: ${size}\n` +
          `Quantity: ${qty}\n` +
          `Price: ${selected.price}\n` +
          `Delivery location: ${form.location || "Not specified"}\n` +
          `Contact: ${form.phone} / ${form.email || "no email"}`,
      }, PUBLIC_KEY)
      setSent(true)
      gam.awardXP(25, "for ordering merch")
      gam.touchActivity()
    } catch {
      setErr("Order failed to send. Please WhatsApp us directly at +254 112 272 061.")
    }
    setSending(false)
  }

  return (
    <main className="has-backdrop" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <PageBackdrop image="/images/bg-cta.jpg" position="center 35%" />
      <Navbar />

      {/* HERO */}
      <section style={{ padding: "170px 0 80px", position: "relative" }}>
        <div className="container">
          <span className="eyebrow pink fade-up">CHRISCO Shop</span>
          <h1 className="display fade-up fade-up-1" style={{ marginTop: 22, maxWidth: 960 }}>
            Rep the <span className="marker pink">movement.</span>
          </h1>
          <p className="lead fade-up fade-up-2" style={{ maxWidth: 640, marginTop: 22, fontSize: "1.1rem" }}>
            Tees, hoodies, study books, stickers and more. All designed by CHRISCO youth, Nairobi made.
            Every order supports our free skills training for teens.
          </p>
          <div className="fade-up fade-up-3" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
            <a href="#products" className="btn btn-lime btn-lg" style={{ textDecoration: "none" }}>
              <Icon name="rocket" size={18} /> Browse Products
            </a>
            <a
              href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi CHRISCO, I'd like to order merch.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-purple btn-lg"
              style={{ textDecoration: "none" }}
            >
              <Icon name="whatsapp" size={18} /> Order via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee marquee-purple">
        <div className="marquee-track">
          {[0, 1].map((d) => (
            <div key={d} style={{ display: "flex" }} aria-hidden={d === 1}>
              {["Nairobi Made", "Designed by Youth", "Free Delivery within CBD", "Wear the Movement", "Skills Pay", "CHRISCO Youth Aflame"].map((t, i) => (
                <span key={`${d}-${i}`} className="marquee-item">
                  {t} <span className="dot" style={{ width: 8, height: 8, background: "var(--lime)", borderRadius: "50%", display: "inline-block", border: "2px solid #fff" }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section id="products" className="section band-cream">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14, marginBottom: 28 }}>
            <div>
              <span className="eyebrow">Merch</span>
              <h2 className="title" style={{ marginTop: 16 }}>The collection.</h2>
            </div>
            <span className="xp-chip">
              <Icon name="trophy" size={12} /> +25 XP per order
            </span>
          </div>

          {/* Categories */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="pill"
                style={{
                  background: cat === c ? "var(--ink)" : "#fff",
                  color: cat === c ? "var(--lime)" : "var(--ink)",
                  borderColor: "var(--ink)",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="product-grid" style={{ display: "grid", gap: 22, gridTemplateColumns: "1fr" }}>
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className={`card card-hover ${p.color}`}
                style={{ overflow: "hidden", padding: 0, cursor: "pointer", display: "flex", flexDirection: "column" }}
                onClick={() => openProduct(p)}
              >
                <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", borderBottom: "3px solid var(--ink)", background: "#fff" }}>
                  <Image src={p.img} alt={p.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 600px) 45vw, 92vw" style={{ objectFit: "cover" }} />
                  {p.tag && (
                    <span className="sticker ink" style={{ position: "absolute", top: 12, right: 12, fontSize: 10 }}>{p.tag}</span>
                  )}
                </div>
                <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.8 }}>{p.category}</span>
                  <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.2rem", lineHeight: 1.15 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, flex: 1 }}>{p.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", lineHeight: 1 }}>{p.price}</span>
                    <span className="btn btn-ink btn-sm" style={{ fontSize: 12, pointerEvents: "none" }}>
                      <Icon name="plus" size={12} /> View
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO ORDER */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 48px" }}>
            <span className="eyebrow purple">How it works</span>
            <h2 className="title" style={{ marginTop: 16 }}>
              Order in <span className="marker purple">3 quick steps.</span>
            </h2>
          </div>
          <div className="grid-3">
            {[
              { n: "01", icon: "tshirt", title: "Pick your item", desc: "Browse the collection and click the product you love. Pick your size and quantity." },
              { n: "02", icon: "send", title: "Send the order", desc: "Fill in your details. We confirm on WhatsApp within minutes and arrange M-Pesa payment." },
              { n: "03", icon: "pin", title: "Collect or delivery", desc: "Pick up in Nairobi CBD or get same day delivery within town. Countrywide delivery available." },
            ].map((s, i) => (
              <div key={i} className={`card ${["lime", "pink", "yellow"][i]}`} style={{ padding: "28px 24px", position: "relative" }}>
                <div className="ghost-num" style={{ fontSize: "3rem" }}>{s.n}</div>
                <span style={{ display: "inline-flex", width: 54, height: 54, borderRadius: 16, background: "var(--ink)", color: "var(--lime)", alignItems: "center", justifyContent: "center", border: "2.5px solid var(--ink)", marginBottom: 16 }}>
                  <Icon name={s.icon} size={24} />
                </span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PhotoBand
        eyebrow="Support the mission"
        title="Every purchase funds free youth training."
        body="Rock the merch, rep the movement, and help another young person learn a skill that pays."
        tone="lime"
        centered
      >
        <a href="#products" className="btn btn-ink btn-lg" style={{ textDecoration: "none" }}>
          <Icon name="rocket" size={18} /> Shop Now
        </a>
        <a
          href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi CHRISCO, I'd like to place a merch order.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-purple btn-lg"
          style={{ textDecoration: "none" }}
        >
          <Icon name="whatsapp" size={18} /> WhatsApp Order
        </a>
      </PhotoBand>

      <Footer />
      <Chatbot />

      {/* PRODUCT MODAL */}
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680, padding: 0, overflow: "hidden" }}>
            <div style={{ position: "relative", aspectRatio: "16/10", borderBottom: "3px solid var(--ink)", background: "#fff", overflow: "hidden" }}>
              <Image src={selected.img} alt={selected.name} fill sizes="(min-width: 680px) 680px, 94vw" style={{ objectFit: "cover" }} />
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                style={{
                  position: "absolute", top: 14, right: 14,
                  width: 38, height: 38, borderRadius: 12,
                  background: "#fff", border: "2.5px solid var(--ink)",
                  color: "var(--ink)", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "3px 3px 0 0 var(--ink)",
                }}
              >
                <Icon name="x" size={16} />
              </button>
              {selected.tag && (
                <span className="sticker ink" style={{ position: "absolute", top: 14, left: 14, fontSize: 10 }}>{selected.tag}</span>
              )}
            </div>

            <div style={{ padding: 28 }}>
              {!sent ? (
                <form onSubmit={handleOrder}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>{selected.category}</span>
                      <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(1.4rem,3vw,1.8rem)", marginTop: 4 }}>{selected.name}</h2>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", lineHeight: 1 }}>{selected.price}</div>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted)", marginBottom: 18 }}>{selected.desc}</p>

                  {/* Size picker */}
                  <div className="field">
                    <label>Size / Option</label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {selected.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className="pill"
                          style={{
                            background: size === s ? "var(--ink)" : "#fff",
                            color: size === s ? "var(--lime)" : "var(--ink)",
                            cursor: "pointer",
                            fontWeight: 800,
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label>Quantity</label>
                    <div style={{ display: "inline-flex", gap: 0, border: "2.5px solid var(--ink)", borderRadius: 12, overflow: "hidden", boxShadow: "3px 3px 0 0 var(--ink)" }}>
                      <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 42, height: 42, background: "var(--paper-2)", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 18 }}>-</button>
                      <span style={{ width: 54, height: 42, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#fff", fontWeight: 800, fontFamily: "var(--font-head)" }}>{qty}</span>
                      <button type="button" onClick={() => setQty(Math.min(20, qty + 1))} style={{ width: 42, height: 42, background: "var(--lime)", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 18 }}>+</button>
                    </div>
                  </div>

                  <div className="field">
                    <label>Your name</label>
                    <input className="input" placeholder="e.g. Amani Mwangi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Phone / WhatsApp</label>
                    <input className="input" placeholder="+254 7xx xxx xxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div className="field">
                      <label>Email (optional)</label>
                      <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="field">
                      <label>Delivery location</label>
                      <input className="input" placeholder="e.g. Nairobi CBD" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    </div>
                  </div>

                  {err && (
                    <div className="card pink" style={{ padding: "12px 14px", marginBottom: 14, fontSize: 13 }}>{err}</div>
                  )}

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button type="submit" disabled={sending} className="btn btn-lime" style={{ flex: 1, cursor: "pointer" }}>
                      <Icon name="send" size={14} /> {sending ? "Sending..." : "Place Order"}
                    </button>
                    <a
                      href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi CHRISCO, I'd like to order: ${selected.name} (${size}) x${qty}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-purple"
                      style={{ textDecoration: "none" }}
                    >
                      <Icon name="whatsapp" size={14} /> WhatsApp
                    </a>
                    <button type="button" onClick={() => setSelected(null)} className="btn" style={{ cursor: "pointer" }}>
                      Close
                    </button>
                  </div>
                </form>
              ) : (
                <div className="card lime" style={{ textAlign: "center", padding: "36px 24px" }}>
                  <span style={{ display: "inline-flex", width: 72, height: 72, borderRadius: 22, background: "#fff", color: "var(--ink)", alignItems: "center", justifyContent: "center", marginBottom: 14, border: "3px solid var(--ink)", boxShadow: "4px 4px 0 0 var(--ink)" }}>
                    <Icon name="checkCircle" size={38} strokeWidth={1.6} />
                  </span>
                  <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.4rem", fontWeight: 800, color: "var(--ink)", marginBottom: 8 }}>Order sent!</h3>
                  <p style={{ color: "var(--ink)", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                    Asante sana. The CHRISCO team will WhatsApp you shortly to confirm your order, arrange payment and delivery. You earned <strong>+25 XP</strong>.
                  </p>
                  <button onClick={() => setSelected(null)} className="btn btn-ink" style={{ cursor: "pointer" }}>
                    Keep Browsing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 768px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1100px) {
          .product-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </main>
  )
}
