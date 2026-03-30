import ProductPage from "../components/ProductPage";
export default function JeanShorts() {
  return (
    <ProductPage
      category="JeanShorts"
      title="Jean Shorts"
      description="Premium Denim Shorts"
      seoUrl="/jean-shorts"
      sizes={["S", "M", "L", "XL", "XXL"]}
      sizeClass="size-option"
    />
  );
}
