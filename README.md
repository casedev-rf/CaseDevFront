# 🏦 Multi Family Office - Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-cyan?logo=tailwindcss)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/React%20Query-5.90.2-red?logo=reactquery)](https://tanstack.com/query/)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-Primitives-purple?logo=radixui)](https://www.radix-ui.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.2.1-orange?logo=recharts)](https://recharts.org/)
[![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-7.63.0-pink?logo=reacthookform)](https://react-hook-form.com/)
[![Zod](https://img.shields.io/badge/Zod-4.x-ff69b4?logo=zod)](https://zod.dev/)
[![Axios](https://img.shields.io/badge/Axios-1.12.2-blueviolet?logo=axios)](https://axios-http.com/)
[![ESLint](https://img.shields.io/badge/ESLint-linting-purple?logo=eslint)](https://eslint.org/)
[![PostCSS](https://img.shields.io/badge/PostCSS-8.x-red?logo=postcss)](https://postcss.org/)

## ✨ Visão Geral

Frontend para Multi Family Office (MFO) — sistema completo de planejamento financeiro, projeção patrimonial, gestão de alocações, seguros e análise de cenários.

Desenvolvido em Next.js + React + TypeScript, com interface responsiva, sistema de temas, gráficos interativos e integração completa com API REST.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** + **TypeScript**
- **React 18** (hooks e context)
- **TailwindCSS** (styling utilitário)
- **React Query** (estado servidor e cache)
- **Radix UI** + **shadcn/ui** (componentes acessíveis)
- **Recharts** (gráficos interativos)
- **React Hook Form** + **Zod** (formulários e validação)
- **Axios** (cliente HTTP)
- **ESLint** (padronização de código)
- **PostCSS** + **Autoprefixer** (compatibilidade CSS)



## 📋 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠 Tecnologias](#-tecnologias)
- [🚀 Instalação](#-instalação)
- [📱 Demonstração](#-demonstração)
- [🏗 Arquitetura](#-arquitetura)
- [🎨 Design System](#-design-system)
- [📊 Componentes Principais](#-componentes-principais)
- [🔄 Estado e Cache](#-estado-e-cache)
- [📱 Responsividade](#-responsividade)
- [🌙 Temas](#-temas)
- [🔗 API Integration](#-api-integration)
- [🧪 Estrutura do Projeto](#-estrutura-do-projeto)
- [📈 Performance](#-performance)
- [🤝 Contribuição](#-contribuição)


## 🎯 Sobre o Projeto

O **Multi Family Office Frontend** é uma aplicação moderna e responsiva para gestão patrimonial, oferecendo ferramentas avançadas de projeção financeira, controle de alocações e análise de cenários. Desenvolvido com as mais recentes tecnologias do ecossistema React/Next.js.

### 🎪 Principais Diferenciais

- **🎯 Projeções Inteligentes**: Algoritmos avançados de projeção patrimonial
- **📊 Visualizações Dinâmicas**: Gráficos interativos com Recharts
- **🔄 Cenários Múltiplos**: Compare diferentes estratégias de investimento
- **📱 Mobile-First**: Interface totalmente responsiva
- **🌙 Dark/Light Mode**: Sistema de temas com persistência
- **⚡ Performance**: Otimizado com React Query e Next.js


## ✨ Funcionalidades

### 📊 **Projeções Patrimoniais**
- **Gráficos Interativos**: Visualização de crescimento patrimonial ao longo do tempo
- **Cenários Múltiplos**: Original, Atual e Otimizado
- **Status de Vida**: Projeções para cenários Vivo, Morto e Inválido
- **Timeline Visual**: Marcos importantes e eventos financeiros
- **Análise Comparativa**: Visualização com e sem seguros

### 💼 **Gestão de Alocações**
- **Alocações Manuais**: Controle granular de investimentos
- **Tipos de Ativos**: Financeiros e Imobilizados
- **Histórico Temporal**: Rastreamento de mudanças ao longo do tempo
- **Financiamentos**: Gestão de ativos financiados
- **Atualização Dinâmica**: Interface para ajustes rápidos

### 📈 **Histórico de Simulações**
- **Versionamento**: Controle de versões de simulações
- **Comparação**: Análise de diferentes cenários
- **Duplicação**: Clone simulações para testes
- **Navegação Integrada**: Acesso direto às projeções
- **Organização**: Interface clara e intuitiva

### 🛡️ **Gestão de Seguros**
- **Catálogo Completo**: Vida, Invalidez, Acidentes
- **Cálculos Automáticos**: Prêmios anuais e totais
- **Duração Flexível**: Controle de períodos de cobertura
- **Integração**: Impacto nas projeções patrimoniais
- **Resumos Inteligentes**: Visão consolidada

### 🎨 **Interface e UX**
- **Design System**: Componentes baseados em Radix UI e shadcn/ui
- **Responsividade**: Mobile-first com breakpoints inteligentes
- **Temas**: Dark/Light mode com persistência local
- **Acessibilidade**: ARIA labels e navegação por teclado
- **Feedback Visual**: Loading states e animações suaves


## 🛠 Tecnologias

### **🏗 Core Framework**
- **Next.js 14.2.33** - Framework React com App Router
- **React 18** - Biblioteca principal com Concurrent Features
- **TypeScript 5** - Tipagem estática para maior confiabilidade

### **🎨 Styling & UI**
- **Tailwind CSS 3.4.1** - Framework CSS utility-first
- **Radix UI** - Componentes primitivos acessíveis
- **shadcn/ui** - Componentes pré-construídos
- **Lucide React** - Ícones modernos e consistentes
- **CSS Variables** - Sistema de temas dinâmico

### **📊 Data & Charts**
- **Recharts 3.2.1** - Biblioteca de gráficos responsivos
- **React Query 5.90.2** - Gerenciamento de estado servidor
- **Axios 1.12.2** - Cliente HTTP com interceptors
- **date-fns 4.1.0** - Manipulação de datas

### **📝 Forms & Validation**
- **React Hook Form 7.63.0** - Formulários performáticos
- **Zod 4.1.11** - Validação de esquemas TypeScript-first
- **@hookform/resolvers** - Integração Zod + RHF

### **🎯 Developer Experience**
- **ESLint** - Linting de código
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Compatibilidade cross-browser

### **🔧 Utils & Helpers**
- **clsx** - Manipulação de classes CSS
- **tailwind-merge** - Merge inteligente de classes Tailwind
- **class-variance-authority** - Variantes de componentes


## 🚀 Instalação

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Backend API rodando

### **1. Clone o repositório**
```bash
git clone https://github.com/rodrigo-falcao/CaseDevFront.git
cd CaseDevFront
```

### **2. Instale as dependências**
```bash
npm install
# ou
yarn install
```

### **3. Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env.local
cp .env.example .env.local

# Configure a URL da API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### **4. Execute o projeto**
```bash
npm run dev
# ou
yarn dev
```

### **5. Acesse a aplicação**
```
http://localhost:3000
```

## 📱 Demonstração

### **🖥 Desktop View**
- Interface completa com sidebar e painéis expansivos
- Gráficos em tela cheia para análise detalhada
- Navegação por tabs para diferentes seções

### **📱 Mobile View**
- Design responsivo com componentes adaptáveis  
- Navegação otimizada para touch
- Gráficos redimensionados para telas pequenas
- Tabs com labels abreviadas

### **🌙 Temas**
- **Dark Mode**: Interface escura para uso noturno
- **Light Mode**: Interface clara para ambientes iluminados
- **Persistência**: Preferência salva no localStorage
- **Transições**: Mudanças suaves entre temas


## 🏗 Arquitetura

### **📁 Estrutura de Pastas**
```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Estilos globais e temas
│   ├── layout.tsx      # Layout raiz com providers
│   └── page.tsx        # Página principal
├── components/         # Componentes React
│   ├── ui/            # Componentes base (shadcn/ui)
│   ├── charts/        # Gráficos e visualizações
│   ├── projections/   # Componentes de projeção
│   ├── allocations/   # Gestão de alocações
│   ├── history/       # Histórico de simulações
│   ├── insurance/     # Gestão de seguros
│   └── timeline/      # Componente timeline
├── hooks/             # Custom hooks
│   ├── useSimulations.ts
│   ├── useAllocations.ts
│   └── useHistory.ts
├── lib/               # Utilitários e configurações
│   ├── api-client.ts  # Cliente API
│   ├── api.ts         # Configuração Axios
│   └── utils.ts       # Funções utilitárias
├── providers/         # Context providers
│   ├── query-provider.tsx
│   └── theme-provider.tsx
└── types/             # Definições TypeScript
    └── index.ts
```

### **🔄 Fluxo de Dados**
1. **UI Components** → Interação do usuário
2. **Custom Hooks** → Lógica de negócio e cache
3. **React Query** → Gerenciamento de estado servidor
4. **API Client** → Comunicação com backend
5. **TypeScript Types** → Tipagem em todo fluxo


## 🎨 Design System

### **🎨 Cores e Temas**
```css
/* Tema Escuro */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
--primary: 210 40% 98%;
--muted: 217.2 32.6% 17.5%;

/* Tema Claro */
--background: 0 0% 98%;
--foreground: 222.2 84% 4.9%;
--primary: 222.2 47.4% 11.2%;
--muted: 210 40% 96.1%;
```

### **📐 Breakpoints**
- **sm**: 640px - Mobile landscape
- **md**: 768px - Tablet
- **lg**: 1024px - Desktop
- **xl**: 1280px - Large desktop

### **🎭 Componentes Base**
- **Button**: Variantes primary, secondary, outline, ghost
- **Card**: Container principal para seções
- **Dialog**: Modais e overlays
- **Select**: Dropdowns customizados
- **Tabs**: Navegação por seções


## 📊 Componentes Principais

### **📈 ProjectionChart**
```tsx
<ProjectionChart 
  data={projectionData}
  activeScenario="current"
  showComparison={true}
  lifeStatus="Vivo"
/>
```
- Gráfico interativo com Recharts
- Múltiplas linhas para diferentes tipos de patrimônio
- Tooltips informativos e legendas dinâmicas

### **🏦 AllocationsView**
```tsx
<AllocationsView />
```
- Timeline de alocações manuais
- Filtros por tipo (financeira/imobilizada)
- Interface para adição e edição

### **📊 Timeline**
```tsx
<Timeline 
  projectionData={data}
  lifeStatus="Vivo"
  startYear={2025}
  endYear={2060}
/>
```
- Visualização temporal de marcos
- Eventos de entrada e saída
- Indicadores de crescimento patrimonial

### **🛡️ InsuranceList**
```tsx
<InsuranceList versionId={versionId} />
```
- Catálogo de seguros ativos
- Cálculos de prêmios e cobertura
- Interface para gestão completa


## 🔄 Estado e Cache

### **React Query Configuration**
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
    },
  },
});
```

### **Custom Hooks Pattern**
```tsx
// Exemplo: useSimulations
export function useSimulations() {
  return useQuery({
    queryKey: ['simulations'],
    queryFn: simulationApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
}
```

### **Cache Invalidation**
- Invalidação automática após mutations
- Invalidação inteligente por dependências
- Otimistic updates para melhor UX


## 📱 Responsividade

### **Mobile-First Approach**
```tsx
// Exemplo de classes responsivas
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
  <Card className="p-3 sm:p-4">
    <h1 className="text-xl sm:text-2xl lg:text-3xl">
      Multi Family Office
    </h1>
  </Card>
</div>
```

### **Componentes Adaptáveis**
- **Navigation**: Tabs com labels abreviadas no mobile
- **Charts**: Altura e margens responsivas
- **Forms**: Layout adaptável para diferentes telas
- **Tables**: Scroll horizontal em telas pequenas


## 🌙 Temas

### **Theme Provider**
```tsx
<ThemeProvider defaultTheme="dark">
  <App />
</ThemeProvider>
```

### **Theme Toggle**
```tsx
<ThemeToggle />
// Botão com ícones Sol/Lua
// Persistência no localStorage
// Transições suaves
```

### **CSS Variables System**
- Variáveis dinâmicas para cores
- Transições automáticas entre temas
- Suporte para temas customizados


## 🔗 API Integration

### **Axios Configuration**
```tsx
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### **API Client Pattern**
```tsx
export const simulationApi = {
  getAll: () => api.get('/simulations'),
  create: (data) => api.post('/simulations', data),
  getProjection: (id, status) => 
    api.post(`/simulations/${id}/projection`, { status }),
};
```

### **Error Handling**
- Interceptors para tratamento global
- Fallbacks para dados offline
- Loading states consistentes


## 🧪 Estrutura do Projeto

### **Componentização**
```
components/
├── ui/              # Componentes primitivos
├── feature/         # Componentes de funcionalidade
├── layout/          # Componentes de layout
└── composite/       # Componentes compostos
```

### **Type Safety**
```tsx
// Tipos bem definidos
interface ProjectionData {
  year: number;
  totalPatrimony: number;
  financialPatrimony: number;
  immobilizedPatrimony: number;
  totalWithoutInsurance: number;
}
```

### **Custom Hooks**
- Separação de lógica e apresentação
- Reutilização entre componentes
- Testes unitários facilitados


## 📈 Performance

### **Otimizações Implementadas**
- **Next.js App Router**: Roteamento otimizado
- **React Query**: Cache inteligente
- **Code Splitting**: Carregamento sob demanda
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Google Fonts com Next.js

### **Métricas de Performance**
- **Lighthouse Score**: 90+ em todas as categorias
- **Core Web Vitals**: Otimizado para UX
- **Bundle Size**: Otimizado com tree-shaking


## 🤝 Contribuição

### **Como Contribuir**
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

### **Padrões de Código**
- TypeScript para type safety
- ESLint para consistência
- Componentes funcionais com hooks
- Props tipadas com interfaces

### **Estrutura de Commits**
```
feat: adiciona nova funcionalidade
fix: corrige bug existente  
docs: atualiza documentação
style: mudanças de formatação
refactor: refactoring de código
test: adiciona ou modifica testes
```


<div align="center">

**Feito com ❤️ e ⚡ por [Rodrigo Falcão]**

![TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-blue?style=flat&logo=typescript)
![Next.js](https://img.shields.io/badge/Powered%20by-Next.js-black?style=flat&logo=next.js)
![TailwindCSS](https://img.shields.io/badge/Styled%20with-Tailwind-06B6D4?style=flat&logo=tailwindcss)


</div>
