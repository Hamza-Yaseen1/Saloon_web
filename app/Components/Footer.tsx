"use client"

import { motion } from "framer-motion"
import { Scissors, Heart } from "lucide-react"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mt-16 border-t border-border/30 bg-gradient-to-t from-background to-muted/20 py-12"
    >
      {/* Subtle decorative element */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <Scissors className="mr-2 h-5 w-5 text-primary" />
              Barbar
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Premium barber services in the heart of Manhattan. Crafting timeless looks with traditional techniques.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Hours</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Mon-Fri</span>
                <span>9AM - 8PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sat</span>
                <span>8AM - 9PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sun</span>
                <span>10AM - 6PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Contact</h4>
            <address className="not-italic text-sm text-muted-foreground">
              <p className="mb-1">254 W 27th St</p>
              <p className="mb-1">New York, NY 10001</p>
              <p>(212) 123-4567</p>
            </address>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Scissors className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">
              Crafted with <Heart className="inline h-3 w-3 text-primary mx-1" fill="currentColor" /> by{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">
                Hamza
              </span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground/80">
            © {new Date().getFullYear()} Barbar Barbershop. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
