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
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/30">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <a
            href="/"
            className="text-2xl font-bold tracking-tight hover:opacity-90 focus:outline-none rounded flex items-center"
          >
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Barbar</span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-6 text-base font-medium">
            {links.map((l) => (
              <li key={l.href} className="relative group">
                <a
                  href={l.href}
                  className="rounded-lg px-3 py-2 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {l.label}
                </a>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40 text-foreground"
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
              className="md:hidden overflow-hidden border-t border-border/30 bg-background/90 backdrop-blur-sm"
            >
              <ul className="flex flex-col gap-1 pb-4 pt-2 text-base font-medium">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="block rounded-lg px-3 py-3 hover:bg-accent/50 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 mx-2"
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
