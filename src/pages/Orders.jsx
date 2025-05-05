import React, { useState, useEffect } from "react";
import { Order } from "@/api/entities";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const statusColors = {
  pendente: "bg-yellow-100 text-yellow-800",
  preparando: "bg-blue-100 text-blue-800",
  pronto: "bg-green-100 text-green-800",
  entregue: "bg-gray-100 text-gray-800",
  cancelado: "bg-red-100 text-red-800",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000); // Recarrega a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    const data = await Order.list("-created_date");
    setOrders(data);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    await Order.update(orderId, { status: newStatus });
    loadOrders();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pedidos</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {["pendente", "preparando", "pronto", "entregue"].map((status) => (
          <Card key={status} className="p-4">
            <h3 className="font-semibold mb-2 capitalize">{status}</h3>
            <div className="text-2xl font-bold">
              {orders.filter((order) => order.status === status).length}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Mesa</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  {format(new Date(order.created_date), "dd/MM/yyyy HH:mm")}
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.table_number}</TableCell>
                <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={statusColors[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">
                  {order.payment_method}
                </TableCell>
                <TableCell>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="preparando">Preparando</option>
                    <option value="pronto">Pronto</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}