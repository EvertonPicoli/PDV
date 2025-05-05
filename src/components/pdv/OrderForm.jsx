
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus, Trash2, Printer } from "lucide-react";
import { Company } from "@/api/entities";
import { Customer } from "@/api/entities/customer";

export default function OrderForm({ cart, onQuantityChange, onSubmit, onClear }) {
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    loadCompanyInfo();
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await Customer.list();
    setCustomers(data);
  };

  const loadCompanyInfo = async () => {
    const companies = await Company.list();
    if (companies.length > 0) {
      setCompanyInfo(companies[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      alert("Por favor, selecione uma forma de pagamento");
      return;
    }
    
    const orderData = {
      customer_name: customerName,
      table_number: parseInt(tableNumber),
      payment_method: paymentMethod,
      notes,
      status: "pendente",
    };
    
    setLastOrder({
      ...orderData,
      items: [...cart],
      total
    });

    // Atualizar estatísticas do cliente se um cliente foi selecionado
    if (selectedCustomer) {
      const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await Customer.update(selectedCustomer.id, {
        total_orders: (selectedCustomer.total_orders || 0) + 1,
        total_spent: (selectedCustomer.total_spent || 0) + totalAmount
      });
    }
    
    onSubmit(orderData);
    setOrderCompleted(true);
    
    setCustomerName("");
    setTableNumber("");
    setPaymentMethod("");
    setNotes("");
    setSelectedCustomer(null);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    const printContent = `
      <html>
        <head>
          <title>Comprovante de Pedido</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
              max-width: 300px;
              margin: 0 auto;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px; 
            }
            .company-logo { 
              max-width: 150px; 
              max-height: 80px; 
              margin: 0 auto 10px;
              display: block;
            }
            .divider { 
              border-top: 1px dashed #000; 
              margin: 15px 0; 
            }
            .item { 
              text-align: center;
              margin-bottom: 8px;
            }
            .item-name {
              font-size: 14px;
              margin-bottom: 2px;
            }
            .item-price {
              font-size: 14px;
              color: #333;
            }
            .total { 
              font-weight: bold; 
              margin-top: 15px; 
              text-align: center;
              font-size: 16px;
            }
            .footer { 
              margin-top: 30px; 
              text-align: center; 
              font-size: 12px; 
            }
            .non-fiscal { 
              border: 1px solid #000; 
              padding: 8px; 
              text-align: center; 
              margin: 15px 0; 
              font-weight: bold;
              font-size: 14px;
            }
            .customer-info {
              text-align: center;
              margin: 15px 0;
              font-size: 14px;
            }
            .section-title {
              text-align: center;
              font-weight: bold;
              margin: 15px 0 10px;
              font-size: 16px;
            }
            .contact-info {
              text-align: center;
              font-size: 12px;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${companyInfo?.logo_url ? `<img src="${companyInfo.logo_url}" class="company-logo" alt="Logo" />` : ''}
            <h2>${companyInfo?.name || 'Sistema PDV'}</h2>
            <p>${new Date().toLocaleString('pt-BR')}</p>
          </div>
          
          <div class="non-fiscal">
            NÃO É DOCUMENTO FISCAL
          </div>
          
          <div class="customer-info">
            ${lastOrder.customer_name ? `<p><strong>Cliente:</strong> ${lastOrder.customer_name}</p>` : ''}
            ${lastOrder.table_number ? `<p><strong>Mesa:</strong> ${lastOrder.table_number}</p>` : ''}
            <p><strong>Pagamento:</strong> ${lastOrder.payment_method || '-'}</p>
          </div>
          
          <div class="divider"></div>
          
          <div class="section-title">ITENS DO PEDIDO</div>
          ${lastOrder.items.map(item => `
            <div class="item">
              <div class="item-name">${item.quantity}x ${item.product.name}</div>
              <div class="item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          `).join('')}
          
          <div class="divider"></div>
          
          <div class="total">
            Total: R$ ${lastOrder.total.toFixed(2)}
          </div>
          
          ${lastOrder.notes ? `
          <div class="customer-info">
            <strong>Observações:</strong><br/>
            ${lastOrder.notes}
          </div>
          ` : ''}
          
          <div class="footer">
            <div class="non-fiscal">NÃO É DOCUMENTO FISCAL</div>
            <div class="contact-info">
              ${companyInfo?.address ? `${companyInfo.address}<br/>` : ''}
              ${companyInfo?.phone ? `Tel: ${companyInfo.phone}<br/>` : ''}
              ${companyInfo?.whatsapp ? `WhatsApp: ${companyInfo.whatsapp}<br/>` : ''}
              ${companyInfo?.email ? `${companyInfo.email}<br/>` : ''}
            </div>
            <p>Obrigado pela preferência!</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = function() {
      printWindow.print();
    };
    
    setOrderCompleted(false);
    setLastOrder(null);
  };

  const startNewOrder = () => {
    setOrderCompleted(false);
    setLastOrder(null);
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold mb-4">Pedido Atual</h2>

      <div className="space-y-4 mb-4">
        {cart.map((item) => (
          <div
            key={item.product_id}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">
                R$ {item.price.toFixed(2)} x {item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() =>
                  onQuantityChange(item.product_id, item.quantity - 1)
                }
                disabled={orderCompleted}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() =>
                  onQuantityChange(item.product_id, item.quantity + 1)
                }
                disabled={orderCompleted}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {!orderCompleted ? (
        <>
          <div className="pt-4 border-t">
            <Select
              value={selectedCustomer?.id || ""}
              onValueChange={(value) => {
                const customer = customers.find(c => c.id === value);
                setSelectedCustomer(customer);
                setCustomerName(customer ? customer.name : "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar cliente cadastrado" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Nome do cliente"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setSelectedCustomer(null);
              }}
              className="mt-2"
            />
            <Input
              type="number"
              placeholder="Número da mesa"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="mt-2"
            />
            <Select 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              required
            >
              <SelectTrigger className={!paymentMethod ? "border-red-300 mt-2" : "mt-2"}>
                <SelectValue placeholder="Forma de pagamento *" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="cartão">Cartão</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
              </SelectContent>
            </Select>
            {!paymentMethod && (
              <p className="text-xs text-red-500 mt-1">
                Forma de pagamento obrigatória
              </p>
            )}
            <Input
              placeholder="Observações"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-bold">Total:</span>
              <span className="font-bold">R$ {total.toFixed(2)}</span>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClear}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={cart.length === 0}
              >
                Finalizar
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="pt-4 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-bold">Total:</span>
              <span className="font-bold">R$ {total.toFixed(2)}</span>
            </div>
            
            <div className="space-y-2">
              <Button 
                type="button" 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Comprovante
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={startNewOrder}
              >
                Novo Pedido
              </Button>
            </div>
          </div>
        </>
      )}
    </form>
  );
}
