import ProductPage from "../components/ProductPage";
export default function Sleeveless() {
  return (
    <ProductPage
      category="Sleeveless"
      title="Sleeveless"
      description="Premium Sleeveless Tops"
      seoUrl="/sleeveless"
      sizes={["S", "M", "L", "XL", "XXL"]}
      sizeClass="size-option"
    />
  );
}
