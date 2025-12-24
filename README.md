

<h1 align="center">Lápida 🦋</h1>

<p align="center">
  <strong>Transforme pequenas ações em grandes hábitos. A organização pessoal inspirada no Efeito Borboleta.</strong>
</p>

  <a href="https://lapida-i2s2-8v5l1upuf-isabellas-projects-e928d57f.vercel.app/">
    <img src="https://img.shields.io/badge/deploy-Vercel-blue?style=for-the-badge&logo=vercel" alt="Deploy na Vercel"/>
  </a>
</p>

---

## ✨ Conceito

> Ferramentas de produtividade tradicionais focam apenas em tarefas, ignorando o poder dos hábitos e da reflexão. **Lápida** (do latim *lepidoptera*, a ordem das borboletas) resolve esse problema ao transformar a organização pessoal em uma jornada de autoconsciência.
>
> A aplicação ajuda o usuário a entender como pequenas ações consistentes — o bater de asas de uma borboleta — geram impactos significativos em sua vida.

---

## 🚀 Demonstração Online

A aplicação está disponível para acesso e teste em tempo real. Visite o link abaixo para experimentar o Lápida:

### ➡️ [**Acessar a Aplicação Online**](hhttps://lapida-i2s2-8v5l1upuf-isabellas-projects-e928d57f.vercel.app/)

---

## 📸 Telas da Aplicação

<table>
  <tr>
    <td align="center">
      <strong>Dashboard Principal</strong><br>
      <em>Visão geral das suas tarefas.</em>
    </td>
    <td align="center">
      <strong>Criação de Tarefa</strong><br>
      <em>Adicione novas tarefas de forma simples.</em>
    </td>
  </tr>

  <tr>
    <td>
      <img src="public/inicio.png" alt="Dashboard do Lápida" />
    </td>
    <td>
      <img src="public/criar.png" alt="Página de criação de tarefa" />
    </td>
  </tr>

  <tr>
    <td align="center">
      <strong>Edição de Tarefa</strong><br>
      <em>Ajuste os detalhes quando precisar.</em>
    </td>
    <td align="center">
      <strong>Landing Page</strong><br>
      <em>A porta de entrada para a transformação.</em>
    </td>
  </tr>

  <tr>
    <td>
      <img src="public/editar.png" alt="Página de edição de tarefa" />
    </td>
    <td>
      <img src="public/lp.png" alt="Landing Page do Lápida" />
    </td>
  </tr>
</table>


---

## 🚀 Funcionalidades Principais

-   **🔐 Autenticação Segura:** Cadastro e Login de usuários com `NextAuth.js v5`, utilizando `CredentialsProvider` e hashing de senhas com `bcrypt`.
-   **📝 Gerenciamento Completo de Tarefas (CRUD):**
    -   **Criação** de tarefas com título, descrição, data e categoria.
    -   **Leitura** e listagem de todas as tarefas do usuário autenticado.
    -   **Atualização** do status (pendente/concluída) e de todos os detalhes da tarefa.
    -   **Deleção** de tarefas com um clique.
-   **🏷️ Sistema de Categorias:**
    -   Crie categorias personalizadas para organizar sua vida.
    -   Associe tarefas a categorias existentes.
    -   Filtre suas tarefas por categoria no Dashboard para manter o foco.
-   **⚡ Experiência de Usuário Otimizada:**
    -   **Atualizações Otimistas (Optimistic Updates)** com `SWR` para ações de deletar e atualizar, fazendo a UI parecer instantânea.
    -   **Design Responsivo** que se adapta de uma visualização de tela cheia no mobile para uma "janela de OS" no desktop.
-   **🦋 Landing Page:** Uma página de apresentação elegante para introduzir o conceito do projeto a novos usuários.

---

## 🛠️ Stack de Tecnologias

Este projeto foi construído com uma stack moderna, performática e type-safe, focada em escalabilidade e uma excelente experiência de desenvolvimento.

| Categoria | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14 (App Router)** | Para Server Components, renderização híbrida e um backend integrado com API Routes. |
| **Linguagem** | **TypeScript** | Garante a segurança de tipos (`type-safety`) em toda a aplicação, do banco de dados ao frontend. |
| **Banco de Dados** | **PostgreSQL + Prisma** | PostgreSQL pela robustez. Prisma como ORM para um acesso ao banco de dados type-safe e migrações declarativas. |
| **Autenticação** | **NextAuth.js (v5)** | A solução padrão da indústria para autenticação em Next.js, gerenciando sessões de forma segura com JWTs. |
| **Estilização** | **Tailwind CSS + shadcn/ui** | Tailwind para estilização rápida e utilitária. `shadcn/ui` para componentes acessíveis e totalmente customizáveis. |
| **Formulários** | **React Hook Form + Zod** | `React Hook Form` para performance e `Zod` para validação de schemas, compartilhando a mesma lógica entre frontend e backend. |
| **Gerenciamento de Estado**| **Zustand** | Solução minimalista e poderosa para gerenciar estados globais, como filtros e a UI de modais. |
| **Data Fetching**| **SWR** | Para um data-fetching reativo e eficiente, com revalidação automática, cache e suporte nativo a Atualizações Otimistas. |

---

## ⚙️ Rodando o Projeto Localmente

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente de desenvolvimento.

**Pré-requisitos:** Node.js, npm/yarn/pnpm e uma instância do PostgreSQL rodando.

**1. Clone o repositório:**
```bash
git clone https://github.com/SEU-USUARIO-GITHUB/lapida-app.git
cd lapida-app
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Configure as Variáveis de Ambiente:**
Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
```bash
cp .env.example .env
```
Agora, abra o arquivo `.env` e preencha as variáveis:
```env
# URL de conexão com o seu banco de dados PostgreSQL.
# Exemplo: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="sua_connection_string_aqui"

# Chave secreta para a autenticação com NextAuth.js.
# Gere uma com o comando: openssl rand -base64 32
AUTH_SECRET="seu_auth_secret_aqui"
```

**4. Aplique as Migrações do Banco de Dados:**
Este comando criará as tabelas no seu banco de dados com base no schema do Prisma.
```bash
npx prisma migrate dev
```

**5. (Opcional) Popule o Banco com Dados Iniciais:**
Este comando executa o script de seed para criar categorias padrão (se houver).
```bash
npx prisma db seed
```

**6. Rode o Servidor de Desenvolvimento:**
```bash
npm run dev
```

🚀 A aplicação estará disponível em `http://localhost:3000`.

