import ProductPage from "../components/ProductPage";
export default function Jeans() {
  return (
    <ProductPage
      category="Jeans"
      title="Jeans"
      description="Premium Denim Collection"
      seoUrl="/jeans"
      sizes={["S", "M", "L", "XL", "XXL"]}
      sizeClass="size-option"
    />
  );
}
