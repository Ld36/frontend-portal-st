'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function StatusPage() {
  const [doc, setDoc] = useState('');
  const [result, setResult] = useState<any>(null);

  const checkStatus = async () => {
    try {
      const response = await api.get(`/empresas/status/${doc}`);
      setResult(response.data);
    } catch (err) {
      setResult({ error: "Documento não encontrado." });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Consultar Status de Homologação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Digite seu CPF ou CNPJ" 
            value={doc} 
            onChange={(e) => setDoc(e.target.value)} 
          />
          <Button onClick={checkStatus} className="w-full">Verificar</Button>

          {result && (
            <div className="mt-6 p-4 border rounded-lg bg-white">
              {result.error ? (
                <p className="text-red-500">{result.error}</p>
              ) : (
                <div className="space-y-2">
                  <p><strong>Empresa:</strong> {result.nome_fantasia}</p>
                  <p><strong>Status:</strong> 
                    <Badge className="ml-2">{result.status}</Badge>
                  </p>
                  {result.status === 'REPROVADO' && (
                    <p className="text-sm text-red-600"><strong>Motivo:</strong> {result.observacao_reprovacao}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}