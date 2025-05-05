import React, { useState, useEffect } from "react";
import { Product, Order } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderForm from "../components/pdv/OrderForm";
import ProductGrid from "../components/pdv/ProductGrid";

export default function PDV() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await Product.list();
    setProducts(data);
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.product_id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        { product_id: product.id, quantity: 1, price: product.price, product },
      ]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      setCart(cart.filter((item) => item.product_id !== productId));
    } else {
      setCart(
        cart.map((item) =>
          item.product_id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleCreateOrder = async (orderData) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = {
      ...orderData,
      items: cart.map(({ product_id, quantity, price }) => ({
        product_id,
        quantity,
        price,
      })),
      total,
    };

    await Order.create(order);
    clearCart();
  };

  const filteredProducts = products.filter(
    (product) =>
      (activeCategory === "all" || product.category === activeCategory) &&
      product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex gap-6">
      <div className="flex-1">
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setActiveCategory("all")}>
              Todos
            </TabsTrigger>
            <TabsTrigger
              value="bebidas"
              onClick={() => setActiveCategory("bebidas")}
            >
              Bebidas
            </TabsTrigger>
            <TabsTrigger
              value="comidas"
              onClick={() => setActiveCategory("comidas")}
            >
              Comidas
            </TabsTrigger>
            <TabsTrigger
              value="sobremesas"
              onClick={() => setActiveCategory("sobremesas")}
            >
              Sobremesas
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
      </div>

      <Card className="w-96 p-4">
        <OrderForm cart={cart} onQuantityChange={updateQuantity} onSubmit={handleCreateOrder} onClear={clearCart} />
      </Card>
    </div>
  );
}