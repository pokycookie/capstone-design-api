const { useState, useEffect } = require("react");

export function useWindow(widthSize, heightSize) {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth - (widthSize || 0),
      height: window.innerHeight - (heightSize || 0),
    });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}
