import ProductPage from "../components/ProductPage";
export default function TShirts() {
  return (
    <ProductPage
      category="TShirts"
      title="T-Shirts"
      description="Premium Men's T-Shirts"
      seoUrl="/t-shirts"
      sizes={["S", "M", "L", "XL", "XXL"]}
      sizeClass="size-option"
    />
  );
}
