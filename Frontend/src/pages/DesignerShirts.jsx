import ProductPage from "../components/ProductPage";
export default function DesignerShirts() {
  return (
    <ProductPage
      category="DesignerShirts"
      title="Designer Shirts"
      description="Premium Designer Shirts"
      seoUrl="/designer-shirts"
      sizes={["S", "M", "L", "XL", "XXL"]}
      sizeClass="size-option"
    />
  );
}
