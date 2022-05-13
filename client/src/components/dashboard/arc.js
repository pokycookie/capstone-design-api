import { useEffect, useState } from "react";

export function Arc({ color, startDeg, endDeg, radius, size }) {
  const [flag, setFlag] = useState({
    flag1: 0,
    flag2: 0,
  });

  useEffect(() => {
    if (startDeg < endDeg && endDeg - startDeg < 180) {
      setFlag({ flag1: 0, flag2: 1 });
    } else if (startDeg > endDeg && startDeg - endDeg > 180) {
      setFlag({ flag1: 0, flag2: 1 });
    } else if (startDeg < endDeg && endDeg - startDeg > 180) {
      setFlag({ flag1: 1, flag2: 1 });
    } else if (startDeg > endDeg && startDeg - endDeg < 180) {
      setFlag({ flag1: 1, flag2: 1 });
    }
  }, [startDeg, endDeg]);

  return (
    <path
      d={`M ${radius / 2} ${radius / 2} ${
        radius / 2 + radius * 0.34 * Math.sin(startDeg * (Math.PI / 180))
      } ${
        radius / 2 - radius * 0.34 * Math.cos(startDeg * (Math.PI / 180))
      } A ${radius * 0.34} ${radius * 0.34} 0 ${flag.flag1} ${flag.flag2} ${
        radius / 2 + radius * 0.34 * Math.sin(endDeg * (Math.PI / 180))
      } ${radius / 2 - radius * 0.34 * Math.cos(endDeg * (Math.PI / 180))} L ${
        radius / 2
      } ${radius / 2}`}
      stroke={color}
      strokeWidth={size}
      fill={color}
    />
  );
}
