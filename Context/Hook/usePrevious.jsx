import { useState, useEffect } from "react";

function usePrevious(value) {
  const [previous, setPrevious] = useState(undefined);

  useEffect(() => {
    setPrevious(value);
  }, [value]);

  return previous;
}

export default usePrevious;