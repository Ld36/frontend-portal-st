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

O sistema requer conexão com API backend via variável de ambiente:

```bash
NEXT_PUBLIC_API_URL=https://backend-portal-st.onrender.com
```

Para desenvolvimento local, crie o arquivo `.env.local` na raiz do projeto com o valor acima (ou a URL da sua API local).

## Deploy do Frontend na Render

1. Acesse o dashboard da Render e clique em **New +** → **Web Service**.
2. Conecte o repositório do frontend (`frontend-portal-st`).
3. Configure:
	- **Environment**: `Node`
	- **Build Command**: `npm install ; npm run build`
	- **Start Command**: `npm run start`
4. Em **Environment Variables**, adicione:
	- `NEXT_PUBLIC_API_URL=https://backend-portal-st.onrender.com`
5. Salve e faça o deploy.

Após o deploy, o frontend já consumirá:
- Login: `POST /auth/login`
- Rotas protegidas com `Authorization: Bearer <token>` (já configurado no cliente HTTP)

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
