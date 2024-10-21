import { About } from "../components/About";
import { Cta } from "../components/Cta";
import { FAQ } from "../components/FAQ";
import { Features } from "../components/Features";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { Pricing } from "../components/Pricing";
import { ScrollToTop } from "../components/ScrollToTop";
import { Services } from "../components/Services";
// import { Team } from "../components/Team";
import "../App.css";

function App() {
  return (
    <>
      <Hero />
      <hr className="w-11/12 mx-auto" />
      <About />
      <hr className="w-11/12 mx-auto" />
      <HowItWorks />
      <hr className="w-11/12 mx-auto" />
      <Features />
      <hr className="w-11/12 mx-auto" />
      <Services />
      <hr className="w-11/12 mx-auto" />
      <Cta />
      <hr className="w-11/12 mx-auto" />
      {/* <Team />
      <hr className="w-11/12 mx-auto" /> */}
      <Pricing />
      <hr className="w-11/12 mx-auto" />
      <FAQ />
      <hr className="w-11/12 mx-auto" />
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;
