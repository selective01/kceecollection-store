// NewArrivals.jsx — uses shared global cache
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { fetchNewArrivals } from "../utils/productCache";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../assets/css/newarrivals.css";

function SkeletonCard() {
  return (
    <div className="na-card">
      <div className="na-card-img-wrap">
        <div className="na-skeleton-img" />
      </div>
      <div className="na-card-body">
        <div className="na-skeleton-line" style={{ width: "60%", height: 14 }} />
        <div className="na-skeleton-line" style={{ width: "35%", height: 14, marginTop: 6 }} />
      </div>
    </div>
  );
}

const NewArrivals = () => {
  const navigate = useNavigate();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchNewArrivals()
      .then((data) => { if (!cancelled) { setItems(data); setLoading(false); } })
      .catch(()    => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (!loading && !items.length) return null;

  return (
    <section className="na-section">
      <div className="na-header">
        <div>
          <p className="na-eyebrow">Just dropped</p>
          <h2 className="na-title">New Arrivals</h2>
        </div>
        <p className="na-sub">Latest drops from our streetwear collection</p>
      </div>

      <div className="na-swiper-wrap">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={3}
          navigation={{ nextEl: ".na-next", prevEl: ".na-prev" }}
          pagination={{ clickable: true, el: ".na-dots" }}
          breakpoints={{
            0:    { slidesPerView: 1.2 },
            600:  { slidesPerView: 2.1 },
            1024: { slidesPerView: 3 },
          }}
        >
          {loading
            ? [1, 2, 3].map((i) => <SwiperSlide key={i}><SkeletonCard /></SwiperSlide>)
            : items.map((item) => (
              <SwiperSlide key={item._id}>
                <div className="na-card" onClick={() => navigate(item.href)}>
                  <div className="na-rating">
                    <span className="na-star">★</span> 4.9/5.0
                  </div>
                  <div className="na-card-img-wrap">
                    <img
                      src={item.img1}
                      alt={item.title}
                      className="na-img na-img-primary"
                      loading="lazy"
                      decoding="async"
                    />
                    {item.img2 && (
                      <img
                        src={item.img2}
                        alt={item.title}
                        className="na-img na-img-secondary"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <button
                      className="na-hover-cta"
                      onClick={(e) => { e.stopPropagation(); navigate(item.href); }}
                    >
                      View Product &nbsp;→
                    </button>
                  </div>
                  <div className="na-card-body">
                    <p className="na-card-name">{item.title}</p>
                    <p className="na-card-price">₦{Number(item.price).toLocaleString()}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>

        <button className="na-prev">&#8592;</button>
        <button className="na-next">&#8594;</button>
        <div className="na-dots" />
      </div>
    </section>
  );
};

export default NewArrivals;
