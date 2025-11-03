const services = [
  { title: "Hair Cut", Icon: "/images/image 11.png" },
  { title: "Shaving", Icon: "/images/image 12.png" },
  { title: "Beard Trim", Icon: "/images/download 1.png" },
  { title: "Kids Haircut", Icon: "/images/download 2.png" },
];

const Services = () => {
  return (
    <section className="bg-[#292D33]">  
    <div className="max-w-6xl mx-auto px-1 py-10 ">
      <h1 className="text-3xl md:text-4xl text-center font-bold text-white">Barber Shop Services</h1>

      {/* Layout: larger left image, smaller right cards */}
      <div className="mt-8 grid items-start gap-8 md:grid-cols-[minmax(300px,350px)_1fr]">
        {/* image card */}
        <div className="rounded-2xl overflow-hidden border bg-neutral-900/5 shadow-md">
          <img
            src="/images/Rectangle 15.png"
            alt="Barber at work"
            className="h-full w-full object-cover aspect-3/4"
          />
        </div>

        {/* services cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map(({ title, Icon }) => (
            <div
              key={title}
              className="rounded-3xl border bg-gray-200/80 p-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center">
                <div className="h-36 w-28 flex items-center justify-center ">
                  <img src={Icon} className="opacity-80 w-20 h-20" alt={title} />
                </div>
                <h2 className="text-lg text-center font-semibold mt-3">{title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </section>
  );
};

export default Services;
