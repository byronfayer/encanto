import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Catalog from "./components/Catalog";
import ValueBanner from "./components/ValueBanner";
import About from "./components/About";
import Instagram from "./components/Instagram";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./layout.css";

export default function App() {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categories onSelect={setActiveCategory} />
        <Catalog activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <ValueBanner />
        <About />
        <Instagram />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
