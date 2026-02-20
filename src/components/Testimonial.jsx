import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../assets/css/testimonial.css";
import avartar1 from "../assets/My_Collections/Avartars/Avartar (1).jpg";
import avartar2 from "../assets/My_Collections/Avartars/Avartar (2).jpg";
import avartar3 from "../assets/My_Collections/Avartars/Avartar (3).jpg";
import avartar4 from "../assets/My_Collections/Avartars/Avartar (4).jpg";
import avartar5 from "../assets/My_Collections/Avartars/Avartar (5).jpg";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Luca Moretti",
      image: avartar1,
      text: "I’m really impressed with KceeCollection! The quality of the products is excellent, and the delivery was super fast. I’ll definitely order again.",
    },
    {
      name: "Tunde Adewale",
      image: avartar2,
      text: "Kceecollection exceeded my expectations. The fabrics feel premium and classy.",
    },
    {
      name: "Johan Svensson",
      image: avartar3,
      text: "Great experience! The items arrived on time, well-packaged, and exactly as described. Kceecollection really cares about customers.",
    },
    {
      name: "Olivier Dubois",
      image: avartar4,
      text: "Everything feels luxurious and well-made. Definitely shopping again!",
    },
    {
      name: "Emma Sky",
      image: avartar5,
      text: "I love the variety and quality of KceeCollection products. Delivery was fast and hassle-free. Highly recommend to anyone shopping here!",
    },  
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2>Customer Testimonials</h2>
      </div>

      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        autoplay={{ delay: 4000 }}
        loop={true}
        centeredSlides={true}
        slidesPerView={1}
        spaceBetween={20}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 10, navigation: false, },   
          768: { slidesPerView: 3, spaceBetween: 10, navigation: true, } ,   
          1024: { slidesPerView: 3, spaceBetween: 30 } ,
        }}
        className="testimonials-swiper"
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div className={`testimonial-card ${isActive ? "active" : ""}`}>
                {/* Avatar */}
                <div className="testimonial-avatar">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="testimonial-content">
                  <div className="testimonial-stars">★★★★★</div>

                  <h3>{item.name}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Custom Arrows */}
      <div className="custom-prev">&#10094;</div>
      <div className="custom-next">&#10095;</div>
  </section>
  );
}
