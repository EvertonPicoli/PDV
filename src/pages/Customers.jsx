import React, { useState, useEffect } from "react";
import { Customer } from "@/api/entities";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Search, Phone, Mail, MapPin, FileText } from "lucide-react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    document: "",
    notes: "",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await Customer.list();
    setCustomers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCustomer) {
      await Customer.update(selectedCustomer.id, formData);
    } else {
      await Customer.create(formData);
    }
    setIsOpen(false);
    setSelectedCustomer(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      document: "",
      notes: "",
    });
    loadCustomers();
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
      document: customer.document || "",
      notes: customer.notes || "",
    });
    setIsOpen(true);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search) ||
      customer.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedCustomer ? "Editar Cliente" : "Adicionar Cliente"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">CPF/CNPJ</Label>
                <Input
                  id="document"
                  value={formData.document}
                  onChange={(e) =>
                    setFormData({ ...formData, document: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              <Button type="submit" className="w-full">
                {selectedCustomer ? "Atualizar" : "Cadastrar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar clientes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>CPF/CNPJ</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Total Gasto</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {customer.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-1" />
                        {customer.phone}
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-1" />
                        {customer.email}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {customer.address && (
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {customer.address}
                    </div>
                  )}
                </TableCell>
                <TableCell>{customer.document}</TableCell>
                <TableCell>{customer.total_orders || 0}</TableCell>
                <TableCell>
                  R$ {(customer.total_spent || 0).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(customer)}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}