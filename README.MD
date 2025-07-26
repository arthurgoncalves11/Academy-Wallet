# Academy Wallet

## Backend

### 📌 Sobre

Este documento contém as instruções para configurar e executar o backend do projeto **Academy Wallet**.

### 🛠 Pré-requisitos

Antes de iniciar, certifique-se de ter os seguintes requisitos instalados:

- [Docker](https://www.docker.com/)
  - Instalar o Docker
  - Reiniciar o computador após a instalação (será solicitado após a instalação)
  - Criar uma conta ou fazer login
  - Deixar o docker aberto

### 🚀 Passos para rodar o backend

#### 1️⃣ Clonar o repositório

- Criar uma nova pasta
- Abrir o terminal na pasta recém criada
- Clonar o reopsitório:

```sh
git clone https://premiersoftbr@dev.azure.com/premiersoftbr/Premiersoft.Academy2025/_git/academy-wallet
```

Ir para a pasta do backend:

```sh
cd academy-wallet/backend
```

#### 2️⃣ Atualizar o código

Achar as alterações:

```sh
git fetch
```

Pegar as alterações:

```sh
git pull origin master
```

#### 3️⃣ Pegar arquivo .env com ADMs

Dentro da pasta do backend, crie um arquivo com nome `.env` e cole o .env pego.

#### 4️⃣ Iniciar o Docker

###### Certifique-se de que o Docker está instalado e em execução.

Execute o seguinte comando para subir os containers:

```sh
docker compose up
```

Após iniciar o backend, abra o navegador e acesse `${process.env.API_URL}/api` para testar a API pelo Swagger.

#### 5️⃣ Popular o banco de dados

Para não parar a execução do nest, abra outro terminal na pasta do backend.

A tabela market-shares será fixa e populada apenas uma vez, o seguinte comando fará o insert no banco das informações das ações:

```sh
pnpm run seed
```

### ❌ Troubleshooting (Solução de problemas)

#### ⚠️ **Se houver cache no Docker, resetar o banco de dados**

1. **Listar os containers em execução:**
   ```sh
   docker ps
   ```
2. **Obter o ID do container do banco de dados e parar o container:**
   ```sh
   docker stop <ID_DO_CONTAINER>
   ```
3. **Remover o container do banco de dados:**
   ```sh
   docker remove <ID_DO_CONTAINER>
   ```
4. **Listar os volumes do Docker:**
   ```sh
   docker volume ls
   ```
5. **Identificar o volume relacionado ao banco de dados (`backend_postgres_data`) e removê-lo:**
   ```sh
   docker volume rm <NOME_DO_VOLUME>
   ```

Após isso, reinicie os serviços do backend e o Docker:

```sh
docker compose up -d
```

Caso os problemas persistam, verifique os logs do Docker com:

```sh
docker logs <ID_DO_CONTAINER>
```

## Frontend

_(Ainda não há conteúdo nesta seção.)_
