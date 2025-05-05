import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TopProducts({ orders }) {
  const productSales = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      const product = item.product;
      if (product) {
        if (!acc[product.id]) {
          acc[product.id] = {
            name: product.name,
            quantity: 0,
            total: 0
          };
        }
        acc[product.id].quantity += item.quantity;
        acc[product.id].total += item.price * item.quantity;
      }
    });
    return acc;
  }, {});

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead className="text-right">Qtd. Vendida</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topProducts.map((product, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="text-right">{product.quantity}</TableCell>
            <TableCell className="text-right">
              R$ {product.total.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}