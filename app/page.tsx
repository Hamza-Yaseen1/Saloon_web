import BarbershopInfoSection from "./Components/BarbershopInfoSection";
import Contact from "./Components/Contact";
import HairStyles from "./Components/HairStyles";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar";
import Pricing from "./Components/Pricing";
import Services from "./Components/Services";

export default function Home() {
  return (
    <>
<Navbar/>
<Hero/>
<BarbershopInfoSection />
< Pricing/>
<Services/>
<HairStyles/>
<Contact/>
    </>
  );
}
