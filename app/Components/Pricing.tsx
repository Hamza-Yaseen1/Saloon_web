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
    <section
      className={`mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 ${className}`}
      aria-labelledby="pricing-heading"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 id="pricing-heading" className="text-4xl md:text-5xl font-bold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-sm md:text-base text-muted-foreground/80">{subtitle}</p>
        )}

        {/* Toggle details */}
        <button
          type="button"
          onClick={() => setShowDetails((s) => !s)}
          className="group inline-flex items-center gap-2 mt-6 rounded-2xl border px-4 py-2 text-sm font-medium hover:shadow-lg transition-all"
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
      </motion.div>

      {/* Grid */}
      <motion.div
        id="pricing-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
      >
        {[left, right].map((col, colIndex) => (
          <div key={colIndex} className="space-y-4">
            {col.map((row, i) => (
              <motion.article
                key={`${row.service}-${i}`}
                variants={item}
                className="relative overflow-hidden rounded-2xl border bg-white/60 dark:bg-zinc-900/40 backdrop-blur p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow"
                aria-label={`${row.service} card`}
              >
                {/* Row top */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center rounded-xl border p-2"
                      aria-hidden
                    >
                      {row.icon}
                    </span>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold flex items-center gap-2">
                        {row.service}
                        {row.popular && (
                          <span className="text-amber-500 text-xs font-medium px-2 py-0.5 rounded-full border border-amber-300/60 bg-amber-50 dark:bg-amber-500/10">
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
                    <div className="text-xl md:text-2xl font-bold tabular-nums">{row.price}</div>
                    {showDetails && row.duration && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5" aria-hidden />
                        {row.duration}
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="mt-3 border-t border-dashed" />

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
        className="mt-10 text-center text-sm text-muted-foreground/80"
      >
        Need something custom? Get in touch and we’ll tailor a package for you.
      </motion.p>


    </section>

    <section>

    <section className="relative isolate w-full overflow-hidden bg-[url('https://images.unsplash.com/photo-1541769740-0a9c34cfaf17?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
      {/* dark overlay for contrast */}
      <div className="absolute inset-0 bg-neutral-900/60" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 py-16 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:px-8">
        {/* LEFT: decorative shape + image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto h-[420px] w-[420px] sm:h-[460px] sm:w-[460px] lg:h-[480px] lg:w-[480px]"
        >
          {/* Abstract blobs (SVG) */}
          <svg
            className="absolute -left-6 top-4 h-[115%] w-[115%] -rotate-6 text-olive/90"
            viewBox="0 0 600 600"
            fill="currentColor"
            aria-hidden
          >
            <path d="M464.7 292.8c9 81.6-44.7 151.2-116.6 192.1C276.2 525.8 191 538 127.8 492.3 64.5 446.5 23.3 342.9 61.4 259.8c38-83.1 155.5-136.6 252.4-129.5 96.9 7.1 141.9 81 150.9 162.5Z" />
          </svg>
          <svg
            className="absolute -right-4 top-6 h-[110%] w-[110%]  rotate-6 text-stone-300/80"
            viewBox="0 0 600 600"
            fill="currentColor"
            aria-hidden
          >
            <path d="M460 286c0 82.8-43.8 161.5-119.2 196.2-75.4 34.7-174.4 14.3-231-42.5C53.2 383 33.5 299.5 60.8 230.6 88 161.8 162.2 107.7 239.5 92.8 316.9 77.8 397.3 102 440.4 161.6 454.6 181.4 460 233.2 460 286Z" />
          </svg>

          {/* Circular photo */}
          <div className="absolute left-1/2 top-1/2 z-10 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-8 ring-stone-700/50 shadow-2xl">
            <img
              src="/images/Ellipse 2.png"
              alt="Barber shaving a client in an upscale studio"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* RIGHT: text card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10"
        >
          <div className="rounded-[28px] bg-neutral-200/95 p-7 shadow-2xl backdrop-blur md:p-10">
            <h1 className="text-3xl font-extrabold leading-tight text-neutral-900 md:text-4xl">
              Welcome to the
              <br />
              <span className="block text-3xl md:text-5xl">upscale barber studio</span>
            </h1>
            <p className="mt-4 max-w-prose text-neutral-700">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <div className="mt-7">
              <a
                href="#book"
                className="inline-flex hover:bg-[#B5AF93] items-center justify-center rounded-2xl bg-neutral-900 px-6 py-3 text-base font-semibold text-white shadow-lg transition  hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800"
              >
                Book Online
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  
    </section>
    </div>
  );
};

export default Pricing;
