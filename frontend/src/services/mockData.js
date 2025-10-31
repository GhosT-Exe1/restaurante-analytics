export function getStores() {
  return [
    { id: 'all', name: 'Todas as lojas' },
    { id: 'sp-centro', name: 'SP - Centro' },
    { id: 'sp-vila', name: 'SP - Vila Mariana' },
    { id: 'rj-botafogo', name: 'RJ - Botafogo' },
    { id: 'ma-saoluis', name: 'MA - São Luis' },
  ];
}

export function getChannels() {
  return [
    { id: 'all', name: 'Todos os canais' },
    { id: 'P', name: 'Presencial' },
    { id: 'ifood', name: 'iFood' },
    { id: 'rappi', name: 'Rappi' },
  ];
}

export function generateDailySales(days = 30, seedOffset = 0) {
  const today = new Date();
  return Array.from({ length: days }).map((_, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - idx));
    const base = 20000 + Math.sin((idx + seedOffset) / 5) * 4000; // sazonalidade simples
    const promo = (idx + seedOffset) % days === days - 4 ? base * 2.5 : 0; // pico promocional deslocado
    const rnd = Math.sin(idx * 12.9898 + seedOffset * 78.233) * 43758.5453;
    const noise = (rnd - Math.floor(rnd) - 0.5) * 3000;
    const value = Math.max(8000, Math.round(base + promo + noise));
    return { date: d.toISOString().slice(0, 10), total: value };
  });
}

export function getStoreNameById(id) {
  const found = getStores().find(s => s.id === id);
  return found ? found.name : 'Loja';
}

export function getTopProducts(limit = 10) {
  const names = [
    'X-Bacon Duplo',
    'Batata Frita Grande',
    'Cheeseburger',
    'Refrigerante 2L',
    'Milkshake Chocolate',
    'Onion Rings',
    'Combo Família',
    'Salada Caesar',
    'Wrap de Frango',
    'Brownie'
  ];
  return names.slice(0, limit).map((name, i) => ({
    rank: i + 1,
    name,
    units: Math.round(1200 - i * 80 + Math.random() * 40),
    revenue: Math.round((120000 - i * 8000) * (0.9 + Math.random() * 0.2)),
  }));
}

export function getKpis() {
  return {
    revenue: 1250000,
    orders: 18250,
    aov: 68.5,
    cancelRate: 0.048,
  };
}


