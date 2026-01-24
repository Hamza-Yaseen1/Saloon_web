const services = [
  { title: "Hair Cut", Icon: "/images/image 11.png", description: "Professional haircut with precision and style" },
  { title: "Shaving", Icon: "/images/image 12.png", description: "Classic hot towel shave with premium products" },
  { title: "Beard Trim", Icon: "/images/download 1.png", description: "Expert beard shaping and trimming" },
  { title: "Kids Haircut", Icon: "/images/download 2.png", description: "Specialized cuts for kids in a fun environment" },
];

const Services = () => {
  return (
    <section className="py-16 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Premium Barber Services</h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Our expert barbers provide top-quality grooming services with premium products
          </p>
        </div>

        {/* Layout: larger left image, smaller right cards */}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(300px,400px)_1fr]">
          {/* image card */}
          <div className="rounded-2xl overflow-hidden border border-border/50 shadow-professional hover-lift transition-all">
            <img
              src="/images/Rectangle 15.png"
              alt="Barber at work"
              className="h-full w-full object-cover aspect-video"
            />
          </div>

          {/* services cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map(({ title, Icon, description }, index) => (
              <div
                key={title}
                className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-professional transition-all hover-lift"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all">
                      <img src={Icon} className="w-12 h-12 object-contain" alt={title} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{description}</p>
                  <button className="text-sm font-medium text-primary hover:text-secondary transition-colors underline decoration-primary/50 hover:decoration-secondary">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional services section */}
        <div className="mt-16 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-8 border border-border/30">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Premium Experience</h3>
            <p className="text-muted-foreground mb-6">
              We use only the finest products and traditional techniques to ensure you leave looking and feeling your best.
              Our barbers are trained in the latest trends and classic styles to suit your individual needs.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Premium Products</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span>Expert Barbers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Lifetime Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
