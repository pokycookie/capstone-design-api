import { useEffect } from "react";
import { useState } from "react";

export function Arc({ x, y, radius, startAngle, endAngle, thickness }) {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const [startPos2, setStartPos2] = useState({ x: 0, y: 0 });
  const [endPos2, setEndPos2] = useState({ x: 0, y: 0 });
  const [flag, setFlag] = useState([1, 1]);

  useEffect(() => {
    const sp = {
      x: x - radius * Math.sin((startAngle * Math.PI) / 180),
      y: y + radius * Math.cos((startAngle * Math.PI) / 180),
    };
    const ep = {
      x: x - radius * Math.sin((endAngle * Math.PI) / 180),
      y: y + radius * Math.cos((endAngle * Math.PI) / 180),
    };
    const sp2 = {
      x: x - (radius - thickness) * Math.sin((startAngle * Math.PI) / 180),
      y: y + (radius - thickness) * Math.cos((startAngle * Math.PI) / 180),
    };
    const ep2 = {
      x: x - (radius - thickness) * Math.sin((endAngle * Math.PI) / 180),
      y: y + (radius - thickness) * Math.cos((endAngle * Math.PI) / 180),
    };
    setStartPos({ ...sp });
    setEndPos({ ...ep });
    setStartPos2({ ...sp2 });
    setEndPos2({ ...ep2 });
  }, [x, y, startAngle, endAngle, radius, thickness]);

  useEffect(() => {
    if (parseInt(startAngle) < parseInt(endAngle)) {
      if (
        parseInt(endAngle) - parseInt(startAngle) > 180 &&
        !(flag[0] === 1 && flag[1] === 1)
      ) {
        setFlag([1, 1]);
      } else if (
        parseInt(endAngle) - parseInt(startAngle) <= 180 &&
        !(flag[0] === 0 && flag[1] === 1)
      ) {
        setFlag([0, 1]);
      }
    } else {
      if (
        parseInt(startAngle) - parseInt(endAngle) > 180 &&
        !(flag[0] === 0 && flag[1] === 1)
      ) {
        setFlag([0, 1]);
      } else if (
        parseInt(startAngle) - parseInt(endAngle) <= 180 &&
        !(flag[0] === 1 && flag[1] === 1)
      ) {
        setFlag([1, 1]);
      }
    }
  }, [startAngle, endAngle, flag]);

  return (
    <svg width={500} height={500}>
      <circle cx={x} cy={y} r="3" />
      <path
        d={`M${startPos.x},${startPos.y} A${radius},${radius} 0 ${flag[0]},${
          flag[1]
        } ${endPos.x},${endPos.y} L${endPos2.x},${endPos2.y} A${
          radius - thickness
        },${radius - thickness} 0 ${flag[0]},${flag[1] === 0 ? 1 : 0} ${
          startPos2.x
        },${startPos2.y} Z`}
        fill="red"
      />
    </svg>
  );
}
