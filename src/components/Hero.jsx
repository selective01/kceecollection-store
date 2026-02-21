import React from "react";
import { useEffect, useState } from "react";
import "../assets/css/hero.css";

export default function Hero() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero">
      <div className={`hero-left ${fadeIn ? "fade-in" : ""}`}>
        <div className="hero-overlay">
          <h1 className="hero-subtitle">Style is not worn — it is expressed.</h1>
          <h2 className="hero-description">
            For the man who moves with intention and leads with quiet confidence, our pieces are crafted to reflect strength, ambition, and individuality. Every design is made to elevate your presence and speak before you do.
          </h2>
          <p className="hero-tagline">Wear your story. Command your space.</p>

          <a href="#shop" className="hero-btn">Shop Now</a>
        </div>
      </div>

      <div className="hero-right"></div>
    </section>
  );
}
