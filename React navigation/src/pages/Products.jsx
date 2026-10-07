import { Link, useSearchParams } from "react-router-dom";
import { products } from "../data/products";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category");

  const filteredProducts = category
    ? products.filter(product => product.category === category)
    : products;

  function changeCategory(category) {
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  }

  return (
    <div>
      <h2>Каталог</h2>

      <div className="filters">
        <button onClick={() => changeCategory("all")}>
          Усі
        </button>

        <button onClick={() => changeCategory("Телефони")}>
          Телефони
        </button>

        <button onClick={() => changeCategory("Ноутбуки")}>
          Ноутбуки
        </button>
      </div>

      <div className="products">
        {filteredProducts.map(product => (
          <div className="product" key={product.id}>
            <h3>{product.name}</h3>
            <p>Ціна: {product.price} грн</p>

            <Link to={`/products/${product.id}`}>
              Детальніше
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;