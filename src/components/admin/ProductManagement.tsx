import { ProductForm } from "./product/ProductForm";

export const ProductManagement = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <ProductForm onProductAdded={() => {}} />
      </div>
    </div>
  );
};