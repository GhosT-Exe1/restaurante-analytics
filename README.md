
# 🧠 Documentação do Script `populate-db.js`

## 📋 O que é
Este script **gera dados falsos (mock)** para preencher um banco de dados PostgreSQL com informações de um sistema de restaurante.  
Ele cria **lojas, produtos, clientes, vendas, canais de venda, marcas, sub-marcas e muito mais**.

Ideal para testar painéis analíticos, relatórios e dashboards sem precisar de dados reais.

---

## 🚀 Como usar

### 1️⃣ Pré-requisitos
- Node.js instalado  
- Banco PostgreSQL criado e acessível  
- Tabelas já criadas (o script **não cria tabelas**, apenas insere dados)

### 2️⃣ Execução
No terminal:
```bash
node populate-db.js "postgresql://usuario:senha@host:5432/database"
```

Ou usando variável de ambiente:
```bash
DATABASE_URL="postgresql://usuario:senha@host:5432/database" node populate-db.js
```

**Exemplo (Supabase):**
```bash
node populate-db.js "postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres?sslmode=require"
```

---

## ⚙️ Configuração principal
```js
const config = {
  stores: 50,       // Quantas lojas serão criadas
  products: 500,    // Quantos produtos
  items: 200,       // (não usado diretamente)
  customers: 10000, // Quantos clientes
  months: 6,        // Quantos meses de histórico de vendas gerar
};
```

---

## 🔌 Conexão com o banco
A função `getConnectionConfig()` faz o parse da URL e retorna as configurações para o `pg.Pool`.  
Se a URL estiver errada, o script exibe uma mensagem e encerra.

---

## 🧱 Funções auxiliares
- **`query(pool, text, params)`** → executa queries com tratamento de erro e logs.
- **`batchInsert(...)`** → insere grandes quantidades de dados em lotes (batches).

---

## 🧩 setupBaseData()
Cria os dados **básicos** e obrigatórios:
- **Brand (marca principal)**: “Nola God Level Brand”  
- **Sub-brands**: Challenge Burger, Challenge Pizza, Challenge Sushi  
- **Canais de venda**: Presencial, iFood, Rappi, Uber Eats, WhatsApp, App Próprio  
- **Tipos de pagamento**: Dinheiro, Cartão, PIX etc.

Usa `ON CONFLICT DO NOTHING` para evitar duplicações ao rodar o script mais de uma vez.

---

## 🏪 generateStores()
Cria várias **lojas (franquias)** simuladas em cidades diferentes com:
- Nome, cidade, latitude e longitude
- Flags (`is_active`, `is_own`)
- Data de criação aleatória

---

## 🍔 generateProducts()
Cria categorias e produtos com nomes e preços realistas.

**Categorias criadas:**
- Burgers 🍔
- Pizzas 🍕
- Pratos 🍽️
- Combos 🍟
- Sobremesas 🍰
- Bebidas 🥤

Cada categoria gera produtos com nomes como:
```
Pizza Calabresa 1
Cheeseburger 3
Combo Família 2
```

---

## 👥 generateCustomers()
Cria milhares de **clientes falsos** com:
- Nome (`Cliente 452`)
- E-mail (`cliente452@email.com`)
- Telefone (`119xxxxxxxx`)
- Data de nascimento aleatória
- Gênero, consentimento e preferências de marketing

As inserções são feitas em **batches de 1000** para performance.

---

## 💸 generateSales()
Gera o **histórico de vendas** simulando comportamento real.

Cada venda:
- Escolhe loja, canal e cliente aleatoriamente  
- Gera hora, produtos, descontos, taxas e total  
- Define status (`COMPLETED` ou `CANCELLED`)  

Mais vendas ocorrem nos fins de semana.

---

## 🧾 insertSalesBatch()
Insere vendas em lote na tabela `sales` e cria os produtos vendidos (`product_sales`).

Cada venda contém:
- Valores financeiros (itens, descontos, taxas, total)
- Tempo de produção e entrega (simulados)
- Origem (`POS`)

---

## 📊 Estatísticas finais
Ao final, o script exibe:
```
📊 Estatísticas finais:
   Vendas: 512.304
   Produtos vendidos: 1.842.750
✅ Popularização concluída com sucesso!
```

---

## 🧮 Fluxo geral
```plaintext
1. Conecta ao banco
2. Cria marca, canais, categorias
3. Gera lojas
4. Gera produtos
5. Gera clientes
6. Gera vendas
7. Exibe estatísticas
```

---

## 🧩 Estrutura das tabelas esperadas

| Tabela | Campos principais |
|--------|--------------------|
| `brands` | id, name |
| `sub_brands` | id, brand_id, name |
| `stores` | id, name, city, latitude, longitude |
| `channels` | id, name, type |
| `products` | id, name, category_id |
| `categories` | id, name |
| `customers` | id, customer_name, email |
| `sales` | id, store_id, channel_id, total_amount, sale_status_desc |
| `product_sales` | id, sale_id, product_id, quantity, total_price |

---

## ✅ Resumo final
Este script é perfeito para **gerar dados simulados realistas** em bancos PostgreSQL e testar **dashboards de performance** e **relatórios analíticos** sem depender de dados reais.
