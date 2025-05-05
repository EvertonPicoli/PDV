import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function SalesChart({ orders }) {
  const dailySales = orders.reduce((acc, order) => {
    const date = format(new Date(order.created_date), "yyyy-MM-dd");
    acc[date] = (acc[date] || 0) + order.total;
    return acc;
  }, {});

  const data = Object.entries(dailySales).map(([date, total]) => ({
    date,
    total
  })).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(parseISO(date), "dd/MM", { locale: ptBR })}
          />
          <YAxis 
            tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
          />
          <Tooltip 
            formatter={(value) => [`R$ ${value.toFixed(2)}`, "Total"]}
            labelFormatter={(date) => format(parseISO(date), "dd 'de' MMMM", { locale: ptBR })}
          />
          <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}