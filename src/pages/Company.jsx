import React, { useState, useEffect } from "react";
import { Company } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UploadFile } from "@/api/integrations";
import { ImagePlus, Loader2 } from "lucide-react";

export default function CompanyPage() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    const companies = await Company.list();
    if (companies.length > 0) {
      setCompany(companies[0]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (company?.id) {
        await Company.update(company.id, company);
      } else {
        await Company.create(company);
      }
      loadCompany();
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setCompany(prev => ({ ...prev, logo_url: file_url }));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                {company?.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt="Logo da empresa"
                    className="w-32 h-32 object-contain"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('logo').click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Alterar Logo'
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                  id="name"
                  value={company?.name || ''}
                  onChange={e => setCompany(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={company?.cnpj || ''}
                  onChange={e => setCompany(prev => ({ ...prev, cnpj: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={company?.address || ''}
                  onChange={e => setCompany(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={company?.phone || ''}
                    onChange={e => setCompany(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={company?.whatsapp || ''}
                    onChange={e => setCompany(prev => ({ ...prev, whatsapp: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={company?.email || ''}
                  onChange={e => setCompany(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={company?.instagram || ''}
                  onChange={e => setCompany(prev => ({ ...prev, instagram: e.target.value }))}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}