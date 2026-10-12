
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./Forms.css";

function App() {
  const inputRef = useRef(null);

  const timerRef = useRef(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  const [text, setText] = useState("");
  const [previous, setPrevious] = useState("");
  const previousText = useRef("");

  const renders = useRef(0);
  renders.current++;

  const [count, setCount] = useState(0);

  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const videoRef = useRef(null);

  const sectionRef = useRef(null);

  const codeRefs = useRef([]);
  const [code, setCode] = useState(["", "", "", ""]);

  const sizeRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const simpleInputRef = useRef(null);
  const [submittedText, setSubmittedText] = useState("");

  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useLayoutEffect(() => {
    const updateSize = () => {
      if (sizeRef.current) {
        setSize({
          width: sizeRef.current.offsetWidth,
          height: sizeRef.current.offsetHeight
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const startTimer = () => {
    if (timerRef.current !== null) return;

    setRunning(true);

    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
  };

  const saveText = (value) => {
    previousText.current = text;
    setPrevious(previousText.current);
    setText(value);
  };

  const changeCode = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < code.length - 1) {
      codeRefs.current[index + 1].focus();
    }
  };

  const submitCode = (event) => {
    event.preventDefault();
    alert("Введений код: " + code.join(""));
  };

  const submitSimpleInput = (event) => {
    event.preventDefault();
    setSubmittedText(simpleInputRef.current.value);
  };

  return (
    <div className="container">
      <h1>Forms. Dumb and Smart Components</h1>

      <section>
        <input ref={inputRef} placeholder="Введіть текст" />
        <button onClick={() => inputRef.current.focus()}>
          Фокус
        </button>
      </section>

      <section>
        <p>Час: {seconds} сек.</p>
        <button onClick={startTimer} disabled={running}>
          Старт
        </button>
        <button onClick={stopTimer} disabled={!running}>
          Стоп
        </button>
      </section>

      <section>
        <input
          value={text}
          onChange={(e) => saveText(e.target.value)}
          placeholder="Введіть текст"
        />
        <p>Поточне значення: {text}</p>
        <p>Попереднє значення: {previous}</p>
      </section>

      <section>
        <p>Кількість рендерів: {renders.current}</p>
        <p>Лічильник: {count}</p>
        <button onClick={() => setCount((c) => c + 1)}>
          Збільшити лічильник
        </button>
      </section>

      <section>
        <div ref={menuRef} className="menu">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            Меню ▼
          </button>

          {menuOpen && (
            <div className="dropdown">
              <p>Головна</p>
              <p>Про нас</p>
              <p>Контакти</p>
            </div>
          )}
        </div>
        <p>Клацніть поза меню, щоб закрити його.</p>
      </section>

      <section>
        <video
          ref={videoRef}
          width="100%"
          controls={false}
          src="https://www.w3schools.com/html/mov_bbb.mp4"
        />
        <button onClick={() => videoRef.current.play()}>
          Відтворити
        </button>
        <button onClick={() => videoRef.current.pause()}>
          Пауза
        </button>
      </section>

      <section>
        <button
          onClick={() =>
            sectionRef.current.scrollIntoView({ behavior: "smooth" })
          }
        >
          Перейти до секції
        </button>
      </section>

      <section ref={sectionRef} className="target">
        <h2>Цільова секція</h2>
        <p>Сюди виконується плавне прокручування сторінки.</p>
      </section>

      <section>
        <form onSubmit={submitCode}>
          <div className="code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (codeRefs.current[index] = el)}
                value={digit}
                onChange={(e) => changeCode(e.target.value, index)}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]"
                required
              />
            ))}
          </div>
          <button type="submit">Підтвердити</button>
        </form>
      </section>

      <section>
        <div ref={sizeRef} className="size-box">
          Вимірюваний елемент
        </div>
        <p>Ширина: {size.width} px</p>
        <p>Висота: {size.height} px</p>
      </section>

      <section>
        <form onSubmit={submitSimpleInput}>
          <input
            ref={simpleInputRef}
            placeholder="Введіть текст"
          />
          <button type="submit">Відправити</button>
        </form>
        <p>Відправлений текст: {submittedText}</p>
      </section>
    </div>
  );
}

export default App;
