import { useState, useEffect } from "react";

function useInterval(callback, delay) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active || delay === null) return;

    const id = setInterval(callback, delay);

    return () => clearInterval(id);
  }, [callback, delay, active]);

  return {
    start: () => setActive(true),
    stop: () => setActive(false)
  };
}

export default useInterval;