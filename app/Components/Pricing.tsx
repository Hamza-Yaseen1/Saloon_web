"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants, Transition } from "framer-motion";
import {
  Scissors,
  Sparkles,
  Brush,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ---------------------------------- Types --------------------------------- */
type IPrice = {
  service: string;
  price: string;
  description?: string;
  duration?: string;
  popular?: boolean;
  icon?: React.ReactNode;
};

type PricingProps = {
  title?: string;
  subtitle?: string;
  items?: IPrice[];
  defaultShowDetails?: boolean;
  className?: string;
};

/* ---------------------------------- Data ---------------------------------- */
const defaultPrices: IPrice[] = [
  {
    service: "Regular Haircut",
    price: "$34+",
    description: "Classic clipper & scissor cut with clean finish.",
    duration: "30–40 min",
    popular: true,
    icon: <Scissors className="w-5 h-5" aria-hidden />,
  },
  {
    service: "Skin Fade",
    price: "$42+",
    description: "High/low skin fade with detailed blending.",
    duration: "45–55 min",
    icon: <Brush className="w-5 h-5" aria-hidden />,
  },
  {
    service: "Beard Trim & Shape",
    price: "$18+",
    description: "Line-up, shape, and conditioning finish.",
    duration: "15–20 min",
    icon: <Sparkles className="w-5 h-5" aria-hidden />,
  },
  {
    service: "Kids Cut (Under 12)",
    price: "$28+",
    description: "Gentle, patient cut for little legends.",
    duration: "25–35 min",
    icon: <Star className="w-5 h-5" aria-hidden />,
  },
  {
    service: "Wash & Style",
    price: "$16+",
    description: "Shampoo, scalp refresh, and blow-dry style.",
    duration: "10–15 min",
    icon: <Sparkles className="w-5 h-5" aria-hidden />,
  },
  {
    service: "Express Line-Up",
    price: "$12+",
    description: "Neck, edges, and quick tidy-up.",
    duration: "10–12 min",
    icon: <Clock className="w-5 h-5" aria-hidden />,
  },
];

/* --------------------------- Animation Variants ---------------------------- */
const container: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const spring: Transition = { type: "spring", stiffness: 280, damping: 22 };

const item: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring,
  },
};

/* --------------------------------- Helpers -------------------------------- */
function splitInTwo<T>(arr: T[]): [T[], T[]] {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

/* -------------------------------- Component -------------------------------- */
const Pricing: React.FC<PricingProps> = ({
  title = "Our Pricing",
  subtitle = "Transparent rates. Premium service. No surprises.",
  items = defaultPrices,
  defaultShowDetails = true,
  className = "",
}) => {
  const [left, right] = splitInTwo(items);
  const [showDetails, setShowDetails] = React.useState(defaultShowDetails);

  return (
    <div id="price">
      {/* Main Pricing Section */}
      <section
        className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 ${className}`}
        aria-labelledby="pricing-heading"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 id="pricing-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          )}
        </motion.div>

        {/* Toggle details */}
        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={() => setShowDetails((s) => !s)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-expanded={showDetails}
            aria-controls="pricing-grid"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-4 h-4" aria-hidden /> Hide details
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" aria-hidden /> Show details
              </>
            )}
          </button>
        </div>

        {/* Grid */}
        <motion.div
          id="pricing-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          {[left, right].map((col, colIndex) => (
            <div key={colIndex} className="space-y-4">
              {col.map((row, i) => (
                <motion.article
                  key={`${row.service}-${i}`}
                  variants={item}
                  className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-professional transition-all hover-lift group"
                  aria-label={`${row.service} card`}
                >
                  {/* Row top */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center rounded-xl border border-border bg-muted p-3 group-hover:bg-primary/10 transition-colors">
                        <span className="text-primary">
                          {row.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-foreground flex items-center gap-2">
                          {row.service}
                          {row.popular && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                              Popular
                            </span>
                          )}
                        </h3>

                        <AnimatePresence initial={false} mode="wait">
                          {showDetails && row.description && (
                            <motion.p
                              key="desc"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="text-sm text-muted-foreground mt-1"
                            >
                              {row.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl md:text-2xl font-bold text-foreground">{row.price}</div>
                      {showDetails && row.duration && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                          <Clock className="w-3.5 h-3.5" aria-hidden />
                          {row.duration}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mt-4 border-t border-border/50" />

                  {/* Microcopy */}
                  {showDetails && (
                    <p className="mt-3 text-xs text-muted-foreground/80">
                      Prices may vary by hair length & stylist experience.
                    </p>
                  )}
                </motion.article>
              ))}
            </div>
          ))}
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          Need something custom? Get in touch and we'll tailor a package for you.
        </motion.p>
      </section>

      {/* Upscale Barber Studio Section */}
      <section className="relative isolate w-full overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 py-16 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:px-8">
          {/* LEFT: circular photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-professional">
              <img
                src="/images/Ellipse 2.png"
                alt="Barber shaving a client in an upscale studio"
                className="h-full w-full object-cover aspect-square"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-overlay"></div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full blur-xl opacity-30 -z-10"></div>
          </motion.div>

          {/* RIGHT: text card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative z-10"
          >
            <div className="rounded-3xl bg-card p-8 border border-border/50 shadow-professional">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Experience the
                <span className="block text-3xl md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Upscale Barber Studio
                </span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Discover premium grooming services in a sophisticated environment.
                Our expert barbers use only the finest products and traditional techniques
                to ensure you leave looking and feeling your best.
              </p>

              <div className="mt-6">
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-primary bg-primary text-primary-foreground px-6 py-3 text-base font-semibold transition-all hover:bg-primary/90 hover:shadow-professional hover-lift focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Book Appointment
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
