// Виведення результатів завдань на сторінку та у консоль

function table(rows, columns) {
  const head = columns.map(([, title]) => `<th>${title}</th>`).join("");
  const body = rows
    .map((r) => `<tr>${columns.map(([key]) => `<td>${typeof key === "function" ? key(r) : r[key] ?? "—"}</td>`).join("")}</tr>`)
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
    ? `Уся інформація наявна — товар «${data.name}» додано на ПОЧАТОК списку.`
    : `Інформація неповна — товар «${data.name || "без назви"}» додано в КІНЕЦЬ списку.`;
  document.getElementById("added").innerHTML = table(currentProducts, productColumns);
  console.log("1.3 Список після додавання:"); console.table(currentProducts);
});

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
  ? `Середній вік: ${age.average}. Співпадає з віком: ${age.matches.map((u) => `${u.fullName} — освіта: ${u.education}`).join("; ")}.`
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
