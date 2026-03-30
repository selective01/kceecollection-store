import ProductPage from "../components/ProductPage";
export default function Shoes() {
  return (
    <ProductPage
      category="Shoes"
      title="Shoes"
      description="Premium Men's Shoes"
      seoUrl="/shoes"
      sizes={[40, 41, 42, 43, 44, 45]}
      sizeClass="size-option-shoe"
    />
  );
}
