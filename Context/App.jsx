import useWindowSize from "./hooks/useWindowSize";
import useToggle from "./hooks/useToggle";
import useOnlineStatus from "./hooks/useOnlineStatus";

function App() {
  const { width, height } = useWindowSize();
  const [value, toggle] = useToggle(false);
  const online = useOnlineStatus();

  return (
    <div>
      <h2>Мої React Hooks</h2>

      <p>Ширина: {width}</p>
      <p>Висота: {height}</p>

      <button onClick={toggle}>
        {value ? "Увімкнено" : "Вимкнено"}
      </button>

      <p>
        Інтернет: {online ? "Підключено" : "Немає підключення"}
      </p>
    </div>
  );
}

export default App;