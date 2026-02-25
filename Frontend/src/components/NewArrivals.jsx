import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../assets/css/newarrivals.css";

// Images
import watchfront from "../assets/My_Collections/Watches/Watch (1).jpg";
import watchback from "../assets/My_Collections/Watches/Watch (2).jpg";
import shoefront from "../assets/My_Collections/Shoes/Shoe (1).jpg";
import shoeback from "../assets/My_Collections/Shoes/Shoe (2).jpg";
import bagfront from "../assets/My_Collections/Bags/Bag (1).jpg";
import bagback from "../assets/My_Collections/Bags/Bag (2).jpg";
import capfront from "../assets/My_Collections/Caps/Cap (1).jpg";
import capback from "../assets/My_Collections/Caps/Cap (2).jpg";

const newArrivals = [
  {
    id: 1,
    title: "Luxury Watch",
    price: "₦45,000",
    img1: watchfront,
    img2: watchback,
    href: "/watches",
  },
  {
    id: 2,
    title: "Leather Shoes",
    price: "₦65,000",
    img1: shoefront,
    img2: shoeback,
    href: "/shoes",
  },
  {
    id: 3,
    title: "Luxury Leather Bags",
    price: "₦28,000",
    img1: bagfront,
    img2: bagback,
    href: "/bags",
  },
  {
    id: 4,
    title: "Quality Caps",
    price: "₦38,000",
    img1: capfront,
    img2: capback,
    href: "/caps",
  },
];

const NewArrivals = () => {
  const navigate = useNavigate();

  return (
    <section className="premium-arrivals">
      <div className="section-header">
        <h2>New Arrivals</h2>
        <p>Latest drops from our streetwear collection</p>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={3}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {newArrivals.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="premium-card">
              
              <div className="image-wrapper">
                <span className="badge">NEW</span>

                <img
                  src={item.img1}
                  alt={item.title}
                  className="product-img primary"
                />
                <img
                  src={item.img2}
                  alt={item.title}
                  className="product-img secondary"
                />
              </div>

              <div className="card-info">
                <h3>{item.title}</h3>
                <p className="price">{item.price}</p>
                <button className="view-product-btn" onClick={() => navigate(item.href)}>
                  View Product
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Arrows */}
      <div className="custom-prev">&#10094;</div>
      <div className="custom-next">&#10095;</div>
    </section>
  );
};

export default NewArrivals;
