"use client";
import React from "react";

type IContact = {
  data: string;
  img: string;
};
type IService = {
  img: string;
  title: string;
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
      <section className="mx-auto mt-9 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 p-4 sm:p-6 lg:p-8 lg:flex-row lg:justify-between">
          {/* Left column */}
          <div className="w-full lg:w-1/2">
            <h2 className="p-0 text-3xl font-semibold sm:text-4xl">Welcome to</h2>
            <h1 className="pt-2 text-4xl font-bold tracking-wider sm:text-5xl lg:text-6xl lg:leading-tight">
              Barbershop in <br /> Manhattan NEW YORK
            </h1>

            <div className="mt-4 space-y-3 sm:space-y-4">
              {contact.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-2">
                  <img
                    src={c.img}
                    alt=""
                    className="h-6 w-6 flex-none object-contain sm:h-7 sm:w-7"
                    loading="lazy"
                  />
                  <p className="text-sm sm:text-base">{c.data}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-6">
              <button className="w-full cursor-pointer rounded-2xl border bg-black px-4 py-3 text-white transition hover:bg-white hover:text-black sm:w-auto">
                Book Online
              </button>
            </div>
          </div>

          {/* Right column (hero image) */}
          <div className="w-full lg:w-1/2">
            <img
              src="/images/image 1.png"
              alt="Barbershop in Manhattan"
              className="mx-auto h-auto w-full max-w-md object-contain md:max-w-lg"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto mt-12 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {serv.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <img
                src={s.img}
                alt={s.title}
                className="h-auto w-full max-w-[180px] object-contain"
                loading="lazy"
              />
              <h3 className="mt-3 text-sm font-semibold sm:text-base">{s.title}</h3>
              <button className="mt-4 cursor-pointer rounded-2xl border bg-black px-6 py-2 text-sm text-white transition hover:bg-white hover:text-black sm:px-10">
                More
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Hero;
