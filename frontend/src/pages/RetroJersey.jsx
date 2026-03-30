import ProductPage from "../components/ProductPage";
export default function RetroJersey() {
  return (
    <ProductPage
      category="RetroJersey"
      title="Retro Jersey"
      description="Classic Retro Football Jerseys"
      seoUrl="/retro-jersey"
      sizes={["S", "M", "L", "XL", "XXL"]}
      sizeClass="size-option"
    />
  );
}
