// Categories.jsx — Redesigned
// Layout: filter tabs row + 4-column product grid with hover Add to Cart
// Style: editorial, clean, inspired by reference design 2
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/categories.css";

import bagsImg         from "../assets/My_Collections/Bags/Bag (1).jpg";
import capImg          from "../assets/My_Collections/Caps/Cap (1).jpg";
import tShirtImg       from "../assets/My_Collections/Tshirts/Tshirt (1).jpg";
import retroJerseyImg  from "../assets/My_Collections/RetroJersey/RetroJersey (1).jpg";
import hoodieImg       from "../assets/My_Collections/Hoodie/Hoodie (1).jpg";
import jeanShortsImg   from "../assets/My_Collections/JeanShorts/JeanShort (1).jpg";
import joggersImg      from "../assets/My_Collections/Joggers/Joggers (1).jpg";
import designerShirtsImg from "../assets/My_Collections/DesignerShirts/DesignerShirt (1).jpg";
import sneakersImg     from "../assets/My_Collections/Sneakers/Sneakers (1).jpg";
import slippersImg     from "../assets/My_Collections/Slippers/Slippers (1).jpg";
import poloImg         from "../assets/My_Collections/Polo/Polo (1).jpg";
import sleevelessImg   from "../assets/My_Collections/Sleeveless/Sleeveless (1).jpg";
import jeansImg        from "../assets/My_Collections/Jeans/Jean (1).jpg";
import clubJerseyImg   from "../assets/My_Collections/ClubJersey/ClubJersey (1).jpg";
import perfumeImg      from "../assets/My_Collections/Perfume/Perfume (1).jpg";
import shortsImg       from "../assets/My_Collections/Shorts/Short (1).jpg";
import WatchesImg      from "../assets/My_Collections/Watches/Watch (1).jpg";
import ShoesImg        from "../assets/My_Collections/Shoes/Shoe (1).jpg";

const ALL_PRODUCTS = [
  { title: "T-Shirts",        href: "/t-shirts",        img: tShirtImg,         tag: "Tops"      },
  { title: "Polo",            href: "/polo",            img: poloImg,           tag: "Tops"      },
  { title: "Designer Shirts", href: "/designer-shirts", img: designerShirtsImg, tag: "Tops"      },
  { title: "Sleeveless",      href: "/sleeveless",      img: sleevelessImg,     tag: "Tops"      },
  { title: "Hoodies",         href: "/hoodies",         img: hoodieImg,         tag: "Tops"      },
  { title: "Jeans",           href: "/jeans",           img: jeansImg,          tag: "Bottoms"   },
  { title: "Shorts",          href: "/shorts",          img: shortsImg,         tag: "Bottoms"   },
  { title: "Jean Shorts",     href: "/jean-shorts",     img: jeanShortsImg,     tag: "Bottoms"   },
  { title: "Joggers",         href: "/joggers",         img: joggersImg,        tag: "Bottoms"   },
  { title: "Club Jersey",     href: "/club-jersey",     img: clubJerseyImg,     tag: "Jerseys"   },
  { title: "Retro Jersey",    href: "/retro-jersey",    img: retroJerseyImg,    tag: "Jerseys"   },
  { title: "Sneakers",        href: "/sneakers",        img: sneakersImg,       tag: "Footwear"  },
  { title: "Shoes",           href: "/shoes",           img: ShoesImg,          tag: "Footwear"  },
  { title: "Slippers",        href: "/slippers",        img: slippersImg,       tag: "Footwear"  },
  { title: "Bags",            href: "/bags",            img: bagsImg,           tag: "Accessories"},
  { title: "Caps",            href: "/caps",            img: capImg,            tag: "Accessories"},
  { title: "Watches",         href: "/watches",         img: WatchesImg,        tag: "Accessories"},
  { title: "Perfume",         href: "/perfume",         img: perfumeImg,        tag: "Accessories"},
];

const TABS = ["All", "Tops", "Bottoms", "Jerseys", "Footwear", "Accessories"];

const Categories = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  const visible = activeTab === "All"
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter((p) => p.tag === activeTab);

  return (
    <section className="cat-section" id="shop">
      {/* Header */}
      <div className="cat-header">
        <div>
          <p className="cat-eyebrow">Our collections</p>
          <h2 className="cat-title">Shop by Category</h2>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="cat-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`cat-tab ${activeTab === tab ? "cat-tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="cat-grid">
        {visible.map((item, idx) => (
          <div
            key={idx}
            className="cat-card"
            onClick={() => navigate(item.href)}
          >
            {/* Rating */}
            <div className="cat-rating">
              <span className="cat-star">★</span> 4.9/5.0
            </div>

            <div className="cat-img-wrap">
              <img
                src={item.img}
                alt={item.title}
                className="cat-img"
                loading="lazy"
                decoding="async"
              />
              {/* Hover overlay with CTA */}
              <div className="cat-overlay">
                <button
                  className="cat-cta"
                  onClick={(e) => { e.stopPropagation(); navigate(item.href); }}
                >
                  Explore →
                </button>
              </div>
            </div>

            <div className="cat-card-body">
              <p className="cat-card-name">{item.title}</p>
              <span className="cat-card-tag">{item.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
