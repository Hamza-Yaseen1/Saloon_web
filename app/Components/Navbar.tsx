'use client'
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";


const links = [
  { label: "Home", href: "/" },
  { label: "Our Team", href: "/team" },
  { label: "Gallery", href: "/gallery" },
  { label: "Price", href: "/#price" },
  { label: "Contact Us", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50  bg-white
">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <a
            href="/"
            className="text-xl font-semibold tracking-tight hover:opacity-90 focus:outline-none  rounded"
          >
            LOGO
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8 text-md font-semibold">
            {links.map((l) => (
              <li key={l.href} className="hover:bg-[#B5AF93] hover:text-white rounded-2xl p-2">
                <a
                  href={l.href}
                  className="rounded px-1 py-1 transition hover:opacity-80 focus:outline-none "
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/40"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={toggle}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile panel */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="mobile-panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="md:hidden overflow-hidden"
            >
              <ul className="flex flex-col gap-2 pb-4 text-base font-medium">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="block rounded-lg px-3 py-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/40"
                      onClick={close}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
