import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [radius, setRadius] = useState(0);
  const timerRef = useRef(null);

  const handleMouseMove = () => {
    setRadius((prev) => prev + 1);

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setRadius(0);
    }, 3000);
  };

  return (
    <div className="container">
      <h1>Зображення з округленими кутами</h1>

      <img
        src="https://picsum.photos/500/300"
        alt="Приклад зображення"
        className="image"
        style={{ borderRadius: `${radius}px` }}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
}

export default App;
