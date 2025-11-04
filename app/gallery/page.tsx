"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Filter, X, ZoomIn, Tag, Shuffle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * Drop this file at: app/gallery/page.tsx (App Router) or pages/gallery.tsx (Pages Router).
 *
 * It uses:
 *  - Tailwind (utility classes + a clean, modern aesthetic)
 *  - shadcn/ui for primitives (Button, Badge, Card, Dialog, Input)
 *  - framer-motion for micro-interactions
 *  - lucide-react icons
 *
 * Notes:
 *  - The Navbar on your site already lists "Gallery". This page will render on /gallery.
 *  - Replace the sample IMAGES array with your own images. Local assets or remote URLs work.
 *  - The design adapts to both light/dark if your theme toggles body class.
 */

// ---------- Sample Data (replace with yours) ----------
const IMAGES: Array<{
  id: string;
  src: string;
  alt: string;
  w: number;
  h: number;
  tags: string[];
}> = [
  {
    id: "cut-1",
    src: "/images/gallary-1.avif",
    alt: "Skin fade close-up",
    w: 1200,
    h: 1600,
    tags: ["Haircut", "Skin Fade", "Classic"],
  },
  {
    id: "cut-2",
    src: "/images/gallary-2.avif",
    alt: "Beard trim detail",
    w: 1600,
    h: 1200,
    tags: ["Beard", "Trim", "Hot Towel"],
  },
  {
    id: "cut-3",
    src: "/images/gallary-3.avif",
    alt: "Kids haircut",
    w: 1200,
    h: 1600,
    tags: ["Kids", "Gentle", "Family"],
  },
  {
    id: "cut-4",
    src: "/images/gallary-4.avif",
    alt: "Royal shave",
    w: 1600,
    h: 1066,
    tags: ["Shave", "Ritual", "Royal"],
  },
  {
    id: "cut-5",
    src: "/images/gallary-5.avif",
    alt: "Wash & style",
    w: 1600,
    h: 1066,
    tags: ["Wash", "Style", "Finish"],
  },
  {
    id: "cut-6",
    src: "/images/gallary-6.avif",
    alt: "Line-up detail",
    w: 1200,
    h: 1600,
    tags: ["Line-Up", "Express", "Detail"],
  },
];

const ALL_TAGS = Array.from(new Set(IMAGES.flatMap((i) => i.tags))).sort();

// ---------- Framer Motion helpers ----------
const spring = { type: "spring", stiffness: 300, damping: 30, mass: 0.8 } as const;

function classNames(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export default function GalleryPage() {
  const [query, setQuery] = React.useState("");
  const [activeTags, setActiveTags] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<typeof IMAGES[number] | null>(null);
  const [showFilters, setShowFilters] = React.useState(true); // user-pref: show/hide toggle animated

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return IMAGES.filter((img) => {
      const inQuery = !q || img.alt.toLowerCase().includes(q);
      const inTags = activeTags.length === 0 || activeTags.every((t) => img.tags.includes(t));
      return inQuery && inTags;
    });
  }, [query, activeTags]);

  const toggleTag = (t: string) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const clearAll = () => {
    setActiveTags([]);
    setQuery("");
  };

  const surprise = () => {
    const sample = IMAGES[Math.floor(Math.random() * IMAGES.length)];
    setSelected(sample);
    setOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Gallery</h1>
          <p className="text-sm text-muted-foreground mt-1">Our recent cuts, shaves, and styles. Real clients. Real results.</p>
        </div>
        <Button variant="default" className="rounded-2xl" onClick={surprise}>
          <Camera className="mr-2 h-4 w-4" />
          Surprise me
        </Button>
      </div>

      {/* Controls */}
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-6 lg:col-span-5">
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search styles (e.g., fade, beard, kids)"
              className="pl-9"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-7 flex items-center justify-end">
          <Button variant="secondary" className="rounded-2xl mr-2" onClick={() => setShowFilters((v) => !v)}>
            {showFilters ? <X className="mr-2 h-4 w-4" /> : <Filter className="mr-2 h-4 w-4" />}
            {showFilters ? "Hide filters" : "Show filters"}
          </Button>
          <Button variant="ghost" className="rounded-2xl" onClick={clearAll}>
            Clear
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            key="filters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-wrap gap-2">
              {ALL_TAGS.map((t) => (
                <motion.div key={t} layout transition={spring}>
                  <Badge
                    variant={activeTags.includes(t) ? "default" : "outline"}
                    className={classNames(
                      "cursor-pointer select-none px-3 py-1 rounded-2xl",
                      activeTags.includes(t) && "shadow"
                    )}
                    onClick={() => toggleTag(t)}
                  >
                    <Tag className="mr-1 h-3 w-3" /> {t}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <motion.div
        layout
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence>
          {filtered.map((img) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={spring}
            >
              <Card className="group overflow-hidden rounded-2xl border-muted/40">
                <CardContent className="p-0">
                  <button
                    className="relative block w-full"
                    onClick={() => { setSelected(img); setOpen(true); }}
                    aria-label={`Open ${img.alt}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.w}
                      height={img.h}
                      className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <ZoomIn className="h-4 w-4" />
                      Preview
                    </div>
                  </button>
                  <div className="px-4 py-3 flex flex-wrap gap-2">
                    {img.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="rounded-2xl">{t}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">No results. Try removing some filters.</p>
          <Button variant="secondary" className="mt-3 rounded-2xl" onClick={clearAll}>
            Reset filters
          </Button>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Camera className="h-5 w-5" />
              {selected?.alt ?? "Preview"}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Image
                src={selected.src}
                alt={selected.alt}
                width={selected.w}
                height={selected.h}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="px-6 pb-6 pt-3 flex flex-wrap gap-2">
                {selected.tags.map((t) => (
                  <Badge key={t} variant="outline" className="rounded-2xl">{t}</Badge>
                ))}
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Tiny inline icon (to avoid extra import just for search)
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
      <path d="M21 21l-4.3-4.3m1.3-5.4a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
