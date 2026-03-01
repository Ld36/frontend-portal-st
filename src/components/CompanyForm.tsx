'use client';

import { useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const formSchema = z.object({
  tipo_pessoa: z.enum(['fisica', 'juridica', 'estrangeira']),
  documento: z.string().min(5, "Documento obrigatório"),
  perfil: z.string().min(1, "Selecione um perfil"),
  faturamento_direto: z.boolean().default(false),
  razao_social: z.string().optional(),
  nome: z.string().optional(),
  nome_fantasia: z.string().min(1, "Nome fantasia é obrigatório"),
});

type CompanyFormValues = z.infer<typeof formSchema>;

export function CompanyForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [tipo, setTipo] = useState<'fisica' | 'juridica' | 'estrangeira'>('juridica');
  const [files, setFiles] = useState<{ obrigatorio?: File }>({});

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(formSchema) as Resolver<CompanyFormValues>,
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
        title: "Erro [M05]", 
        description: "O anexo do documento comprobatório é obrigatório." 
      });
    }

    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value)));
    formData.append('documento_obrigatorio', files.obrigatorio);

    try {
      await api.post('/empresas', formData);
      setShowSuccessModal(true); 
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Erro no registro", 
        description: error.response?.data?.message || "Erro ao processar cadastro." 
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.push('/dashboard'); 
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-t-4 border-t-blue-600">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastro de Empresa</CardTitle>
          <CardDescription>Portal de Homologação ST - Versão 1.0</CardDescription>
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
                    <Select onValueChange={(v: CompanyFormValues["tipo_pessoa"]) => { field.onChange(v); setTipo(v); }}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="juridica">Pessoa Jurídica (CNPJ)</SelectItem>
                        <SelectItem value="fisica">Pessoa Física (CPF)</SelectItem>
                        <SelectItem value="estrangeira">Pessoa Estrangeira (ID)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(tipo === 'juridica' || tipo === 'estrangeira') ? (
                  <FormField control={form.control} name="razao_social" render={({ field }) => (
                    <FormItem><FormLabel>Razão Social</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                ) : (
                  <FormField control={form.control} name="nome" render={({ field }) => (
                    <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                )}

                <FormField control={form.control} name="nome_fantasia" render={({ field }) => (
                  <FormItem><FormLabel>Nome Fantasia</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="documento" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tipo === 'juridica' ? 'CNPJ' : tipo === 'fisica' ? 'CPF' : 'Identificador Estrangeiro'}</FormLabel>
                    <FormControl><Input {...field} /></FormControl><FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="perfil" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil de Acesso</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Novo usuário">Novo usuário</SelectItem>
                        <SelectItem value="Transportadora">Transportadora</SelectItem>
                        <SelectItem value="Despachante">Despachante</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
              </div>

              {/* Faturamento Direto */}
              <FormField
                control={form.control}
                name="faturamento_direto"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-slate-50">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Desejo Faturamento Direto</FormLabel>
                      <FormDescription>Sujeito a análise de crédito posterior.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Anexar Documento Comprobatório</Label>
                <Input type="file" onChange={(e) => setFiles({ obrigatorio: e.target.files?.[0] })} />
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Salvar Cadastro"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Modal de Sucesso */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600 text-xl">Sucesso! [M01]</DialogTitle>
            <DialogDescription className="text-base py-4">
              O cadastro da empresa foi registrado com sucesso em nosso sistema.
              Sua solicitação aguarda agora a aprovação da equipe interna [RN03].
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseModal} className="w-full bg-green-600 hover:bg-green-700">
              Fechar e ir para o Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}