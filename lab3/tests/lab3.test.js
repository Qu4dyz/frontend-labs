// Тестування завдань ЛР3. Запуск: node --test lab3/tests/lab3.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const P = require("../js/products.js");
const { User, UserRegistry, registry, PURPOSE } = require("../js/users.js");

test("1.1 товари впорядковано за країною", () => {
  const sorted = P.sortByCountry(P.products);
  const countries = sorted.map((p) => p.country);
  assert.deepEqual(countries, [...countries].sort((a, b) => a.localeCompare(b, "uk")));
  assert.equal(sorted.length, 10);
  assert.equal(P.products[0].id, 1, "вихідний масив не змінюється");
});

test("1.1 середня вартість по країні", () => {
  const avg = P.averagePriceByCountry(P.products);
  const china = avg.find((a) => a.country === "Китай");
  assert.equal(china.count, 3);
  assert.equal(china.average, (25999 + 34999 + 10999) / 3);
  const japan = avg.find((a) => a.country === "Японія");
  assert.equal(japan.average, 51999);
});

test("1.2 мінімальна вартість2_недіюча → id", () => {
  assert.deepEqual(P.findMinPrice2(P.products), { id: 10, name: "Xiaomi Redmi Note 14 Pro", price2: 11999 });
  assert.equal(P.findMinPrice2([]), null);
});

test("1.3 повний запис додається на початок, неповний - у кінець", () => {
  const full = { article: "MTG85T128", id: 11, name: "Motorola G85", country: "США", price1: 9999, price2: 9499, price3: 8999, stock: 4 };
  const partial = { article: "HNR400X", id: 12, name: "Honor 400", country: "", price1: 19999, price2: 18999, price3: 17999, stock: 2 };
  const a = P.addProduct(P.products, full);
  assert.equal(a[0].id, 11);
  assert.equal(a.length, 11);
  const b = P.addProduct(P.products, partial);
  assert.equal(b[b.length - 1].id, 12);
  assert.equal(P.products.length, 10, "вихідний масив не змінюється");
});

test("1.4 динаміка цін", () => {
  assert.equal(P.priceTrend({ price1: 3, price2: 2, price3: 1 }), "стабільно дешевшає");
  assert.equal(P.priceTrend({ price1: 1, price2: 2, price3: 3 }), "стабільно дорожчає");
  assert.equal(P.priceTrend({ price1: 1, price2: 3, price3: 2 }), "не стабільні зміни");
  assert.equal(P.priceTrend({ price1: 2, price2: 2, price3: 1 }), "не стабільні зміни", "рівні ціни - не монотонна послідовність");
  const trends = P.priceDynamics(P.products).map((d) => d.trend);
  assert.equal(trends.filter((t) => t === "стабільно дешевшає").length, 4);
  assert.equal(trends.filter((t) => t === "стабільно дорожчає").length, 3);
  assert.equal(trends.filter((t) => t === "не стабільні зміни").length, 3);
});

test("2.1 користувачі за місяць станом на момент часу", () => {
  const all = registry.byMonth(2026, 10, new Date("2026-10-31T23:59:00"));
  assert.equal(all.length, 6);
  const part = registry.byMonth(2026, 10, new Date("2026-10-13T00:00:00"));
  assert.deepEqual(part.map((u) => u.surname), ["Коваленко", "Шевчук", "Бондаренко"]);
  assert.equal(registry.byMonth(2026, 12, new Date("2026-12-31T00:00:00")).length, 0);
});

test("2.2 середній вік та освіта користувача з таким віком", () => {
  const r = registry.educationForAverageAge();
  assert.equal(r.average, 32);
  assert.deepEqual(r.matches, [{ fullName: "Бондаренко Ірина", age: 32, education: "вища" }]);
  const other = new UserRegistry([new User("А", "Б", 20, "повна", PURPOSE.ERROR, "2026-10-01", "10:00"), new User("В", "Г", 25, "вища", PURPOSE.ERROR, "2026-10-01", "10:00")]);
  assert.deepEqual(other.educationForAverageAge().matches, [], "середній вік 22.5 не співпадає ні з ким");
});

test("2.3 три класи за часом і метою звернення", () => {
  assert.deepEqual(registry.classCounts(), {
    "звернулись з претензією у робочий час": 2,
    "звернулись з побажанням у робочий час": 2,
    "Інші": 6,
  });
  const edge = new User("Межа", "Час", 30, "вища", PURPOSE.COMPLAINT, "2026-10-01", "18:00");
  assert.equal(edge.isWorkingTime(), true, "18:00 - ще робочий час");
  assert.equal(new User("Межа", "Час", 30, "вища", PURPOSE.COMPLAINT, "2026-10-01", "08:59").isWorkingTime(), false);
});

test("2.4 сортування за спаданням віку та за алфавітом", () => {
  const ages = registry.sortByAgeDesc().map((u) => u.age);
  assert.deepEqual(ages, [...ages].sort((a, b) => b - a));
  assert.equal(registry.sortAlphabetically()[0].surname, "Антоненко");
  assert.equal(registry.sortAlphabetically().at(-1).surname, "Шевчук");
});
