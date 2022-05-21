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

export function useOffset(ref) {
  const [x, setX] = useState(false);
  const [y, setY] = useState(false);

  // For checking offset value
  // useEffect(() => {
  //   console.log(`${x} ${y}`);
  // }, [x, y]);

  const getOffset = (e) => {
    setX(e.offsetX);
    setY(e.offsetY);
  };

  const mouseLeave = () => {
    setX(false);
    setY(false);
  };

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.addEventListener("mousemove", (e) => {
        getOffset(e);
      });
      ref.current.addEventListener("mouseleave", mouseLeave);
    }
  }, []);

  return { x, y };
}
