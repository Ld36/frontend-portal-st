'use client';
import { useState } from 'react';
import { api } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2 } from 'lucide-react';

export function StatusCheck() {
  const [doc, setDoc] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/empresas/status/${doc}`);
      setResult(response.data);
    } catch (err) {
      setResult({ error: "Documento não encontrado." });
    } finally { setLoading(false); }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-t-4 border-t-green-600">
      <CardHeader><CardTitle className="flex items-center gap-2"><Search /> Consultar Status</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="CPF ou CNPJ (somente números)" value={doc} onChange={(e) => setDoc(e.target.value)} />
        <Button onClick={checkStatus} className="w-full bg-green-600" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Verificar"}
        </Button>
        {result && (
          <div className="mt-4 p-4 rounded-lg border bg-slate-50">
            {result.error ? <p className="text-sm text-red-500">{result.error}</p> : (
              <div className="space-y-2">
                <p className="text-sm"><strong>Empresa:</strong> {result.nome_fantasia}</p>
                <div className="text-sm font-bold">Status: <Badge>{result.status}</Badge></div>
                {result.status === 'REPROVADO' && <p className="text-xs text-red-600">Motivo: {result.observacao_reprovacao}</p>}
                {result.status === 'APROVADO' && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md space-y-2">
                    <h4 className="text-sm font-semibold text-green-800 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Parabéns! Sua empresa foi aprovada
                    </h4>
                    <p className="text-xs text-green-700">
                      Em breve será liberado seu painel personalizado para:
                    </p>
                    <ul className="text-xs text-green-600 space-y-1 ml-4">
                      <li>• Visualização de suas atividades</li>
                      <li>• Acompanhamento de certificações</li>
                      <li>• Gestão de documentos</li>
                      <li>• Relatórios de homologação</li>
                    </ul>
                    <p className="text-xs text-green-700 font-medium mt-2">
                      Aguarde o contato da nossa equipe para liberar o acesso completo.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}