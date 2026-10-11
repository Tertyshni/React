import { useNavigate, useParams } from "react-router-dom";
import { products } from "../data/products";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(product => product.id === Number(id));

  if (!product) {
    return (
      <div>
        <h2>Товар не знайдено</h2>
        <button onClick={() => navigate(-1)}>
          Назад
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>{product.name}</h2>

      <p>
        <b>ID:</b> {product.id}
      </p>

      <p>
        <b>Категорія:</b> {product.category}
      </p>

      <p>
        <b>Ціна:</b> {product.price} грн
      </p>

      <p>
        <b>Опис:</b> {product.description}
      </p>

      <button onClick={() => navigate(-1)}>
        Назад
      </button>
    </div>
  );
}

export default Product;