import ProductPage from "../components/ProductPage";
export default function Joggers() {
  return (
    <ProductPage
      category="Joggers"
      title="Joggers"
      description="Premium Joggers Collection"
      seoUrl="/joggers"
      sizes={["S", "M", "L", "XL", "XXL"]}
      sizeClass="size-option"
    />
  );
}
