"use client"

import { motion } from "framer-motion"
import { Scissors, Heart } from "lucide-react"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mt-16 border-t border-border/50 bg-linear-to-t from-muted/40 to-transparent py-8"
    >
      {/* subtle glowing bar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-2/3 bg-linear-to-r from-primary/30 via-primary to-primary/30 blur-sm" />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 text-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Scissors className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            Crafted with <Heart className="inline h-3 w-3 text-rose-500 mx-1" fill="currentColor" /> by{" "}
            <span className="bg-linear-to-r from-primary to-rose-500 bg-clip-text text-transparent font-semibold">
              Hamza
            </span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground/80">
          © {new Date().getFullYear()} All rights reserved. ✂️ Stay sharp.
        </p>
      </div>
    </motion.footer>
  )
}
