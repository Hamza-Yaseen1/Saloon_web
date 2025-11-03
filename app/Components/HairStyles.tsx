type ICard = { image: string };

const cards: ICard[] = [
  { image: "/images/Rectangle 21.png" },
  { image: "/images/Rectangle 22.png" },
  { image: "/images/Rectangle 23.png" },
];
const cards2: ICard[] = [
  { image: "/images/Rectangle 24.png" },
  { image: "/images/Rectangle 25.png" },
  { image: "/images/Rectangle 26.png" },
];

const Card = ({ src, alt }: { src: string; alt: string }) => (
  <div className="group rounded-2xl shadow-md ring-1 ring-black/5 bg-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <img
      src={src}
      alt={alt}
      className="w-full aspect-auto object-cover"
      loading="lazy"
    />
  </div>
);

const HairStyles = () => {
  return (
    <>
      <section className="w-full">
        {/* Hero */}
        <div className="bg-[#292D33]">
          <div className="max-w-6xl mx-auto px-4 py-20 md:py-24 text-center">
            <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight">
              Experience the Best Haircut<br className="hidden md:block" /> & Shave Services
            </h1>
          </div>

          {/* Row 1 (dark background) */}
          <div className="max-w-6xl mx-auto px-4 pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
              {cards.map((c, i) => (
                <Card key={`top-${i}`} src={c.image} alt={`Hairstyle ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Row 2 (olive background) */}
        <div className="bg-[#9D9570]">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
              {cards2.map((c, i) => (
                <Card key={`bottom-${i}`} src={c.image} alt={`Hairstyle ${i + 4}`} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HairStyles;
