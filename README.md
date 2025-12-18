# Lápida 🦋

> A to-do list inteligente inspirada no Efeito Borboleta, onde pequenas ações diárias geram grandes transformações pessoais.

![Project Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![GitHub Last Commit](https://img.shields.io/github/last-commit/seu-usuario-github/lapida-app)

## ✨ Conceito

Ferramentas de produtividade tradicionais focam apenas em tarefas, ignorando o poder dos hábitos e da reflexão. **Lápida** (do latim *lepidoptera*, a ordem das borboletas) resolve esse problema ao transformar a organização pessoal em uma jornada de autoconsciência.

Utilizando IA, a aplicação analisa padrões de comportamento para fornecer insights sutis e motivacionais, ajudando o usuário a entender como pequenas ações consistentes — o bater de asas de uma borboleta — geram impactos significativos em sua vida.

---

## 📸 Screenshots

_**Instrução:** Substitua os links abaixo pelos seus próprios screenshots. Recomendo usar uma ferramenta como o [CleanShot X](https://cleanshot.com/) ou a ferramenta de captura do seu sistema operacional para tirar belas imagens._

<table>
  <tr>
    <td align="center"><strong>Dashboard Principal</strong></td>
    <td align="center"><strong>Criação de Tarefa</strong></td>
  </tr>
  <tr>
    <td><img src="URL_DA_SUA_IMAGEM_DASHBOARD.png" alt="Dashboard do Lápida" /></td>
    <td><img src="URL_DA_SUA_IMAGEM_CRIAR_TAREFA.png" alt="Página de criação de tarefa" /></td>
  </tr>
</table>

---

## 🚀 Funcionalidades Implementadas

-   **Autenticação Completa:** Cadastro e Login de usuários com `NextAuth.js v5`, utilizando `CredentialsProvider` e hashing de senhas com `bcrypt`.
-   **Gerenciamento de Tarefas (CRUD):**
    -   **Criação** de tarefas com título, descrição, data e categoria.
    -   **Leitura** e listagem de todas as tarefas do usuário autenticado.
    -   **Atualização** do status (pendente/concluída) e dos detalhes da tarefa.
    -   **Deleção** de tarefas.
-   **Gerenciamento de Categorias:**
    -   Criação de categorias customizadas.
    -   Associação de tarefas a categorias.
    -   Filtragem de tarefas por categoria no Dashboard.
-   **Experiência de Usuário Otimizada:**
    -   **Atualizações Otimistas (Optimistic Updates)** com `SWR` para ações de deletar e atualizar, fazendo a UI parecer instantânea.
    -   **Design Responsivo** que se adapta de uma visualização de tela cheia no mobile para uma "janela de OS" no desktop.
-   **Landing Page:** Página de apresentação do projeto para novos usuários.

---

## 🔧 Stack de Tecnologias

Este projeto foi construído com uma stack moderna, performática e altamente requisitada no mercado, com foco em type-safety e escalabilidade.

| Categoria | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14 (App Router)** | Para aproveitar Server Components, renderização híbrida e um backend integrado com API Routes. |
| **Linguagem** | **TypeScript** | Garante a segurança de tipos (`type-safety`) em toda a aplicação, do banco de dados ao frontend. |
| **Banco de Dados** | **PostgreSQL + Prisma** | PostgreSQL pela robustez. Prisma como ORM para um acesso ao banco de dados totalmente type-safe e migrações declarativas. |
| **Autenticação** | **NextAuth.js (v5)** | A solução padrão da indústria para autenticação em Next.js, gerenciando sessões de forma segura com JWTs. |
| **Estilização** | **Tailwind CSS + shadcn/ui** | Tailwind para uma estilização rápida e utilitária. `shadcn/ui` para componentes acessíveis e não-opinativos, totalmente customizáveis. |
| **Formulários** | **React Hook Form + Zod** | `React Hook Form` para performance. `Zod` para validação de schemas, compartilhando a mesma lógica entre frontend e backend. |
| **Gerenciamento de Estado**| **Zustand** | Uma solução minimalista e poderosa para gerenciar estados globais, como filtros e a UI de modais. |
| **Data Fetching**| **SWR** | Para um data-fetching reativo e eficiente, com revalidação automática, cache e suporte nativo a Atualizações Otimistas. |

---

## ⚙️ Rodando o Projeto Localmente

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente de desenvolvimento.

**1. Clone o repositório:**
```bash
git clone https://github.com/SEU-USUARIO-GITHUB/lapida-app.git
cd lapida-app
2. Instale as dependências:
code
Bash
npm install
3. Configure as Variáveis de Ambiente:
Crie uma cópia do arquivo .env.example e renomeie para .env. Preencha as variáveis necessárias.
code
Bash
cp .env.example .env
Dentro do .env, você precisará configurar:
DATABASE_URL: A URL de conexão do seu banco de dados PostgreSQL.
AUTH_SECRET: Uma chave secreta para o NextAuth.js. Você pode gerar uma com openssl rand -hex 32.
4. Aplique as Migrações do Banco de Dados:
Este comando irá criar as tabelas no seu banco de dados com base no schema do Prisma.
code
Bash
npx prisma migrate dev
5. (Opcional) Popule o Banco com Dados Iniciais:
Este comando executa o script de seed para criar as categorias padrão. Certifique-se de ter criado um usuário primeiro.
code
Bash
npx prisma db seed
6. Rode o Servidor de Desenvolvimento:
code
Bash
npm run dev
Acesse http://localhost:3000 no seu navegador para ver a aplicação.
code
Code
#### **2. Arquivo `.env.example`**

Crie este novo arquivo na raiz do seu projeto.

**File Name:** `.env.example`

```env
# URL de conexão com o banco de dados PostgreSQL.
# Exemplo: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL=""

# Chave secreta para a autenticação com NextAuth.js.
# Gere uma com: openssl rand -base64 32
AUTH_SECRET=""