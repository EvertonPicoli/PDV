import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#10b981", "#6366f1", "#f59e0b"];
const PAYMENT_METHODS = {
  "dinheiro": "Dinheiro",
  "cartão": "Cartão",
  "pix": "PIX"
};

export default function PaymentDistribution({ orders }) {
  const paymentTotals = orders.reduce((acc, order) => {
    acc[order.payment_method] = (acc[order.payment_method] || 0) + order.total;
    return acc;
  }, {});

  const data = Object.entries(paymentTotals).map(([method, total]) => ({
    name: PAYMENT_METHODS[method],
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