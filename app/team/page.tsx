"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Users2, Instagram, Facebook, Linkedin, Mail, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * Drop this file at: app/team/page.tsx (App Router) or pages/team.tsx (Pages Router)
 *
 * Features
 *  - Responsive team grid, animated with Framer Motion
 *  - Search by name/role
 *  - Tag filters by role with your preferred show/hide animated toggle
 *  - Member quick view dialog with bio + social links
 *  - shadcn/ui + lucide-react + Tailwind, theme-aware
 *
 * If you don't have some shadcn components yet, add:
 *  npx shadcn@latest add badge button card dialog input
 */

// ---------- Sample Data (replace with your real team) ----------
export type TeamMember = {
  id: string;
  name: string;
  role: "Barber" | "Stylist" | "Reception" | "Manager" | "Colorist" | "Assistant";
  photo: string; // remote URL or /public path
  bio: string;
  tags: string[]; // specialties
  socials?: Partial<{ instagram: string; facebook: string; linkedin: string; email: string; phone: string }>;
};

const TEAM: TeamMember[] = [
  {
    id: "Andrew",
    name: "Andrew",
    role: "Manager",
    photo: "/images/team-1.avif",
    bio: "Salon lead focused on client experience and modern grooming standards.",
    tags: ["Operations", "Customer Care"],
    socials: { instagram: "https://instagram.com/", email: "mailto:hello@example.com" },
  },
  {
    id: "adil",
    name: "Adil Khan",
    role: "Barber",
    photo: "/images/team-2.avif",
    bio: "Skin fades, precision line-ups, and beard sculpting.",
    tags: ["Skin Fade", "Beard"],
    socials: { instagram: "https://instagram.com/" },
  },
  {
    id: "sana",
    name: "Sana",
    role: "Stylist",
    photo: "/images/team-3.avif",
    bio: "Classic to contemporary styles with a focus on healthy hair.",
    tags: ["Wash & Style", "Kids"],
    socials: { instagram: "https://instagram.com/", facebook: "https://facebook.com/" },
  },
  {
    id: "bilal",
    name: "Bilal",
    role: "Barber",
    photo: "/images/team-4.avif",
    bio: "Old-school cuts with modern finishing and hot towel shaves.",
    tags: ["Classic", "Shave"],
  },
  {
    id: "hira",
    name: "Hira",
    role: "Reception",
    photo: "/images/team-6.avif",
    bio: "Scheduling, smiles, and making sure you feel at home.",
    tags: ["Front Desk", "Care"],
  },
  {
    id: "mubashir",
    name: "Mubashir",
    role: "Colorist",
    photo: "/images/team-5.avif",
    bio: "Natural tones, bold blends, and color corrections.",
    tags: ["Color", "Correction"],
  },
];

const ROLES = Array.from(new Set(TEAM.map((m) => m.role)));
const spring = { type: "spring", stiffness: 260, damping: 26, mass: 0.7 } as const;

function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export default function TeamPage() {
  const [query, setQuery] = React.useState("");
  const [activeRoles, setActiveRoles] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<TeamMember | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEAM.filter((m) => {
      const inQuery = !q || [m.name, m.role, ...m.tags].join(" ").toLowerCase().includes(q);
      const inRoles = activeRoles.length === 0 || activeRoles.includes(m.role);
      return inQuery && inRoles;
    });
  }, [query, activeRoles]);

  const toggleRole = (r: string) =>
    setActiveRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const clearAll = () => {
    setQuery("");
    setActiveRoles([]);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight flex items-center gap-2">
            <Users2 className="h-7 w-7 text-primary" /> Our Team
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Meet the people behind the chair — skilled, friendly, and client-first.</p>
        </div>
        <Button variant="secondary" className="rounded-2xl" onClick={clearAll}>Reset</Button>
      </div>

      {/* Controls */}
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-6 lg:col-span-5">
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search team (e.g., fade, beard, kids, manager)"
              className="pl-9"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="md:col-span-6 lg:col-span-7 flex items-center justify-end">
          <Button variant="secondary" className="rounded-2xl mr-2" onClick={() => setShowFilters((v) => !v)}>
            {showFilters ? <X className="mr-2 h-4 w-4" /> : <Filter className="mr-2 h-4 w-4" />}
            {showFilters ? "Hide filters" : "Show filters"}
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
              {ROLES.map((r) => (
                <motion.div key={r} layout transition={spring}>
                  <Badge
                    onClick={() => toggleRole(r)}
                    variant={activeRoles.includes(r) ? "default" : "outline"}
                    className={cn("cursor-pointer select-none px-3 py-1 rounded-2xl", activeRoles.includes(r) && "shadow")}
                  >
                    {r}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <motion.div layout className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={spring}
            >
              <Card className="group overflow-hidden rounded-2xl border-muted/40">
                <CardContent className="p-0">
                  <button
                    onClick={() => { setSelected(m); setOpen(true); }}
                    className="relative block w-full"
                    aria-label={`Open ${m.name} profile`}
                  >
                    <Image
                      src={m.photo}
                      alt={m.name}
                      width={1200}
                      height={900}
                      className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </button>
                  <div className="px-5 py-4">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-base font-semibold tracking-tight">{m.name}</h3>
                      <Badge variant="secondary" className="rounded-2xl">{m.role}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{m.bio}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.tags.map((t) => (
                        <Badge key={t} variant="outline" className="rounded-2xl">{t}</Badge>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      {m.socials?.instagram && (
                        <a href={m.socials.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                      {m.socials?.facebook && (
                        <a href={m.socials.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
                          <Facebook className="h-4 w-4" />
                        </a>
                      )}
                      {m.socials?.linkedin && (
                        <a href={m.socials.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {m.socials?.email && (
                        <a href={m.socials.email} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {m.socials?.phone && (
                        <a href={`tel:${m.socials.phone}`} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Phone">
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                    </div>
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
          <p className="text-sm text-muted-foreground">No team members match. Try a different search or role.</p>
          <Button variant="secondary" className="mt-3 rounded-2xl" onClick={clearAll}>Reset filters</Button>
        </div>
      )}

      {/* Member Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl">{selected?.name}</DialogTitle>
          </DialogHeader>

          {selected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <Image
                src={selected.photo}
                alt={selected.name}
                width={1200}
                height={900}
                className="h-64 w-full object-cover"
                priority
              />
              <div className="px-6 pb-6 pt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-2xl">{selected.role}</Badge>
                  {selected.tags.map((t) => (
                    <Badge key={t} variant="outline" className="rounded-2xl">{t}</Badge>
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{selected.bio}</p>
                <div className="mt-4 flex items-center gap-3">
                  {selected.socials?.instagram && (
                    <a href={selected.socials.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {selected.socials?.facebook && (
                    <a href={selected.socials.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
                      <Facebook className="h-4 w-4" />
                    </a>
                  )}
                  {selected.socials?.linkedin && (
                    <a href={selected.socials.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {selected.socials?.email && (
                    <a href={selected.socials.email} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                  {selected.socials?.phone && (
                    <a href={`tel:${selected.socials.phone}`} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Phone">
                      <Phone className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
