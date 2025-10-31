# 🍽️ Restaurante Analytics

Um sistema completo de **análise de desempenho para redes de restaurantes**, com painel interativo, API Node.js e integração com banco PostgreSQL.  
Permite visualizar **faturamento**, **pedidos**, **ticket médio**, **cancelamentos**, **vendas por dia**, **produtos mais vendidos** e **comparação entre lojas**.

---

## 🚀 Visão Geral

O projeto é dividido em **frontend** e **backend**:

| Camada | Arquivo principal | Descrição |
|--------|-------------------|------------|
| 🖥️ Frontend | `app.js`, `api.js` | Painel interativo em JavaScript puro (sem frameworks) |
| ⚙️ Backend | `server.js`, `db.js` | API REST em Express.js conectada ao PostgreSQL |

---

## 🧩 Estrutura do Projeto

📦 restaurante-analytics

┣ 📜 app.js # Frontend principal (UI e lógica do dashboard)

┣ 📜 api.js # Cliente HTTP para comunicação com backend

┣ 📜 server.js # Servidor Express com rotas /api/*

┣ 📜 db.js # Conexão e queries com banco PostgreSQL

┣ 📜 populate-db.js # (opcional) script de geração de dados mock

┗ 📄 README.md

---

## 🖥️ Frontend (`app.js` + `api.js`)

### 📊 Objetivo
O frontend é um painel de controle interativo construído com **JavaScript puro (ES6)**.  
Ele se conecta ao backend via `fetch()` e exibe gráficos, tabelas e indicadores de desempenho (KPIs).

---

### 🔌 `api.js` – Cliente de API

#### Funções principais:
- `fetchStores()` → lista de lojas  
- `fetchChannels()` → lista de canais de venda  
- `fetchKpis({ store, channel, range })` → KPIs do período  
- `fetchDailySales({ store, channel, range })` → vendas diárias  
- `fetchTopProducts({ store, channel, range, limit })` → produtos mais vendidos  

A URL base é configurada via variável global `BACKEND_URL` ou padrão `http://localhost:8000`.

---

### 🎨 `app.js` – Dashboard interativo

#### Principais componentes:

| Função | Descrição |
|--------|------------|
| `renderFilters()` | Cria filtros de loja, canal e período |
| `renderKPIs()` | Mostra indicadores principais (faturamento, pedidos, ticket, cancelamentos) |
| `renderBarChart()` | Gera gráfico de barras de vendas diárias |
| `renderTopProductsTable()` | Exibe tabela dos produtos mais vendidos |
| `renderCompareBarChart()` | Mostra gráfico comparativo entre lojas |
| `exportCSV()` | Exporta dados visualizados em formato `.csv` |

#### Recursos extras:
- Formatação BRL (`R$ 1.234,56`)
- Tooltips nos gráficos
- Filtros dinâmicos
- Exportação CSV com cabeçalhos em português
- Suporte a **comparação entre duas lojas**

---

## ⚙️ Backend (`server.js` + `db.js`)

### 🧠 Estrutura
O backend é construído em **Node.js + Express.js**, com queries SQL otimizadas via `pg`.

#### Principais endpoints REST:
| Método | Endpoint | Descrição |
|--------|-----------|-----------|
| `GET /health` | Status do servidor |
| `GET /api/stores` | Lista de lojas |
| `GET /api/channels` | Lista de canais de venda |
| `GET /api/kpis` | KPIs do período (faturamento, pedidos, etc.) |
| `GET /api/sales/daily` | Vendas diárias (para gráficos) |
| `GET /api/products/top` | Produtos mais vendidos |

---

### 🧩 `server.js`

#### Recursos:
- Middleware `cors` e `dotenv`  
- Função `buildFilters()` → adiciona condições SQL dinâmicas (store, channel)  
- Função `parseRange()` → converte períodos (`7d`, `30d`, `90d`)  
- Consultas SQL otimizadas com `JOIN`, `GROUP BY` e filtros por período  

#### Exemplo de retorno de `/api/kpis`:
```json
{
  "revenue": 50234.75,
  "orders": 1423,
  "aov": 35.31,
  "cancelRate": 0.03
}
🗄️ db.js
Gerencia a conexão com PostgreSQL via pg.Pool.

Configuração via variáveis de ambiente:
Variável	Exemplo	Descrição
PGHOST	localhost	Host do banco
PGPORT	5432	Porta
PGDATABASE	challenge_db	Nome do banco
PGUSER	challenge	Usuário
PGPASSWORD	challenge	Senha

A função query(text, params) executa comandos SQL e mede a duração, registrando queries lentas (>200ms).

💾 Banco de Dados
Tabelas esperadas:

Tabela	Campos principais
stores	id, name, city, is_active
channels	id, name
sales	id, store_id, channel_id, total_amount, created_at, sale_status_desc
products	id, name, category_id
product_sales	sale_id, product_id, quantity, total_price

🔧 Configuração e Execução
🐘 1. Banco de Dados
Crie o banco PostgreSQL e, se desejar, use o script populate-db.js para gerar dados fictícios:

bash
Copiar código
node populate-db.js "postgresql://usuario:senha@host:5432/database"
⚙️ 2. Backend
Instale dependências e rode o servidor:

bash
Copiar código
npm install
node server.js
Por padrão, o backend roda em http://localhost:8000.

🖥️ 3. Frontend
Basta abrir o arquivo index.html (que importa app.js e api.js) no navegador.
Defina a variável global para apontar ao backend:

html
Copiar código
<script>
  window.BACKEND_URL = 'http://localhost:8000';
</script>
📈 Funcionalidades Principais
✅ Indicadores de performance (KPIs)
✅ Filtro por loja, canal e período
✅ Comparação entre lojas
✅ Gráficos de vendas diárias
✅ Tabela de produtos mais vendidos
✅ Exportação CSV com valores formatados
✅ Layout responsivo e intuitivo

🧠 Tecnologias Usadas
Frontend: JavaScript (ES6), HTML, CSS

Backend: Node.js + Express.js

Banco: PostgreSQL

Outros: dotenv, cors, pg

🧾 Licença
MIT © 2025 — Desenvolvido para fins educacionais e demonstração analítica.
