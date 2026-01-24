"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type IContact = {
  data: string;
  img: string;
};
type IService = {
  img: string;
  title: string;
};
const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};
const contact: IContact[] = [
  { data: "254 W 27ST ST, NEW YORK, NY 10011", img: "/images/image 2.png" },
  { data: "(212) 123-4567", img: "/images/image 4.png" },
  { data: "341 W 11ST ST, NEW YORK, NY 10022", img: "/images/image 2.png" },
  { data: "(212) 123-4567", img: "/images/image 2.png" },
];

const serv: IService[] = [
  { img: "/images/image 5.png", title: "Regular Haircut" },
  { img: "/images/image 6.png", title: "Men’s Facial" },
  { img: "/images/image 7.png", title: "Royal Shave" },
  { img: "/images/image 8.png", title: "Kids Haircut" },
];

const Hero: React.FC = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative mx-auto mt-9 w-full max-w-6xl px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-1/2 h-1/3 bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-secondary/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="flex flex-col items-center gap-8 p-4 sm:p-6 lg:p-8 lg:flex-row lg:justify-between">
          {/* Left column */}
          <div className="w-full lg:w-1/2">
            <motion.h2
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="p-0 text-2xl sm:text-3xl font-light text-muted-foreground mb-2">Welcome to</motion.h2>

            <h1 className="pt-1 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Barbershop in <br /> Manhattan
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-lg">
              Experience premium grooming services in the heart of New York City
            </p>

            <div className="mt-6 space-y-3 sm:space-y-4">
              {contact.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="relative">
                    <img
                      src={c.img}
                      alt=""
                      className="h-6 w-6 flex-none object-contain sm:h-7 sm:w-7"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full"></div>
                  </div>
                  <p className="text-sm sm:text-base font-medium">{c.data}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4">
              <a href="/#contact">
                <button className="w-full cursor-pointer rounded-xl border-2 border-primary bg-primary text-primary-foreground px-6 py-4 text-base font-semibold transition-all hover:bg-primary/90 hover:shadow-professional hover-lift focus:outline-none focus:ring-2 focus:ring-primary/50">
                  Book Appointment
                </button>
              </a>
              <a href="/gallery">
                <button className="w-full cursor-pointer rounded-xl border-2 border-secondary bg-transparent text-secondary-foreground px-6 py-4 text-base font-semibold transition-all hover:bg-secondary/10 hover:shadow-professional hover-lift focus:outline-none focus:ring-2 focus:ring-secondary/50">
                  View Gallery
                </button>
              </a>
            </div>
          </div>

          {/* Right column (hero image) */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-professional hover-lift transition-all">
              <img
                src="/images/image 1.png"
                alt="Premium Barbershop in Manhattan"
                className="mx-auto h-auto w-full max-w-md object-cover md:max-w-lg"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-overlay"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-medium">Premium Grooming Since 2023</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full blur-xl opacity-30 -z-10"></div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Our Premium Services</h2>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Expert grooming services tailored to your style
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {serv.map((s, i) => (
            <div key={i} className="group flex flex-col items-center text-center bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all hover-lift">
              <div className="relative mb-4">
                <img
                  src={s.img}
                  alt={s.title}
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-sm group-hover:blur-md transition-all"></div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{s.title}</h3>
              <a href="/gallery" className="mt-4">
                <button className="text-sm font-medium text-primary hover:text-secondary transition-colors underline decoration-primary/50 hover:decoration-secondary">
                  Learn More
                </button>
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Hero;
