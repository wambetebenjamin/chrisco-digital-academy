"use client"
import { useState } from "react"
import Link from "next/link"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-purple-950 text-white px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
      <h1 className="text-xl font-bold text-yellow-400 tracking-wide">
        CHRISCO <span className="text-white">Digital Academy</span>
      </h1>
      <ul className="hidden md:flex gap-8 text-sm font-semibold items-center">
        <li><Link href="/" className="hover:text-yellow-400 transition">Home</Link></li>
        <li><Link href="/about" className="hover:text-yellow-400 transition">About</Link></li>
        <li><Link href="/courses" className="hover:text-yellow-400 transition">Courses</Link></li>
        <li><Link href="/contact" className="hover:text-yellow-400 transition">Contact</Link></li>
        <li>
          <Link href="/sign-in" className="bg-yellow-400 text-purple-950 font-black px-5 py-2 rounded-full hover:bg-yellow-300 transition">
            Login
          </Link>
        </li>
      </ul>
      <button className="md:hidden text-yellow-400 text-2xl" onClick={() => setOpen(!open)}>☰</button>
      {open && (
        <ul className="absolute top-16 left-0 w-full bg-purple-950 flex flex-col gap-4 px-8 py-6 text-sm font-semibold md:hidden">
          <li><Link href="/" onClick={() => setOpen(false)} className="hover:text-yellow-400">Home</Link></li>
          <li><Link href="/about" onClick={() => setOpen(false)} className="hover:text-yellow-400">About</Link></li>
          <li><Link href="/courses" onClick={() => setOpen(false)} className="hover:text-yellow-400">Courses</Link></li>
          <li><Link href="/contact" onClick={() => setOpen(false)} className="hover:text-yellow-400">Contact</Link></li>
          <li><Link href="/sign-in" onClick={() => setOpen(false)} className="bg-yellow-400 text-purple-950 font-black px-5 py-2 rounded-full">Login</Link></li>
        </ul>
      )}
    </nav>
  )
}