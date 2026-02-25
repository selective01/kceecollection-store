import { useState, useEffect } from "react";
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
  },
  {
    name: "Kwame Mensah",
    message: "I was honestly impressed. The quality is premium, and everything looked exactly like the pictures. You’ve gained a loyal customer.",
    location: "Accra, Ghana",
    image: Avartar2,
  },
  {
    name: "Chinedu Okafor",
    message: "Top-tier service! The fit was perfect and the material feels durable. I’ll definitely be recommending KceeCollection.",
    location: "Lagos, Nigeria",
    image: Avartar3,
  },
  {
    name: "Amina Diallo",
    message: "Absolutely beautiful! The quality exceeded my expectations and the customer support was very responsive.",
    location: "Dakar, Senegal",
    image: Avartar4,
  },
  {
    name: "Abdulrahman Bello",
    message: "Excellent craftsmanship and fast delivery. It’s rare to find this level of consistency.",
    location: "Abuja, Nigeria",
    image: Avartar5,
  },
  {
    name: "Zainab Abubakar",
    message: "I love how classy and well-finished everything looks. You can tell care goes into every order.",
    location: "Kano, Nigeria",
    image: Avartar6,
  },
];

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(3);

  // Responsive logic
  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth <= 480) setCardsPerSlide(1);
      else if (window.innerWidth <= 768) setCardsPerSlide(2);
      else setCardsPerSlide(3);
    };

    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / cardsPerSlide);

  const next = () =>
    setCurrentSlide((prev) => (prev + 1) % totalSlides);

  const prev = () =>
    setCurrentSlide((prev) =>
      prev === 0 ? totalSlides - 1 : prev - 1
    );

  // Auto slide
  useEffect(() => {
    const auto = setInterval(next, 5000);
    return () => clearInterval(auto);
  }, [cardsPerSlide]);


  return (
    <>
      <section className="textimonial">
        <div className="testimonial-container">
          <h2>What Our Customers Say</h2>

          <div className="slider">
            <div
              className="slider-track"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div 
                  className="slide" 
                  key={slideIndex}
                >
                  {testimonials
                    .slice(
                      slideIndex * cardsPerSlide,
                      slideIndex * cardsPerSlide + cardsPerSlide
                    )
                    .map((item, i) => (
                      <div className="testimonial-card" key={i}>
                        <div className="avatar">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <p className="message">"{item.message}"</p>
                        <h4>{item.name}</h4>
                        <span>{item.location}</span>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <div className="controls">
            <button onClick={prev}>←</button>
            <button onClick={next}>→</button>
          </div>
        </div>
      </section>
    </>
  );
}