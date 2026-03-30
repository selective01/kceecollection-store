import ProductPage from "../components/ProductPage";
export default function Hoodies() {
  return (
    <ProductPage
      category="Hoodies"
      title="Hoodies"
      description="Premium Streetwear Hoodies"
      seoUrl="/hoodies"
      sizes={["S", "M", "L", "XL", "XXL"]}
      sizeClass="size-option"
    />
  );
}
