// Виведення результатів завдань на сторінку та у консоль

function table(rows, columns) {
  const head = columns.map(([, title]) => `<th>${title}</th>`).join("");
  const body = rows
    .map((r) => `<tr>${columns.map(([key]) => `<td>${typeof key === "function" ? key(r) : r[key] ?? "-"}</td>`).join("")}</tr>`)
    .join("");
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

const productColumns = [
  ["article", "Артикул"], ["id", "id"], ["name", "Назва"], ["country", "Країна"],
  ["price1", "Вартість1 (недіюча)"], ["price2", "Вартість2 (недіюча)"], ["price3", "Вартість3 (діюча)"], ["stock", "На складі"],
];
const userColumns = [
  [(u) => u.fullName, "Прізвище та ім'я"], ["age", "Вік"], ["education", "Освіта"],
  ["purpose", "Мета звернення"], ["date", "Дата"], ["time", "Час"],
];

let currentProducts = [...products];

// Функціональний вираз (function expression): форматування ціни з розділенням розрядів
const formatPrice = function (value) {
  return `${Math.round(value).toLocaleString("uk-UA")} грн`;
};

// Загальна інформація: Math, Date, String та типи даних
const currentPrices = products.map((p) => p.price3);
const today = new Date();
const summary = [
  ["Товарів у каталозі", String(products.length)],
  ["Загалом на складі, шт.", String(totalStock(products))],
  ["Найдешевший товар", formatPrice(Math.min(...currentPrices))],
  ["Найдорожчий товар", formatPrice(Math.max(...currentPrices))],
  ["Середня діюча ціна", formatPrice(currentPrices.reduce((s, p) => s + p, 0) / currentPrices.length)],
  ["Країни (через кому)", [...new Set(products.map((p) => p.country))].join(", ")],
  ["Артикули брендів Samsung", products.filter((p) => p.name.startsWith("Samsung")).map((p) => p.article.toLowerCase()).join(", ")],
  ["Дата формування звіту", `${today.toLocaleDateString("uk-UA")} (день місяця: ${today.getDate()}, день тижня: ${today.getDay()})`],
];
document.getElementById("summary").innerHTML = table(summary.map(([k, v]) => ({ k, v })), [["k", "Показник"], ["v", "Значення"]]);

const sample = products[0];
const types = [
  ["sample.name", sample.name, typeof sample.name],
  ["sample.price3", sample.price3, typeof sample.price3],
  ["isComplete(sample)", isComplete(sample), typeof isComplete(sample)],
  ["sample.discount", sample.discount, typeof sample.discount],
  ["products", "масив з 10 товарів", typeof products],
  ["registry", "об'єкт класу UserRegistry", typeof registry],
  ["today", today.toISOString(), typeof today],
  ["formatPrice", "функція", typeof formatPrice],
];
document.getElementById("types").innerHTML = table(types.map(([e, v, t]) => ({ e, v: String(v), t })), [["e", "Вираз"], ["v", "Значення"], ["t", "typeof"]]);
console.log("Типи даних:"); console.table(types);

// Явне перетворення типів
const conversions = [
  ['Number("52999")', Number("52999")],
  ["String(52999)", String(52999)],
  ['parseInt("12 шт.", 10)', parseInt("12 шт.", 10)],
  ['parseFloat("4.5 дюйма")', parseFloat("4.5 дюйма")],
  ['Boolean("")', Boolean("")],
  ["Boolean(products.length)", Boolean(products.length)],
];
document.getElementById("conversions").innerHTML = table(conversions.map(([e, v]) => ({ e, v: String(v), t: typeof v })), [["e", "Вираз"], ["v", "Результат"], ["t", "typeof результату"]]);
console.log("Явне перетворення типів:"); console.table(conversions);

// 1.1
const sorted = sortByCountry(products);
document.getElementById("sorted").innerHTML = table(sorted, productColumns);
const avg = averagePriceByCountry(products);
document.getElementById("avg").innerHTML = table(avg, [["country", "Країна"], ["count", "Кількість товарів"], [(a) => a.average.toFixed(2) + " грн", "Середня вартість"]]);
console.log("1.1 Впорядковано за країною:"); console.table(sorted);
console.log("1.1 Середня вартість по країнах:"); console.table(avg);

// 1.2
const min = findMinPrice2(products);
document.getElementById("min").textContent = `Внутрішній id: ${min.id} (${min.name}, вартість2_недіюча = ${min.price2} грн)`;
console.log("1.2 Мінімальна вартість2_недіюча:", min);

// 1.3
document.getElementById("add-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  for (const k of ["id", "price1", "price2", "price3", "stock"]) data[k] = data[k] === "" ? undefined : Number(data[k]);
  const complete = isComplete(data);
  currentProducts = addProduct(currentProducts, data);
  document.getElementById("add-msg").textContent = complete
    ? `Уся інформація наявна - товар «${data.name}» додано на ПОЧАТОК списку.`
    : `Інформація неповна - товар «${data.name || "без назви"}» додано в КІНЕЦЬ списку.`;
  document.getElementById("added").innerHTML = table(currentProducts, productColumns);
  e.target.elements.id.placeholder = `вільний: ${nextFreeId(currentProducts)}`;
  console.log("1.3 Список після додавання:"); console.table(currentProducts);
});
document.getElementById("add-form").elements.id.placeholder = `вільний: ${nextFreeId(products)}`;

// 1.4
const dyn = priceDynamics(products);
document.getElementById("dyn").innerHTML = table(dyn, [["id", "id"], ["name", "Назва"], [(d) => d.prices.join(" → "), "Ціни"], ["trend", "Динаміка"]]);
console.log("1.4 Динаміка цін:"); console.table(dyn);

// 2.1
function showMonth(value, moment) {
  const [y, m] = value.split("-").map(Number);
  const list = registry.byMonth(y, m, new Date(moment));
  document.getElementById("month").innerHTML = list.length ? table(list, userColumns) : "<p class='result'>Звернень не знайдено.</p>";
  console.log(`2.1 Звернення за ${value} станом на ${moment}:`, list.map(String));
}
document.getElementById("month-form").addEventListener("submit", (e) => {
  e.preventDefault();
  showMonth(e.target.month.value, e.target.moment.value);
});
showMonth("2026-10", "2026-10-20T12:00");

// 2.2
const age = registry.educationForAverageAge();
document.getElementById("age").textContent = age.matches.length
  ? `Середній вік: ${age.average}. Співпадає з віком: ${age.matches.map((u) => `${u.fullName} - освіта: ${u.education}`).join("; ")}.`
  : `Середній вік: ${age.average}. Користувачів з таким віком немає.`;
console.log("2.2 Середній вік:", age);

// 2.3
const classes = registry.classify();
document.getElementById("classes").innerHTML = Object.entries(classes)
  .map(([name, list]) => `<h3>${name}: ${list.length}</h3>${table(list, userColumns)}`)
  .join("");
console.log("2.3 Кількість у класах:", registry.classCounts());

// 2.4
document.getElementById("by-age").innerHTML = table(registry.sortByAgeDesc(), userColumns);
document.getElementById("by-name").innerHTML = table(registry.sortAlphabetically(), userColumns);
console.log("2.4 За спаданням віку:", registry.sortByAgeDesc().map(String));
console.log("2.4 За алфавітом:", registry.sortAlphabetically().map(String));
