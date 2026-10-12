type Request1<T> =
  | { status: "loading" }
  | { status: "success"; data: T[] }
  | { status: "error"; message: string };

function showRequest(state: Request1<string>) {
  if (state.status === "loading") return "Завантаження...";
  if (state.status === "success") return "Успіх!";
  return "Помилка: " + state.message;
}

interface User {
  readonly id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  avatar?: string;
}

function getAvatar(user: User) {
  return user.avatar || "default.png";
}

type Currency = "UAH" | "USD" | "EUR";

function formatMoney(price: number, currency: Currency, symbol = true) {
  if (symbol) return price + " " + currency;
  return price.toString();
}

interface Product {
  id: number;
  name: string;
  price: number;
}

function findProducts(products: Product[], maxPrice: number) {
  return products.filter(product => product.price <= maxPrice);
}

interface Response1<T> {
  code: number;
  date: Date;
  data: T;
}

function getName(): Response1<string> {
  return { code: 200, date: new Date(), data: "Іван" };
}

function getList(): Response1<number[]> {
  return { code: 200, date: new Date(), data: [1, 2, 3] };
}

class MyError extends Error {
  readonly code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }

  show() {
    return "Помилка " + this.code + ": " + this.message;
  }
}

class DataService {
  #url: string;
  #cache = new Map<string, any>();

  constructor(url: string) {
    this.#url = url;
  }

  async getData(key: string) {
    if (this.#cache.has(key)) {
      return this.#cache.get(key);
    }

    const response = await fetch(this.#url + key);
    const data = await response.json();

    this.#cache.set(key, data);
    return data;
  }
}

interface CartItem {
  product: Product;
  quantity: number;
}

class Cart {
  #items: CartItem[] = [];

  add(product: Product) {
    const item = this.#items.find(
      item => item.product.id === product.id
    );

    if (item) {
      item.quantity++;
    } else {
      this.#items.push({ product, quantity: 1 });
    }
  }

  remove(id: number) {
    this.#items = this.#items.filter(
      item => item.product.id !== id
    );
  }

  total() {
    return this.#items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  getItems() {
    return this.#items.map(item => ({
      product: { ...item.product },
      quantity: item.quantity
    }));
  }
}

console.log(showRequest({ status: "loading" }));

const user: User = {
  id: 1,
  name: "Іван",
  email: "ivan@gmail.com",
  role: "user"
};

console.log(getAvatar(user));
console.log(formatMoney(100, "UAH"));

const products: Product[] = [
  { id: 1, name: "Телефон", price: 10000 },
  { id: 2, name: "Мишка", price: 500 },
  { id: 3, name: "Клавіатура", price: 1500 }
];

console.log(findProducts(products, 1500));
console.log(getName());
console.log(getList());

const error = new MyError("Не знайдено", 404);
console.log(error.show());

const service = new DataService(
  "https://jsonplaceholder.typicode.com/"
);

service.getData("users").then(data => console.log(data));

const cart = new Cart();

cart.add(products[0]);
cart.add(products[1]);
cart.add(products[1]);

console.log(cart.getItems());
console.log("Сума:", cart.total());

cart.remove(1);
console.log(cart.getItems());