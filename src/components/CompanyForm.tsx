'use client';

import { useRef, useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/services/api';
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
}).superRefine((values, ctx) => {
  if (values.tipo_pessoa === 'fisica' && !values.nome?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['nome'], message: 'Nome é obrigatório' });
  }

  if ((values.tipo_pessoa === 'juridica' || values.tipo_pessoa === 'estrangeira') && !values.razao_social?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['razao_social'], message: 'Razão Social é obrigatória' });
  }
});

type CompanyFormValues = z.infer<typeof formSchema>;

interface CompanyFormProps {
  onSuccess?: () => void;
}

export function CompanyForm({ onSuccess }: CompanyFormProps) {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showRemoveFileModal, setShowRemoveFileModal] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoDescription, setInfoDescription] = useState('');
  const [fileToRemove, setFileToRemove] = useState<'obrigatorio' | 'opcional' | null>(null);
  const [tipo, setTipo] = useState<'fisica' | 'juridica' | 'estrangeira'>('juridica');
  const [files, setFiles] = useState<{ obrigatorio?: File; opcional?: File }>({});
  const [requiredInputKey, setRequiredInputKey] = useState(0);
  const [optionalInputKey, setOptionalInputKey] = useState(0);
  const requiredFileInputRef = useRef<HTMLInputElement | null>(null);
  const optionalFileInputRef = useRef<HTMLInputElement | null>(null);

  const openInfoModal = (title: string, description: string) => {
    setInfoTitle(title);
    setInfoDescription(description);
    setShowInfoModal(true);
  };

  const requestRemoveFile = (type: 'obrigatorio' | 'opcional') => {
    setFileToRemove(type);
    setShowRemoveFileModal(true);
  };

  const confirmRemoveFile = () => {
    if (!fileToRemove) return;
    setFiles((prev) => ({ ...prev, [fileToRemove]: undefined }));

    if (fileToRemove === 'obrigatorio') {
      if (requiredFileInputRef.current) requiredFileInputRef.current.value = '';
      setRequiredInputKey((prev) => prev + 1);
    }

    if (fileToRemove === 'opcional') {
      if (optionalFileInputRef.current) optionalFileInputRef.current.value = '';
      setOptionalInputKey((prev) => prev + 1);
    }

    setShowRemoveFileModal(false);
    setFileToRemove(null);
  };

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
      openInfoModal('Aviso', 'É necessário enviar os arquivos obrigatórios para prosseguir.');
      return;
    }

    const onlyDigits = (values.documento || '').replace(/\D/g, '');
    if (values.tipo_pessoa === 'juridica' && onlyDigits.length !== 14) {
      openInfoModal('Atenção', 'CNPJ inválido.');
      return;
    }

    if (values.tipo_pessoa === 'fisica' && onlyDigits.length !== 11) {
      openInfoModal('Atenção', 'CPF inválido.');
      return;
    }

    const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
    const requiredFileName = files.obrigatorio.name.toLowerCase();
    const requiredValidExtension = validExtensions.some((ext) => requiredFileName.endsWith(ext));

    if (!requiredValidExtension) {
      openInfoModal('Arquivo inválido', 'São válidos somente arquivos do tipo: pdf, png, jpg ou jpeg.');
      return;
    }

    if (files.obrigatorio.size > MAX_FILE_SIZE) {
      openInfoModal('Arquivo inválido', 'Tamanho de arquivo não suportado.');
      return;
    }

    if (files.opcional) {
      const optionalFileName = files.opcional.name.toLowerCase();
      const optionalValidExtension = validExtensions.some((ext) => optionalFileName.endsWith(ext));

      if (!optionalValidExtension) {
        openInfoModal('Arquivo inválido', 'São válidos somente arquivos do tipo: pdf, png, jpg ou jpeg.');
        return;
      }

      if (files.opcional.size > MAX_FILE_SIZE) {
        openInfoModal('Arquivo inválido', 'Tamanho de arquivo não suportado.');
        return;
      }

      const isDuplicateFile =
        files.opcional.name === files.obrigatorio.name &&
        files.opcional.size === files.obrigatorio.size &&
        files.opcional.lastModified === files.obrigatorio.lastModified;

      if (isDuplicateFile) {
        openInfoModal('Arquivo duplicado', 'Arquivo duplicado.');
        return;
      }
    }

    setIsSubmitting(true);
    const formData = new FormData();

    const payload: Record<string, string | boolean> = {
      tipo_pessoa: values.tipo_pessoa,
      documento: values.documento,
      perfil: values.perfil,
      faturamento_direto: values.faturamento_direto,
      nome_fantasia: values.nome_fantasia,
    };

    if (values.tipo_pessoa === 'fisica') {
      payload.nome = values.nome?.trim() || '';
    } else {
      payload.razao_social = values.razao_social?.trim() || '';
      payload.nome = values.razao_social?.trim() || '';
    }

    Object.entries(payload).forEach(([key, value]) => {
      if (typeof value === 'string' && !value.trim()) return;
      formData.append(key, String(value));
    });

    formData.append('documento_obrigatorio', files.obrigatorio);
    if (files.opcional) {
      formData.append('documento_opcional', files.opcional);
    }

    try {
      await api.post('/empresas', formData);
      setShowSuccessModal(true);
    } catch (error: any) {
      const backendMessage = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(' ')
        : String(error.response?.data?.message || 'Erro ao processar cadastro.');

      if (backendMessage.toLowerCase().includes('perfil') && backendMessage.toLowerCase().includes('encontr')) {
        openInfoModal('Atenção', 'Ocorreu um erro ao encontrar o perfil.');
      } else {
        openInfoModal('Atenção', backendMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    onSuccess?.(); // Chama o callback para mudar para a tela de status
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
                        <SelectItem value="Beneficiário">Beneficiário</SelectItem>
                        <SelectItem value="Consignatário">Consignatário</SelectItem>
                        <SelectItem value="Armador">Armador</SelectItem>
                        <SelectItem value="Agente de Carga">Agente de Carga</SelectItem>
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
                <Input
                  key={requiredInputKey}
                  ref={requiredFileInputRef}
                  type="file"
                  onChange={(e) => setFiles((prev) => ({ ...prev, obrigatorio: e.target.files?.[0] }))}
                />
                {files.obrigatorio && (
                  <div className="flex items-center justify-between rounded-md border p-2 text-sm">
                    <span className="truncate pr-3">{files.obrigatorio.name}</span>
                    <Button type="button" size="sm" variant="outline" onClick={() => requestRemoveFile('obrigatorio')}>
                      Remover
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Anexar Documento Opcional</Label>
                <Input
                  key={optionalInputKey}
                  ref={optionalFileInputRef}
                  type="file"
                  onChange={(e) => setFiles((prev) => ({ ...prev, opcional: e.target.files?.[0] }))}
                />
                {files.opcional && (
                  <div className="flex items-center justify-between rounded-md border p-2 text-sm">
                    <span className="truncate pr-3">{files.opcional.name}</span>
                    <Button type="button" size="sm" variant="outline" onClick={() => requestRemoveFile('opcional')}>
                      Remover
                    </Button>
                  </div>
                )}
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
            <DialogTitle className="text-green-600 text-xl">Sucesso</DialogTitle>
            <DialogDescription className="text-base py-4">
              Empresa cadastrada com sucesso.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseModal} className="w-full bg-green-600 hover:bg-green-700">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{infoTitle}</DialogTitle>
            <DialogDescription className="text-base py-2">{infoDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowInfoModal(false)} className="w-full">Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRemoveFileModal} onOpenChange={setShowRemoveFileModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover arquivo</DialogTitle>
            <DialogDescription className="text-base py-2">Deseja realmente remover este arquivo?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemoveFileModal(false)}>Cancelar</Button>
            <Button onClick={confirmRemoveFile}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}