import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/categories.css";

import bagsImg from "../assets/My_Collections/Bags/Bag (1).jpg";
import capImg from "../assets/My_Collections/Caps/Cap (1).jpg";
import tShirtImg from "../assets/My_Collections/Tshirts/Tshirt (1).jpg";
import retroJerseyImg from "../assets/My_Collections/RetroJersey/RetroJersey (1).jpg";
import hoodieImg from "../assets/My_Collections/Hoodie/Hoodie (1).jpg";
import jeanShortsImg from "../assets/My_Collections/JeanShorts/JeanShort (1).jpg";
import joggersImg from "../assets/My_Collections/Joggers/Joggers (1).jpg";
import designerShirtsImg from "../assets/My_Collections/DesignerShirts/DesignerShirt (1).jpg";
import sneakersImg from "../assets/My_Collections/Sneakers/Sneakers (1).jpg";
import slippersImg from "../assets/My_Collections/Slippers/Slippers (1).jpg";
import poloImg from "../assets/My_Collections/Polo/Polo (1).jpg";
import sleevelessImg from "../assets/My_Collections/Sleeveless/Sleeveless (1).jpg";
import jeansImg from "../assets/My_Collections/Jeans/Jean (1).jpg";
import clubJerseyImg from "../assets/My_Collections/ClubJersey/ClubJersey (1).jpg";
import perfumeImg from "../assets/My_Collections/Perfume/Perfume (1).jpg";
import shortsImg from "../assets/My_Collections/Shorts/Short (1).jpg";
import WatchesImg from "../assets/My_Collections/Watches/Watch (1).jpg";
import ShoesImg from "../assets/My_Collections/Shoes/Shoe (1).jpg";

const products = [
  { title : "Bags", href: "/bags", img: bagsImg },
  { title: "Caps", href: "/caps", img: capImg },
  { title: "Club Jersey", href: "/club-jersey", img: clubJerseyImg },
  { title: "Designer Shirts", href: "/designer-shirts", img: designerShirtsImg },
  { title: "Hoodies", href: "/hoodies", img: hoodieImg },
  { title: "Jeans", href: "/jeans", img: jeansImg },
  { title: "Jean Shorts", href: "/jean-shorts", img: jeanShortsImg },
  { title: "Joggers", href: "/joggers", img: joggersImg },
  { title: "Perfume", href: "/perfume", img: perfumeImg },
  { title: "Polo", href: "/polo", img: poloImg },
  { title: "Shoes", href: "/shoes", img: ShoesImg },
  { title: "Shorts", href: "/shorts", img: shortsImg },
  { title: "Sneakers", href: "/sneakers", img: sneakersImg },
  { title: "Sleeveless", href: "/sleeveless", img: sleevelessImg },
  { title: "Slippers", href: "/slippers", img: slippersImg },
  { title: "Retro Jersey", href: "/retrojersey", img: retroJerseyImg },
  { title: "T-shirts", href: "/t-shirts", img: tShirtImg },
  { title: "Watches", href: "/watches", img: WatchesImg },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="premium-categories" id="shop">
      <div className="section-header">
        <h2>Categories</h2>
        <p>Explore our men's collections</p>
      </div>

      <div className="categories-grid">
        {products.map((item, idx) => (
          <div
            key={idx}
            className="category-card"
            onClick={() => navigate(item.href)}
          >
            <div className="image-wrapper">
              <img
                src={item.img}
                alt={item.title}
                className="product-img"
              />
            </div>

            <div className="category-card-info">
              <h3>{item.title}</h3>
              <button className="category-card-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(item.href);
                }}
              >
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
