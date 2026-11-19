# Barbershop Management System

Sistema full-stack de gerenciamento e agendamento para barbearias, desenvolvido com arquitetura RESTful, autenticação baseada em JWT, controle de acesso por perfil (RBAC) e interface minimalista utilitária.

## Stack Tecnológica

**Back-end (`barbershop-api`)**
- Node.js + Express + TypeScript
- PostgreSQL (via Docker Compose) + Prisma ORM
- Autenticação JWT (`jsonwebtoken`) + Hash de senhas (`bcryptjs`)

**Front-end (`barbershop-web`)**
- React + TypeScript + Vite
- Tailwind CSS v4
- Axios (com interceptors para injeção automática de Bearer Token)
- React Router DOM (rotas públicas e guarda de rotas privadas)

## Funcionalidades
- Cadastro e autenticação de usuários com geração de token JWT.
- Proteção de rotas no back-end (middlewares de autenticação e permissão) e no front-end (`PrivateRoute`).
- Listagem da agenda do profissional e criação de novos agendamentos vinculados a serviços cadastrados.

## Como rodar o projeto localmente

### Pré-requisitos
- Node.js (v20+)
- Docker e Docker Compose

### 1. Configurar e iniciar o Back-end
```bash
cd barbershop-api

# Instalar dependências
npm install

# Subir o banco PostgreSQL via Docker
docker compose up -d

# Configurar variáveis de ambiente (copie o exemplo e ajuste se necessário)
cp .env.example .env

# Executar as migrations do Prisma
npx prisma migrate dev

# Iniciar o servidor da API (porta 3333)
npm run dev