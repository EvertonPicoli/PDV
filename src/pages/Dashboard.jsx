import React, { useState, useEffect } from "react";
import { Order } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Banknote, TrendingUp, CreditCard, Wallet } from "lucide-react";
import SalesChart from "../components/dashboard/SalesChart";
import CategoryDistribution from "../components/dashboard/CategoryDistribution";
import PaymentDistribution from "../components/dashboard/PaymentDistribution";
import TopProducts from "../components/dashboard/TopProducts";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [period, setPeriod] = useState("7d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await Order.list("-created_date");
    setOrders(data);
    setLoading(false);
  };

  const getFilteredOrders = () => {
    const today = new Date();
    const periodDays = {
      "7d": 7,
      "15d": 15,
      "30d": 30,
    };
    const days = periodDays[period] || 7;
    const startDate = startOfDay(subDays(today, days));
    
    return orders.filter(order => 
      new Date(order.created_date) >= startDate && 
      order.status !== "cancelado"
    );
  };

  const calculateStats = () => {
    const filteredOrders = getFilteredOrders();
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    const paymentMethodTotals = filteredOrders.reduce((acc, order) => {
      acc[order.payment_method] = (acc[order.payment_method] || 0) + order.total;
      return acc;
    }, {});

    return {
      totalSales,
      totalOrders,
      averageTicket,
      paymentMethodTotals
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="7d">7 dias</TabsTrigger>
            <TabsTrigger value="15d">15 dias</TabsTrigger>
            <TabsTrigger value="30d">30 dias</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <Banknote className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.averageTicket.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos em Dinheiro</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(stats.paymentMethodTotals["dinheiro"] || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart orders={getFilteredOrders()} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryDistribution orders={getFilteredOrders()} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentDistribution orders={getFilteredOrders()} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProducts orders={getFilteredOrders()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}