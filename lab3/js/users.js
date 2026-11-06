// Завдання 2. Облікові записи користувачів, що звернулись через форму зворотного зв'язку (ООП)

const PURPOSE = {
  COOPERATION: "співпраця",
  COMPLAINT: "скарга на порушення права власності",
  PROPOSAL: "пропозиція",
  ERROR: "наявність помилки",
};

class User {
  #requestDate; // приватне поле: дата та час звернення як об'єкт Date

  constructor(surname, name, age, education, purpose, date, time) {
    this.surname = surname;
    this.name = name;
    this.age = age;
    this.education = education;
    this.purpose = purpose;
    this.date = date; // "РРРР-ММ-ДД"
    this.time = time; // "ГГ:ХХ"
    this.#requestDate = new Date(`${date}T${time}:00`);
  }

  get fullName() {
    return `${this.surname} ${this.name}`;
  }

  get requestDate() {
    return this.#requestDate;
  }

  get minutesOfDay() {
    const [h, m] = this.time.split(":").map(Number);
    return h * 60 + m;
  }

  isWorkingTime() {
    return this.minutesOfDay >= 9 * 60 && this.minutesOfDay <= 18 * 60;
  }

  toString() {
    return `${this.fullName}, ${this.age} р., ${this.date} ${this.time}`;
  }
}

class UserRegistry {
  constructor(users = []) {
    this.users = [...users];
  }

  add(user) {
    this.users.push(user);
    return this;
  }

  // 2.1 Користувачі, що звернулись протягом певного місяця, станом на заданий момент часу
  byMonth(year, month, moment = new Date()) {
    return this.users.filter((u) => {
      const d = u.requestDate;
      return d.getFullYear() === year && d.getMonth() + 1 === month && d <= moment;
    });
  }

  // 2.2 Середній вік; якщо він співпадає з віком користувача - його дані про освіту
  averageAge() {
    return this.users.reduce((s, u) => s + u.age, 0) / this.users.length;
  }

  educationForAverageAge() {
    const avg = this.averageAge();
    const matches = this.users.filter((u) => u.age === avg);
    return { average: avg, matches: matches.map((u) => ({ fullName: u.fullName, age: u.age, education: u.education })) };
  }

  // 2.3 Поділ на три класи за часом звернення та метою
  classify() {
    const classes = {
      "звернулись з претензією у робочий час": [],
      "звернулись з побажанням у робочий час": [],
      "Інші": [],
    };
    for (const u of this.users) {
      if (u.isWorkingTime() && u.purpose === PURPOSE.COMPLAINT) {
        classes["звернулись з претензією у робочий час"].push(u);
      } else if (u.isWorkingTime() && u.purpose === PURPOSE.PROPOSAL) {
        classes["звернулись з побажанням у робочий час"].push(u);
      } else {
        classes["Інші"].push(u);
      }
    }
    return classes;
  }

  classCounts() {
    return Object.fromEntries(Object.entries(this.classify()).map(([k, v]) => [k, v.length]));
  }

  // 2.4 Сортування: за спаданням віку та в алфавітному порядку
  sortByAgeDesc() {
    return [...this.users].sort((a, b) => b.age - a.age || a.fullName.localeCompare(b.fullName, "uk"));
  }

  sortAlphabetically() {
    return [...this.users].sort((a, b) => a.fullName.localeCompare(b.fullName, "uk"));
  }
}

const registry = new UserRegistry([
  new User("Коваленко", "Олена", 29, "вища", PURPOSE.COMPLAINT, "2026-10-03", "10:15"),
  new User("Шевчук", "Андрій", 41, "професійна", PURPOSE.PROPOSAL, "2026-10-07", "14:40"),
  new User("Бондаренко", "Ірина", 32, "вища", PURPOSE.COOPERATION, "2026-10-12", "09:05"),
  new User("Ткаченко", "Максим", 19, "неповна", PURPOSE.ERROR, "2026-09-28", "21:30"),
  new User("Мельник", "Софія", 24, "повна", PURPOSE.PROPOSAL, "2026-10-15", "19:10"),
  new User("Кравченко", "Дмитро", 37, "вища", PURPOSE.COMPLAINT, "2026-10-21", "17:55"),
  new User("Олійник", "Тарас", 45, "професійна", PURPOSE.COMPLAINT, "2026-11-02", "08:30"),
  new User("Лисенко", "Марія", 27, "вища", PURPOSE.PROPOSAL, "2026-11-04", "11:20"),
  new User("Гончаренко", "Віктор", 52, "повна", PURPOSE.COOPERATION, "2026-09-15", "16:00"),
  new User("Антоненко", "Юлія", 14, "неповна", PURPOSE.ERROR, "2026-10-29", "12:45"),
]);

if (typeof module !== "undefined") {
  module.exports = { PURPOSE, User, UserRegistry, registry };
}
