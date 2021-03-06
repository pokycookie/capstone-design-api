import { Arc } from "../arc";

export function AnalyticsArcGraph({ value, reverse, title }) {
  const OFFSET = parseInt(Math.random() * 360);
  const ANGLE = isNaN(value) ? 0 : value * 3.6;

  return (
    <div className="arcGraphArea">
      <svg width={350} height={350} style={{ position: "absolute" }}>
        <Arc
          x={175}
          y={175}
          radius={140}
          startAngle={OFFSET + 1}
          endAngle={OFFSET + ANGLE}
          thickness={35}
          color={reverse ? "#3E497A" : "#E84545"}
        />
        <Arc
          x={175}
          y={175}
          radius={140}
          startAngle={OFFSET + ANGLE + 1}
          endAngle={OFFSET}
          thickness={35}
          color={reverse ? "#E84545" : "#3E497A"}
        />

        <text
          x="175"
          y="155"
          textAnchor="middle"
          fontSize="20"
          fontWeight="600"
          fill="#1B2433"
        >
          {title}
        </text>
        <text
          x="175"
          y="200"
          textAnchor="middle"
          fontSize="40"
          fontWeight="700"
          fill="#1B2433"
        >
          {(ANGLE / 3.6).toFixed(1)}%
        </text>
      </svg>
    </div>
  );
}
