import ProductPage from "../components/ProductPage";
export default function Slippers() {
  return (
    <ProductPage
      category="Slippers"
      title="Slippers"
      description="Premium Men's Slippers"
      seoUrl="/slippers"
      sizes={[40, 41, 42, 43, 44, 45]}
      sizeClass="size-option-shoe"
    />
  );
}
