export type TipoPessoa = 'fisica' | 'juridica' | 'estrangeira';

export enum StatusEmpresa {
  PENDENTE = 'PENDENTE',
  APROVADO = 'APROVADO',
  REPROVADO = 'REPROVADO',
}

export interface Empresa {
  id?: number;
  tipo_pessoa: TipoPessoa;
  documento: string;
  razao_social?: string;
  nome?: string;
  nome_fantasia?: string;
  perfil: string;
  faturamento_direto: boolean;
  status: StatusEmpresa;
  responsavel_externo?: string;
}