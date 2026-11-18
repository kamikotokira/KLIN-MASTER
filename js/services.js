const services = {
  maintenance: { title: "Поддерживающая", rate: 150, minimum: 2800 },
  general: { title: "Генеральная", rate: 250, minimum: 5000 },
  repair: { title: "После ремонта", rate: 320, minimum: 6500 }
};

const extras = {
  windows: { title: "Мытьё окон", price: 1200 },
  oven: { title: "Духовка", price: 800 },
  fridge: { title: "Холодильник", price: 600 },
  balcony: { title: "Балкон", price: 900 }
};

function formatRub(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function calculatePrice(type, area, selectedExtras) {
  const service = services[type];
  const base = Math.max(service.minimum, Math.round(area * service.rate));
  const extrasSum = selectedExtras.reduce((sum, code) => sum + extras[code].price, 0);
  return {
    base: base,
    extrasSum: extrasSum,
    total: base + extrasSum
  };
}

const durationMinutes = {
  maintenance: 1.7,
  general: 2.6,
  repair: 3.2
};

function estimateDuration(type, area, selectedExtras) {
  const minutes = area * durationMinutes[type] + selectedExtras.length * 25;
  return Math.max(2, Math.ceil(minutes / 60));
}

