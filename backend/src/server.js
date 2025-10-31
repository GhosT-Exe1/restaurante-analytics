const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { query } = require('./db');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.ALLOW_ORIGIN || true }));

function buildFilters({ store, channel }) {
  const where = [];
  const params = [];
  if (store && store !== 'all') { params.push(store); where.push(`s.store_id = $${params.length}`); }
  if (channel && channel !== 'all') { params.push(channel); where.push(`s.channel_id = $${params.length}`); }
  return { where: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

function parseRange(range) {
  if (range === '7d') return '7 days';
  if (range === '90d') return '90 days';
  return '30 days';
}

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/api/stores', async (req, res) => {
  const sql = 'SELECT id::text as id, name FROM stores WHERE is_active = true ORDER BY name';
  const { rows } = await query(sql);
  res.json(rows);
});

app.get('/api/channels', async (req, res) => {
  const sql = 'SELECT id::text as id, name FROM channels ORDER BY name';
  const { rows } = await query(sql);
  res.json(rows);
});

app.get('/api/kpis', async (req, res) => {
  const { store, channel, range } = req.query;
  const { where, params } = buildFilters({ store, channel });
  const period = parseRange(range);

  const sql = `
  WITH scoped AS (
    SELECT s.* FROM sales s
    ${where ? `${where} AND` : 'WHERE'} s.created_at >= NOW() - INTERVAL '${period}'
  )
    SELECT
      COALESCE(SUM(CASE WHEN sale_status_desc = 'COMPLETED' THEN total_amount ELSE 0 END), 0) AS revenue,
      COUNT(*) FILTER (WHERE sale_status_desc = 'COMPLETED') AS orders,
      CASE WHEN COUNT(*) FILTER (WHERE sale_status_desc = 'COMPLETED') > 0
        THEN SUM(CASE WHEN sale_status_desc = 'COMPLETED' THEN total_amount ELSE 0 END)::numeric
          / NULLIF(COUNT(*) FILTER (WHERE sale_status_desc = 'COMPLETED'), 0)
        ELSE 0 END AS aov,
      (COUNT(*) FILTER (WHERE sale_status_desc = 'CANCELED')::numeric)
        / NULLIF(COUNT(*), 0) AS cancelRate
    FROM scoped;
  `;
  const { rows } = await query(sql, params);
  const row = rows[0] || { revenue: 0, orders: 0, aov: 0, cancelrate: 0 };
  res.json({
    revenue: Number(row.revenue || 0),
    orders: Number(row.orders || 0),
    aov: Number(row.aov || 0),
    cancelRate: Number(row.cancelrate || 0)
  });
});

app.get('/api/sales/daily', async (req, res) => {
  const { store, channel, range } = req.query;
  const { where, params } = buildFilters({ store, channel });
  const period = parseRange(range);

  const sql = `
    SELECT DATE(s.created_at) AS date, 
           SUM(CASE WHEN s.sale_status_desc = 'COMPLETED' THEN s.total_amount ELSE 0 END) AS total
    FROM sales s
    ${where ? where.replace('WHERE', 'WHERE') : 'WHERE 1=1'}
    AND s.created_at >= NOW() - INTERVAL '${period}'
    GROUP BY DATE(s.created_at)
    ORDER BY DATE(s.created_at);
  `;
  const { rows } = await query(sql, params);
  res.json(rows.map(r => ({ date: r.date.toISOString().slice(0,10), total: Number(r.total || 0) })));
});

app.get('/api/products/top', async (req, res) => {
  const { store, channel, range, limit } = req.query;
  const { where, params } = buildFilters({ store, channel });
  const period = parseRange(range);
  const lim = Math.min(Math.max(parseInt(limit || '10', 10), 1), 50);

  const sql = `
    SELECT p.name,
           SUM(ps.quantity) AS units,
           SUM(ps.total_price) AS revenue
    FROM product_sales ps
    JOIN products p ON p.id = ps.product_id
    JOIN sales s ON s.id = ps.sale_id
    ${where ? where.replace('WHERE', 'WHERE') : 'WHERE 1=1'}
    AND s.sale_status_desc = 'COMPLETED'
    AND s.created_at >= NOW() - INTERVAL '${period}'
    GROUP BY p.name
    ORDER BY units DESC
    LIMIT ${lim};
  `;
  const { rows } = await query(sql, params);
  const out = rows.map((r, i) => ({ rank: i + 1, name: r.name, units: Number(r.units || 0), revenue: Number(r.revenue || 0) }));
  res.json(out);
});

const port = Number(process.env.PORT || 8000);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});


