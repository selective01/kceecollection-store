import ProductPage from "../components/ProductPage";
export default function Sneakers() {
  return (
    <ProductPage
      category="Sneakers"
      title="Sneakers"
      description="Premium Men's Sneakers"
      seoUrl="/sneakers"
      sizes={[40, 41, 42, 43, 44, 45]}
      sizeClass="size-option-shoe"
    />
  );
}
