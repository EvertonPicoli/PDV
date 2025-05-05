import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b"];

export default function CategoryDistribution({ orders }) {
  const categoryTotals = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      const product = item.product;
      if (product) {
        acc[product.category] = (acc[product.category] || 0) + (item.price * item.quantity);
      }
    });
    return acc;
  }, {});

  const data = Object.entries(categoryTotals).map(([category, total]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: total
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}