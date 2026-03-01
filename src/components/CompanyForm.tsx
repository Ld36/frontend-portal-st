'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Componentes do Shadcn
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// 1. Definição da Interface para evitar erros de "FieldValues"
interface CompanyFormValues {
  tipo_pessoa: 'fisica' | 'juridica' | 'estrangeira';
  documento: string;
  perfil: string;
  faturamento_direto: boolean;
  razao_social?: string;
  nome?: string;
  nome_fantasia?: string;
}

// 2. Schema com Zod garantindo que faturamento_direto não seja undefined
const formSchema = z.object({
  tipo_pessoa: z.enum(['fisica', 'juridica', 'estrangeira']),
  documento: z.string().min(5, "Documento obrigatório"),
  perfil: z.string().min(1, "Selecione um perfil"),
  faturamento_direto: z.boolean(),
  razao_social: z.string().optional(),
  nome: z.string().optional(),
  nome_fantasia: z.string().optional(),
});

export function CompanyForm() {
  const { toast } = useToast();
  const [tipo, setTipo] = useState<'fisica' | 'juridica' | 'estrangeira'>('juridica');
  const [files, setFiles] = useState<{ obrigatorio?: File; opcional?: File }>({});

  // 3. Inicialização do Form com a Interface e Default Values completos
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo_pessoa: 'juridica',
      documento: '',
      perfil: 'Novo usuário',
      faturamento_direto: false,
      razao_social: '',
      nome: '',
      nome_fantasia: '',
    },
  });

  async function onSubmit(values: CompanyFormValues) {
    if (!files.obrigatorio) {
      return toast({ 
        variant: "destructive", 
        title: "Arquivo ausente", 
        description: "Envie o documento obrigatório." 
      });
    }

    const formData = new FormData();
    // Adiciona todos os valores de texto
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    formData.append('documento_obrigatorio', files.obrigatorio);
    if (files.opcional) formData.append('documento_opcional', files.opcional);

    try {
      await api.post('/empresas', formData);
      toast({ title: "Sucesso", description: "Empresa cadastrada com sucesso!" });
      form.reset();
      setFiles({});
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Erro", 
        description: error.response?.data?.message || "Erro no cadastro" 
      });
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Cadastro de Empresa</CardTitle>
        <CardDescription>Preencha os dados conforme o tipo de pessoa.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="tipo_pessoa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Pessoa</FormLabel>
                  <Select 
                    onValueChange={(v: any) => {
                      field.onChange(v);
                      setTipo(v);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                      <SelectItem value="fisica">Pessoa Física</SelectItem>
                      <SelectItem value="estrangeira">Estrangeira</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {tipo === 'juridica' ? (
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="razao_social" render={({ field }) => (
                  <FormItem><FormLabel>Razão Social</FormLabel><Input {...field} /></FormItem>
                )} />
                <FormField control={form.control} name="nome_fantasia" render={({ field }) => (
                  <FormItem><FormLabel>Nome Fantasia</FormLabel><Input {...field} /></FormItem>
                )} />
              </div>
            ) : (
              <FormField control={form.control} name="nome" render={({ field }) => (
                <FormItem><FormLabel>Nome Completo</FormLabel><Input {...field} /></FormItem>
              )} />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="documento" render={({ field }) => (
                <FormItem><FormLabel>Documento (CPF/CNPJ)</FormLabel><Input {...field} /></FormItem>
              )} />
              <FormField control={form.control} name="perfil" render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Novo usuário">Novo usuário</SelectItem>
                      <SelectItem value="Cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
            </div>

            <div className="space-y-4">
               <Label>Documentação (Upload)</Label>
               <Input type="file" onChange={(e) => setFiles({ ...files, obrigatorio: e.target.files?.[0] })} />
            </div>

            <Button type="submit" className="w-full">Cadastrar Empresa</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}