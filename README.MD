# Livreiro

**Livreiro** é uma aplicação web onde usuários podem registrar e acompanhar livros que já leram, estão lendo ou planejam ler. Permite login, registro, busca de livros via API, adição com capa, descrição, gênero, datas, progresso de leitura, notas e review pessoal.

**Site online:** [https://livreiro.up.railway.app](https://livreiro.up.railway.app)

## Funcionalidades

- Registro e login de usuário com autenticação via JWT
- Busca de livros usando a API do Google Books
- Adição de livros com dados automáticos da API (título, autor, capa, data, etc.)
- Lista de livros adicionados por cada usuário
- Edição de dados pessoais do livro: nota, progresso, review, datas
- Remoção de livros
- Interface com Tailwind CSS
- Deploy em nuvem com Docker + Railway

## Tecnologias Utilizadas

### Backend:

- Node.js + Express.js
- MongoDB + Mongoose
- JWT para autenticação
- Divisão em microsserviços:
  - `auth-service`: autenticação
  - `book-service`: gerenciamento de livros

### Frontend:

- React + Vite
- React Router DOM
- Tailwind CSS

### Integrações:

- API do Google Books (para busca e metadados dos livros)
- Railway (deploy em nuvem)
- Docker + Docker Compose

## 🗂 Estrutura do Projeto

```
Livreiro/
├── auth-service/
│   ├── routes/auth.js
│   ├── models/User.js
│   ├── server.js
│   └── ...
├── book-service/
│   ├── routes/books.js
│   ├── models/Book.js
│   ├── server.js
│   └── ...
├── frontend/
│   ├── src/pages/
│   ├── src/components/
│   ├── src/context/
│   └── ...
└── docker-compose.yml
```

## Como Rodar Localmente (com Docker)

### Pré-requisitos

- Docker
- Docker Compose

### Passos

```bash
git clone https://github.com/SamVeras/Livreiro.git
cd Livreiro
docker compose up --build
```

Acesse o sistema em: [http://localhost:4173](http://localhost:4173)

---

## Variáveis de Ambiente

As variáveis já estão definidas no `docker-compose.yml` e nos `.env` de cada serviço. Se quiser configurar manualmente:

### auth-service/.env

```env
MONGO_URI=mongodb://mongo:27017/auth
JWT_SECRET=sua_chave_jwt
```

### book-service/.env

```env
MONGO_URI=mongodb://mongo:27017/books
```

### frontend/.env

```env
VITE_API_AUTH=http://localhost:3001
VITE_API_BOOK=http://localhost:3002
```

---

## ☁️ Deploy em Produção

O projeto está hospedado na Railway.

- Railway detecta automaticamente o `docker-compose.yml`
- MongoDB roda como container com volume persistente
- Variáveis de ambiente podem ser configuradas pelo painel do Railway

---
