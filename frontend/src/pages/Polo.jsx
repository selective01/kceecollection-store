import ProductPage from "../components/ProductPage";
export default function Polo() {
  return (
    <ProductPage
      category="Polo"
      title="Polo"
      description="Premium Polo Shirts"
      seoUrl="/polo"
      sizes={["S", "M", "L", "XL", "XXL"]}
      sizeClass="size-option"
    />
  );
}
