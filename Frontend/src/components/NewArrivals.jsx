import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import axios from "axios";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../assets/css/newarrivals.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const NewArrivals = () => {
  const navigate = useNavigate();
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArrivals = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/newarrivals`);
        setNewArrivals(res.data);
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArrivals();
  }, []);

  if (loading) return null;
  if (newArrivals.length === 0) return null;

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
        navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {newArrivals.map((item) => (
          <SwiperSlide key={item._id}>
            <div className="premium-card">
              <div className="image-wrapper">
                <span className="badge">NEW</span>
                <img src={item.img1} alt={item.title} className="product-img primary" />
                {item.img2 && (
                  <img src={item.img2} alt={item.title} className="product-img secondary" />
                )}
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

      <div className="custom-prev">&#10094;</div>
      <div className="custom-next">&#10095;</div>
    </section>
  );
};

export default NewArrivals;
