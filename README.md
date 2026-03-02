# Frontend Portal ST

Portal de Homologação ST - Sistema de cadastro e aprovação de empresas para certificação digital.

## Descrição

Sistema web desenvolvido em Next.js para gestão de cadastros de empresas que necessitam de homologação ST (Selo de Tempo). Permite cadastro externo de empresas e aprovação/reprovação via painel administrativo.

## Funcionalidades

### Portal Externo
- Cadastro de empresas (Pessoa Física, Jurídica, Estrangeira)
- Consulta de status de aprovação
- Upload de documentos obrigatórios
- Interface responsiva e intuitiva

### Painel Administrativo  
- Login seguro para administradores
- Listagem completa de empresas cadastradas
- Aprovação/reprovação de cadastros
- Controle de status em tempo real

## Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Estilo**: Tailwind CSS + Shadcn/ui
- **Validação**: Zod + React Hook Form
- **Notificações**: Sonner Toast
- **Ícones**: Lucide React
- **TypeScript**: Tipagem completa

## Instalação

```bash
# Clonar repositório
git clone <repo-url>
cd frontend-portal-st

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## Configuração

O sistema requer conexão com API backend. Configure a URL base em:
```typescript
// src/services/api.ts
baseURL: 'http://localhost:8000/api' // Ajuste conforme necessário
```

## Estrutura do Projeto

```
src/
├── app/          # Páginas Next.js (App Router)
├── components/   # Componentes React
├── hooks/        # Hooks customizados
├── lib/          # Utilitários
├── services/     # Integrações API
└── types/        # Definições TypeScript
```

## Acesso Administrativo

Para acessar o painel administrativo:
- Via Sidebar: Clique em "Login Admin"  
- Via URL: Adicione `?z_admin=true` à URL

## Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código
