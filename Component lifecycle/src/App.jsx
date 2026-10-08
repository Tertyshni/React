import { useEffect, useRef, useState } from "react";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = count;
  }, [count]);

  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(time => time + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [text, setText] = useState(
    localStorage.getItem("text") || ""
  );

  useEffect(() => {
    localStorage.setItem("text", text);
  }, [text]);

  const input = useRef();

  useEffect(() => {
    input.current.focus();
  }, []);

  const slides = ["Слайд 1", "Слайд 2", "Слайд 3", "Слайд 4"];
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(slide => (slide + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app">

      <h1>React Lifecycle</h1>

      <h2>Лічильник</h2>
      <p>{count}</p>

      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>

      <h2>Секундомір</h2>
      <p>{time} секунд</p>

      <h2>LocalStorage</h2>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Введіть текст"
      />

      <h2>Автофокус</h2>
      <input ref={input} placeholder="Фокус тут" />

      <h2>Слайдер</h2>
      <div className="slider">
        {slides[slide]}
      </div>

    </div>
  );
}

export default App;
