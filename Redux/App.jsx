import { useDispatch, useSelector } from "react-redux";
import { addProduct, removeProduct, clearCart } from "./cartSlice";

function App() {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);

  return (
    <div>
      <h1>Мій кошик</h1>

      <button onClick={() => dispatch(addProduct({
        id: 1,
        name: "Телефон",
        price: 10000
      }))}>
        Додати телефон
      </button>

      {cart.products.map(product => (
        <p key={product.id}>
          {product.name} — {product.price} грн

          <button onClick={() => dispatch(removeProduct(product.id))}>
            Видалити
          </button>
        </p>
      ))}

      <h3>Сума: {cart.totalPrice} грн</h3>

      <button onClick={() => dispatch(clearCart())}>
        Очистити кошик
      </button>
    </div>
  );
}

export default App;