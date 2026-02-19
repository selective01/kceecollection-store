import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import NewArrivals from "../components/NewArrivals";
import Categories from "../components/Categories";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <NewArrivals />
      <Categories />
      <Footer />
    </>
  );
}
