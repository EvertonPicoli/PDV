
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Store, LayoutDashboard, ClipboardList, Package, Building2, Users } from "lucide-react";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Store className="w-6 h-6 text-blue-600" />
            Sistema PDV
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            to={createPageUrl("Dashboard")}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            to={createPageUrl("PDV")}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            <Store className="w-5 h-5" />
            PDV
          </Link>
          <Link
            to={createPageUrl("Orders")}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            <ClipboardList className="w-5 h-5" />
            Pedidos
          </Link>
          <Link
            to={createPageUrl("Products")}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            <Package className="w-5 h-5" />
            Produtos
          </Link>
          <Link
            to={createPageUrl("Customers")}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            <Users className="w-5 h-5" />
            Clientes
          </Link>
          <Link
            to={createPageUrl("Company")}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            <Building2 className="w-5 h-5" />
            Empresa
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
