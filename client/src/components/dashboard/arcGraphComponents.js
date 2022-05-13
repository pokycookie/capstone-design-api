import { useEffect, useState } from "react";

export function ArcGraphComponents({ offset, DB, field, average }) {
  const CX = 175;
  const CY = 150;

  const [percent, setPercent] = useState(0);
  const [averagePos, setAveragePos] = useState([0, 0]);

  const offsetRadius = 105;
  const offsetCircum = 2 * offsetRadius * Math.PI;
  const offsetLength = 3 * (offsetCircum / 4) * percent; // Max: 660

  // offset.y: 0 ~ 299
  useEffect(() => {
    if (offset.y === false) {
      setPercent(0);
    } else {
      const tempValue = (299 - offset.y) / 299;
      setPercent(tempValue);
    }
  }, [offset]);

  useEffect(() => {
    const radius = 105;
    if (typeof offset.y === "number") {
      const deg = offset.y * 0.9 - 135;
      const x = CX - radius * Math.sin((deg * Math.PI) / 180);
      const y = CY - radius * Math.cos((deg * Math.PI) / 180);
      setAveragePos(new Array(x, y));
    } else {
      const deg = 299 * 0.9 - 135;
      const x = CX - radius * Math.sin((deg * Math.PI) / 180);
      const y = CY - radius * Math.cos((deg * Math.PI) / 180);
      setAveragePos(new Array(x, y));
    }
  }, [average, offset]);

  return (
    <div className="arcGraphArea">
      <svg
        width={350}
        height={300}
        className="arcGraphSVG"
        style={{ transform: "rotate(135deg)" }}
      >
        {/* Background */}
        <circle
          cx={CX}
          cy={CY}
          r={120}
          fill="none"
          stroke="#f2f2f2"
          strokeWidth={20}
          strokeDasharray={2 * 120 * Math.PI}
          strokeDashoffset={(2 * 120 * Math.PI) / 4}
        />
        <circle
          cx={CX}
          cy={CY}
          r={108}
          fill="none"
          stroke="#1b2433"
          strokeWidth={16}
          strokeDasharray={2 * 108 * Math.PI}
          strokeDashoffset={(2 * 108 * Math.PI) / 4}
        />
        {/* Data */}
        <circle
          cx={CX}
          cy={CY}
          r={120}
          fill="none"
          stroke="#3e497a"
          strokeWidth={20}
          strokeDasharray={2 * 120 * Math.PI}
          strokeDashoffset={(2 * 120 * Math.PI) / 4}
        />
        <circle
          cx={CX}
          cy={CY}
          r={offsetRadius}
          fill="none"
          stroke="#e84545"
          strokeWidth={3}
          strokeDasharray={offsetCircum}
          strokeDashoffset={offsetCircum - offsetLength}
        />
        <circle cx={CX} cy={CY} r={5} fill="#1b2433" />
      </svg>
      <svg width={350} height={300}>
        <line
          x1={CX}
          y1={CY}
          x2={averagePos[0]}
          y2={averagePos[1]}
          stroke="#e84545"
          strokeWidth={2}
        />
        <text
          x={CX}
          y={CY + 50}
          textAnchor="middle"
          fontSize={20}
          fontWeight={600}
        >
          {offset.y !== false ? parseInt((299 - offset.y) * 3.333) : 0}
        </text>
      </svg>
    </div>
  );
}
