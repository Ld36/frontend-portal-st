'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Plus, RefreshCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function Dashboard({ onAddNew, onLogout }: { onAddNew: () => void; onLogout: () => void }) {
  const [empresas, setEmpresas] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  const loadEmpresas = async () => {
    if (isLoaded) return; 
    try {
      const response = await api.get('/empresas');
      setEmpresas(response.data);
      setIsLoaded(true);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro de Conexão", description: "Não foi possível carregar a lista." });
    }
  };

  const refreshEmpresas = async () => {
    try {
      const response = await api.get('/empresas');
      setEmpresas(response.data);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro de Conexão", description: "Não foi possível carregar a lista." });
    }
  };

  useEffect(() => { loadEmpresas(); }, []);

  const handleAction = async (id: number, action: 'aprovar' | 'reprovar') => {
    const promptMsg = action === 'aprovar' ? "Nome do responsável externo:" : "Motivo da reprovação:";
    const input = prompt(promptMsg);
    if (!input) return;

    try {
      const body = action === 'aprovar' ? { responsavel_externo: input } : { motivo: input };
      await api.patch(`/empresas/${id}/${action}`, body);
      toast({ title: "Sucesso", description: `Empresa ${action}ada com sucesso!` });
      refreshEmpresas();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.response?.data?.message });
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Administração de Empresas</CardTitle>
          <CardDescription>Listagem de empresas para homologação</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={refreshEmpresas}><RefreshCcw size={16} /></Button>
          {/* Requisito FA03: Botão (+) para novo cadastro */}
          <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus size={18} /> Nova Empresa
          </Button>
          <Button onClick={onLogout} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
            Sair
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Documento (Criptografado)</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empresas.map((emp: any) => (
              <TableRow key={emp.id}>
                <TableCell className="font-mono text-xs">{emp.documento}</TableCell>
                <TableCell>{emp.perfil}</TableCell>
                <TableCell>
                  <Badge variant={emp.status === 'APROVADO' ? 'default' : emp.status === 'PENDENTE' ? 'secondary' : 'destructive'}>
                    {emp.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {emp.status === 'PENDENTE' && (
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600 text-xs" onClick={() => handleAction(emp.id, 'aprovar')}>Aprovar</Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 text-xs" onClick={() => handleAction(emp.id, 'reprovar')}>Reprovar</Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}