// Завдання 1. Товари інтернет-магазину SmartLine (масиви, методи масивів, функції)

const products = [
  { article: "APL16P256", id: 1, name: "Apple iPhone 16 Pro", country: "США", price1: 58999, price2: 55999, price3: 52999, stock: 12 },
  { article: "SMS25B256", id: 2, name: "Samsung Galaxy S25", country: "Південна Корея", price1: 41999, price2: 43999, price3: 45999, stock: 8 },
  { article: "GPX9W128", id: 3, name: "Google Pixel 9", country: "США", price1: 33999, price2: 31999, price3: 32999, stock: 5 },
  { article: "XMI14K256", id: 4, name: "Xiaomi 14", country: "Китай", price1: 29999, price2: 27999, price3: 25999, stock: 20 },
  { article: "OPL13G256", id: 5, name: "OnePlus 13", country: "Китай", price1: 30999, price2: 32999, price3: 34999, stock: 7 },
  { article: "MTE50S256", id: 6, name: "Motorola Edge 50", country: "США", price1: 17999, price2: 16499, price3: 18999, stock: 15 },
  { article: "NTH3A128", id: 7, name: "Nothing Phone (3a)", country: "Велика Британія", price1: 15999, price2: 14999, price3: 13999, stock: 9 },
  { article: "SNX1M6256", id: 8, name: "Sony Xperia 1 VI", country: "Японія", price1: 47999, price2: 49999, price3: 51999, stock: 3 },
  { article: "SMA56G128", id: 9, name: "Samsung Galaxy A56", country: "Південна Корея", price1: 17999, price2: 16999, price3: 17499, stock: 25 },
  { article: "XRN14P256", id: 10, name: "Xiaomi Redmi Note 14 Pro", country: "Китай", price1: 12999, price2: 11999, price3: 10999, stock: 30 },
];

const REQUIRED_FIELDS = ["article", "id", "name", "country", "price1", "price2", "price3", "stock"];

// 1.1 Впорядкування товарів за країною походження та середня (діюча) вартість по кожній країні
function sortByCountry(list) {
  return [...list].sort((a, b) => a.country.localeCompare(b.country, "uk") || a.name.localeCompare(b.name, "uk"));
}

function averagePriceByCountry(list) {
  const groups = {};
  for (const p of list) {
    if (!groups[p.country]) groups[p.country] = { sum: 0, count: 0 };
    groups[p.country].sum += p.price3;
    groups[p.country].count += 1;
  }
  return Object.entries(groups)
    .map(([country, g]) => ({ country, count: g.count, average: Math.round((g.sum / g.count) * 100) / 100 }))
    .sort((a, b) => a.country.localeCompare(b.country, "uk"));
}

// 1.2 Товар з мінімальною «вартість2_недіюча» та його внутрішній id
function findMinPrice2(list) {
  if (list.length === 0) return null;
  const min = list.reduce((best, p) => (p.price2 < best.price2 ? p : best));
  return { id: min.id, name: min.name, price2: min.price2 };
}

// 1.3 Додавання нового запису: неповний - у кінець, повний - на початок списку
function isComplete(product) {
  return REQUIRED_FIELDS.every((f) => product[f] !== undefined && product[f] !== null && product[f] !== "");
}

function addProduct(list, product) {
  const result = [...list];
  if (isComplete(product)) {
    result.unshift(product);
  } else {
    result.push(product);
  }
  return result;
}

// 1.4 Динаміка зміни ціни кожного товару
function priceTrend(product) {
  const prices = [product.price1, product.price2, product.price3];
  const decreasing = prices.every((p, i) => i === 0 || p < prices[i - 1]);
  const increasing = prices.every((p, i) => i === 0 || p > prices[i - 1]);
  if (decreasing) return "стабільно дешевшає";
  if (increasing) return "стабільно дорожчає";
  return "не стабільні зміни";
}

function priceDynamics(list) {
  return list.map((p) => ({ id: p.id, name: p.name, prices: [p.price1, p.price2, p.price3], trend: priceTrend(p) }));
}

if (typeof module !== "undefined") {
  module.exports = { products, sortByCountry, averagePriceByCountry, findMinPrice2, isComplete, addProduct, priceTrend, priceDynamics };
}
