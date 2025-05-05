import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductGrid({ products, onAddToCart }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow p-4 flex flex-col"
        >
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-32 object-cover rounded-md mb-3"
            />
          )}
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
          <div className="mt-auto flex items-center justify-between">
            <span className="font-bold text-lg">
              R$ {product.price.toFixed(2)}
            </span>
            <Button size="sm" onClick={() => onAddToCart(product)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}