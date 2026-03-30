import { useState, useEffect, useRef } from "react";
import "../assets/css/testimonial.css";
import Avartar1 from "../assets/My_Collections/Avartars/Avartar (1).jpg";
import Avartar2 from "../assets/My_Collections/Avartars/Avartar (2).jpg";
import Avartar3 from "../assets/My_Collections/Avartars/Avartar (3).jpg";
import Avartar4 from "../assets/My_Collections/Avartars/Avartar (4).jpg";
import Avartar5 from "../assets/My_Collections/Avartars/Avartar (5).jpg";
import Avartar6 from "../assets/My_Collections/Avartars/Avartar (6).jpg";

const testimonials = [
  {
    name: "Tendai Moyo",
    message: "From ordering to delivery, the experience was smooth. The attention to detail in the packaging really stood out.",
    location: "Harare, Zimbabwe",
    image: Avartar1,
    rating: 5,
  },
  {
    name: "Kwame Mensah",
    message: "I was honestly impressed. The quality is premium, and everything looked exactly like the pictures. You've gained a loyal customer.",
    location: "Accra, Ghana",
    image: Avartar2,
    rating: 5,
  },
  {
    name: "Chinedu Okafor",
    message: "Top-tier service! The fit was perfect and the material feels durable. I'll definitely be recommending Kcee_Collection.",
    location: "Lagos, Nigeria",
    image: Avartar3,
    rating: 5,
  },
  {
    name: "Zainab Abubakar",
    message: "Absolutely beautiful! The quality exceeded my expectations and the customer support was very responsive.",
    location: "Dakar, Senegal",
    image: Avartar5,
    rating: 5,
  },
  {
    name: "Abdulrahman Bello",
    message: "Excellent craftsmanship and fast delivery. It's rare to find this level of consistency.",
    location: "Abuja, Nigeria",
    image: Avartar4,
    rating: 5,
  },
  {
    name: "Amina Diallo",
    message: "I love how classy and well-finished everything looks. You can tell care goes into every order.",
    location: "Kano, Nigeria",
    image: Avartar6,
    rating: 5,
  },
  {
    name: "Fatima Nkosi",
    message: "I ordered a dress for a special occasion and it arrived on time, fit perfectly, and looked stunning. Couldn't be happier!",
    location: "Johannesburg, South Africa",
    image: Avartar1,
    rating: 5,
  },
  {
    name: "Emeka Eze",
    message: "The fabric quality is unlike anything I've ordered online before. It feels expensive and looks even better in person.",
    location: "Enugu, Nigeria",
    image: Avartar4,
    rating: 5,
  },
  {
    name: "Nia Asante",
    message: "Fast shipping, beautiful packaging, and the clothes are exactly as described. Kcee_Collection has become my go-to store.",
    location: "Kumasi, Ghana",
    image: Avartar2,
    rating: 5,
  },
  {
    name: "Seun Adeyemi",
    message: "Placed my order on a Monday and it arrived by Thursday. The quality and packaging were both top-notch. Highly recommended.",
    location: "Ibadan, Nigeria",
    image: Avartar3,
    rating: 5,
  },
  {
    name: "Miriam Osei",
    message: "I was skeptical ordering fashion online but Kcee_Collection changed that. The pieces are well-made and true to size.",
    location: "Accra, Ghana",
    image: Avartar5,
    rating: 5,
  },
  {
    name: "Tobi Adebayo",
    message: "Every piece I've ordered has been consistently great. The stitching, the materials, the fit — all perfect every single time.",
    location: "Lagos, Nigeria",
    image: Avartar6,
    rating: 5,
  },
];

const platforms = [
  { name: "Google", score: "4.9", reviews: "200+ reviews", icon: "G" },
  { name: "Trustpilot", score: "4.8", reviews: "150+ reviews", icon: "T" },
];

const Stars = ({ count = 5 }) => (
  <div className="tr-stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < count ? "tr-star filled" : "tr-star"}>★</span>
    ))}
  </div>
);

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const intervalRef = useRef(null);

  const startAuto = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive((p) => (p + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    startAuto();
    return () => clearInterval(intervalRef.current);
  }, []);

  const goTo = (i) => {
    setActive(i);
    startAuto();
  };

  const prev = () => goTo((active - 1 + testimonials.length) % testimonials.length);
  const next = () => goTo((active + 1) % testimonials.length);

  const featured = testimonials[active];

  return (
    <section className="tr-section">
      {/* ── Header ── */}
      <div className="tr-header">
        <p className="tr-eyebrow">Customer Reviews</p>
        <h2 className="tr-title">What Our Customers Say</h2>
        <p className="tr-subtitle">
          Trusted by fashion lovers across Africa — real orders, real people, real satisfaction.
        </p>
      </div>

      {/* ── Platform Ratings Row ── */}
      <div className="tr-platforms">
        {platforms.map((p) => (
          <div className="tr-platform-card" key={p.name}>
            <span className="tr-platform-icon" data-platform={p.name}>{p.icon}</span>
            <div>
              <div className="tr-platform-score">{p.score}</div>
              <Stars />
              <div className="tr-platform-reviews">{p.reviews}</div>
            </div>
            <div className="tr-platform-name">{p.name}</div>
          </div>
        ))}

        {/* Centre featured card */}
        <div className="tr-platform-featured">
          <div className="tr-featured-avatar-wrap">
            <img src={featured.image} alt={featured.name} className="tr-featured-avatar" />
          </div>
          <Stars count={featured.rating} />
          <p className="tr-featured-quote">"{featured.message}"</p>
          <p className="tr-featured-name">{featured.name}</p>
          <p className="tr-featured-location">{featured.location}</p>
        </div>

        {platforms.map((p) => (
          /* spacer mirror so featured card stays centred in a 3-col grid */
          <div className="tr-platform-card tr-platform-card--mirror" key={p.name + "-m"} aria-hidden>
            <span className="tr-platform-icon" data-platform={p.name}>{p.icon}</span>
            <div>
              <div className="tr-platform-score">{p.score}</div>
              <Stars />
              <div className="tr-platform-reviews">{p.reviews}</div>
            </div>
            <div className="tr-platform-name">{p.name}</div>
          </div>
        )).slice(0, 0) /* hidden — layout handled by CSS grid */}
      </div>

      {/* ── Carousel strip ── */}
      <div className="tr-carousel">
        {testimonials.map((t, i) => (
          <button
            key={i}
            className={`tr-card ${i === active ? "tr-card--active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Review by ${t.name}`}
          >
            <img src={t.image} alt={t.name} className="tr-card-avatar" />
            <div className="tr-card-body">
              <Stars count={t.rating} />
              <p className="tr-card-msg">"{t.message}"</p>
              <p className="tr-card-name">{t.name}</p>
              <p className="tr-card-loc">{t.location}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="tr-controls">
        <button className="tr-btn" onClick={prev} aria-label="Previous">&#8592;</button>
        <div className="tr-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`tr-dot ${i === active ? "tr-dot--active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
        <button className="tr-btn" onClick={next} aria-label="Next">&#8594;</button>
      </div>
    </section>
  );
}
