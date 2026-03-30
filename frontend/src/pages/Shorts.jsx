import ProductPage from "../components/ProductPage";
export default function Shorts() {
  return (
    <ProductPage
      category="Shorts"
      title="Shorts"
      description="Premium Men's Shorts"
      seoUrl="/shorts"
      sizes={["S", "M", "L", "XL", "XXL"]}
      sizeClass="size-option"
    />
  );
}
