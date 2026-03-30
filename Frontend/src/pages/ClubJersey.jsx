import ProductPage from "../components/ProductPage";
export default function ClubJersey() {
  return (
    <ProductPage
      category="ClubJersey"
      title="Club Jersey"
      description="Authentic Club Football Jerseys"
      seoUrl="/club-jersey"
      sizes={["S", "M", "L", "XL", "XXL"]}
      sizeClass="size-option"
    />
  );
}
