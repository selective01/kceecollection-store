import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/hero.css";

const THUMBNAILS = [
  { src: "/My_Collections/Background_images/Hoodie.jpg", href: "/hoodies", label: "Hoodies" },
  { src: "/My_Collections/Background_images/Joggers.jpg", href: "/joggers", label: "Joggers" },
  { src: "/My_Collections/Background_images/Sneakers.jpg", href: "/sneakers", label: "Sneakers" },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [activeThumb, setActiveThumb] = useState(1);
  const [activeSize, setActiveSize] = useState("XXL");

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hero-fashion">
      <div className="hero-fashion-overlay" />

      <div className="hero-fashion-shell">
        

        <div className={`hero-fashion-content ${visible ? "hero-fashion-visible" : ""}`}>
          <div className="hero-fashion-left">
            <p className="hero-fashion-year">@2026</p>

            <h1 className="hero-fashion-heading">
              <span>STYLE IS</span>
              <span className="indent">NOT WORN</span>
              <span>IT IS</span>
              <span>EXPRESSED.</span>
            </h1>

            <p className="hero-fashion-description">
              For the man who moves with intention and leads with quiet confidence,
              our pieces are crafted to reflect strength, ambition, and individuality.
              Every design is made to elevate your presence and speak before you do.
            </p>

            <p className="hero-fashion-tagline">
              Wear your story. Command your space.
            </p>

            <Link to="/shop" className="hero-fashion-btn">
              Shop Now <span>→</span>
            </Link>

            <div className="hero-fashion-bottom">
              <div className="hero-fashion-thumbs">
                {THUMBNAILS.map((item, i) => (
                  <Link
                    key={i}
                    to={item.href}
                    className={`hero-fashion-thumb ${activeThumb === i ? "active" : ""}`}
                    onClick={() => setActiveThumb(i)}
                    aria-label={item.label}
                  >
                    <img src={item.src} alt={item.label} loading="lazy" />
                  </Link>
                ))}
              </div>

              <div className="hero-fashion-sizes">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`hero-fashion-size ${activeSize === size ? "active" : ""}`}
                    onClick={() => setActiveSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <p className="hero-fashion-note">
                Crafted for the man who moves with intention —
                every piece built to elevate your presence.
              </p>
            </div>
          </div>

          <div className="hero-fashion-right">
            <span className="hero-fashion-accent">STYLED FOR LIFE</span>
            <div className="hero-fashion-line" />
          </div>
        </div>
      </div>
    </section>
  );
}