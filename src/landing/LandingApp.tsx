import Hero from "./sections/Hero";
import Problem from "./sections/Problem";
import About from "./sections/About";
import Features from "./sections/Features";
import Team from "./sections/Team";
import FAQ from "./sections/FAQ";
import Waitlist from "./sections/Waitlist";
import Footer from "./sections/Footer";

export default function LandingApp() {
  return (
    <div style={{ background: "var(--lp-bg)", color: "var(--lp-text)" }}>
      <Hero />
      <Problem />
      <About />
      <Features />
      <Team />
      <FAQ />
      <Waitlist />
      <Footer />
    </div>
  );
}
