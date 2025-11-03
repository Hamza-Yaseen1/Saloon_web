"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Info } from "lucide-react";

// Types
export type IFeature = {
  title: string;
  description?: string;
};

const features: IFeature[] = [
  { title: "Always welcoming environment", description: "Cozy lounge, complimentary drinks, and friendly staff." },
  { title: "Our masters focus on the quality", description: "Senior barbers with 8+ years of experience on average." },
  { title: "We value both the time and the money of our clients", description: "On-time appointments and transparent pricing—no surprises." },
  { title: "We work only with high-quality, hypoallergenic premium products", description: "Top-shelf brands carefully chosen for sensitive skin." },
  { title: "All surfaces and tools are cleaned, disinfected before and after using", description: "Hospital-grade sanitation protocols, every single service." },
];

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const BarbershopInfoSection: React.FC = () => {
  const [expanded] = React.useState(false);
  const visible = expanded ? features : features.slice(0, 3);

  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="relative mt-16 sm:mt-24 lg:mt-28 overflow-hidden text-gray-900"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/image 9.png')" }}
        aria-hidden="true"
      />

      {/* Overlay for better readability */}
      <div
        className="pointer-events-none absolute inset-0 bg-black/40 sm:bg-black/35 lg:bg-black/30"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            id="why-choose-us-heading"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white"
          >
            Why Choose Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-3 text-base sm:text-lg lg:text-xl text-white"
          >
            In addition, here are 5 more reasons why men prefer{" "}
            <span className="font-semibold">Manhattan Barbershop N.Y.C</span>:
          </motion.p>
        </div>

        {/* Feature list & Hours card layout */}
        <div className="mt-8 sm:mt-10 grid gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Features */}
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="lg:col-span-2 space-y-3 sm:space-y-4"
          >
            {visible.map((item, i) => (
              <motion.li
                key={i}
                variants={itemVariants}
                className="group relative list-none rounded-2xl border border-gray-200 bg-white/70 p-4 sm:p-5 shadow-sm backdrop-blur transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-medium leading-relaxed text-sm sm:text-base">{item.title}</p>
                    {item.description && (
                      <p className="mt-1 text-xs sm:text-sm text-gray-600">{item.description}</p>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>

          {/* Hours Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <Card className="shadow-lg rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur">
              <CardHeader className="text-center space-y-1 px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl font-semibold tracking-wide flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                  Working Hours
                </CardTitle>
                <CardDescription className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-1">
                  <Info className="h-4 w-4" aria-hidden="true" />
                  Manage and view your work time easily
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-center px-4 sm:px-6">
                <p className="text-gray-800 text-sm sm:text-base font-medium">
                  Total Hours: <span className="font-semibold">8h</span>
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">Last Updated: Today at 5:00 PM</p>
                <div className="mt-2 rounded-xl bg-gray-100 p-3 sm:p-4 text-xs sm:text-sm text-gray-700">
                  <p className="font-medium">Today’s Schedule</p>
                  <ul className="mt-1 space-y-1">
                    <li>09:00 AM – 01:00 PM</li>
                    <li>02:00 PM – 06:00 PM</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center px-4 sm:px-6 pb-5">
                <Button className="w-full sm:w-auto rounded-xl hover:bg-[#B5AF93]">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <AnimatePresence initial={false}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.35 }}
            className="mt-8 sm:mt-10 flex justify-center"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-2xl px-6 py-5 text-base hover:bg-[#B5AF93]"
            >
              Book an Appointment
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BarbershopInfoSection;
