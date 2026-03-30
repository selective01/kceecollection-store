// HomeComponent.jsx — Updated with TrustBadges section
import Hero from "../components/Hero";
import TrustBadges from "../components/TrustBadges";
import NewArrivals from "../components/NewArrivals";
import Categories from "../components/Categories";
import Testimonials from "../components/Testimonial";
import SEO from "../components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Home"
        description="Shop the latest fashion collections at Kcee Collection — hoodies, jeans, shoes, jerseys and more."
        image="https://Kcee_Collection.com/og-image.jpg"
        url="https://Kcee_Collection.com/"
      />
      <Hero />
      <TrustBadges />
      <NewArrivals />
      <Categories />
      <Testimonials />
    </>
  );
}
