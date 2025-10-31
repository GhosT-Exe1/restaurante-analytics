const DEFAULT_BASE_URL = (window && window.BACKEND_URL) || 'http://localhost:8000';

function buildUrl(path, params = {}) {
  const url = new URL(path, DEFAULT_BASE_URL);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });
  return url.toString();
}

async function getJson(url) {
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchStores() {
  return getJson(buildUrl('/api/stores'));
}

export async function fetchChannels() {
  return getJson(buildUrl('/api/channels'));
}

export async function fetchKpis({ store, channel, range }) {
  return getJson(buildUrl('/api/kpis', { store, channel, range }));
}

export async function fetchDailySales({ store, channel, range }) {
  return getJson(buildUrl('/api/sales/daily', { store, channel, range }));
}

export async function fetchTopProducts({ store, channel, range, limit = 10 }) {
  return getJson(buildUrl('/api/products/top', { store, channel, range, limit }));
}


