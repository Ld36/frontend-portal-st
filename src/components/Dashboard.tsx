'use client';

import { useEffect, useState } from 'react';
import{ api } from '../services/api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';

export function Dashboard() {
  const [empresas, setEmpresas] = useState([]);
  const { toast } = useToast();

  const loadEmpresas = async () => {
    try {
      const response = await api.get('/empresas');
      setEmpresas(response.data);
    } catch (error) {
      console.error("Erro ao carregar empresas", error);
    }
  };

  useEffect(() => {
    loadEmpresas();
  }, []);

  const handleAprovar = async (id: number) => {
    const responsavel = prompt("M10: Informe o nome do responsável externo para aprovação:");
    if (!responsavel) return;

    try {
      await api.patch(`/empresas/${id}/aprovar`, { responsavel_externo: responsavel });
      toast({ title: "Sucesso", description: "Empresa aprovada com sucesso! (M10)" });
      loadEmpresas();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.response?.data?.message });
    }
  };

  const handleReprovar = async (id: number) => {
    const motivo = prompt("M11: Informe o motivo da reprovação:");
    if (!motivo) return;

    try {
      await api.patch(`/empresas/${id}/reprovar`, { motivo });
      toast({ title: "Sucesso", description: "Empresa reprovada com sucesso! (M12)" });
      loadEmpresas();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.response?.data?.message });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Administração de Empresas (FA03)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Documento</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empresas.map((emp: any) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium">{emp.documento}</TableCell>
                <TableCell>{emp.perfil}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      emp.status === 'APROVADO' ? 'default' : 
                      emp.status === 'PENDENTE' ? 'secondary' : 'destructive'
                    }
                  >
                    {emp.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {emp.status === 'PENDENTE' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleAprovar(emp.id)}
                      >
                        Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleReprovar(emp.id)}
                      >
                        Reprovar
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {empresas.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  Nenhuma empresa cadastrada no momento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}