import moment from "moment";
import { useEffect, useState } from "react";

export function ArcGraphComponents({ offset, average, focusData }) {
  const CX = 175;
  const CY = 150;

  const [percent, setPercent] = useState(0);
  const [offsetPos, setOffsetPos] = useState([0, 0]);
  const [dataPos, setDataPos] = useState([0, 0]);

  const offsetRadius = 105;
  const offsetCircum = 2 * offsetRadius * Math.PI;
  const offsetLength = 3 * (offsetCircum / 4) * percent; // Max: 660

  const dataRadius = 120;
  const dataCircum = 2 * dataRadius * Math.PI;
  const dataLength = 3 * (dataCircum / 4) * (focusData.value / 1000);

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
      setOffsetPos([x, y]);
    } else {
      const deg = 299 * 0.9 - 135;
      const x = CX - radius * Math.sin((deg * Math.PI) / 180);
      const y = CY - radius * Math.cos((deg * Math.PI) / 180);
      setOffsetPos([x, y]);
    }
  }, [offset]);

  useEffect(() => {
    const radius = 130;
    if (typeof focusData.value === "number") {
      const deg = -(focusData.value / 1000) * 270 + 135;
      const x = CX - radius * Math.sin((deg * Math.PI) / 180);
      const y = CY - radius * Math.cos((deg * Math.PI) / 180);
      setDataPos([x, y]);
    } else {
      const deg = 299 * 0.9 - 135;
      const x = CX - radius * Math.sin((deg * Math.PI) / 180);
      const y = CY - radius * Math.cos((deg * Math.PI) / 180);
      setDataPos([x, y]);
    }
  }, [focusData]);

  return (
    <div className="arcGraphArea">
      <svg width={350} height={300} className="arcGraphSVG">
        <circle
          cx={CX}
          cy={CY}
          r={145}
          fill="#222831"
          stroke="white"
          strokeWidth={5}
        />
        <circle
          cx={CX}
          cy={CY}
          r={138}
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeDasharray="5"
        />
        <circle
          cx={CX}
          cy={CY}
          r={93}
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeDasharray="5"
        />
      </svg>
      <svg
        width={350}
        height={300}
        className="arcGraphSVG"
        style={{ transform: "rotate(135deg)" }}
      >
        <circle
          cx={CX}
          cy={CY}
          r={120}
          fill="none"
          stroke="#FFC7C7"
          strokeWidth={20}
          strokeDasharray={2 * 120 * Math.PI}
          strokeDashoffset={(2 * 120 * Math.PI) / 4}
        />
        <circle
          cx={CX}
          cy={CY}
          r={106}
          fill="none"
          stroke="#222831"
          strokeWidth={8}
          strokeDasharray={2 * 106 * Math.PI}
          strokeDashoffset={(2 * 106 * Math.PI) / 4}
        />
        <circle
          cx={CX}
          cy={CY}
          r={dataRadius}
          fill="none"
          stroke="#F38181"
          strokeWidth={20}
          strokeDasharray={dataCircum}
          strokeDashoffset={dataCircum - dataLength}
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
      </svg>
      <svg width={350} height={300} className="arcGraphSVG">
        <line
          x1={CX}
          y1={CY}
          x2={dataPos[0]}
          y2={dataPos[1]}
          stroke="#F38181"
          strokeWidth={2}
        />
        <line
          x1={CX}
          y1={CY}
          x2={offsetPos[0]}
          y2={offsetPos[1]}
          stroke="#e84545"
          strokeWidth={2}
        />
        <circle cx={CX} cy={CY} r={5} fill="#e84545" />
        <text
          x={CX}
          y={CY + 30}
          textAnchor="middle"
          fontSize={14}
          fontWeight={600}
          fill="white"
        >
          {offset.y !== false ? parseInt((299 - offset.y) * 3.333) : 0}
        </text>
        <text
          x={CX}
          y={CY + 70}
          textAnchor="middle"
          fontSize={24}
          fontWeight={600}
          fill="white"
        >
          {focusData.value !== false ? focusData.value : 0}
        </text>
        <text
          x={CX}
          y={CY + 115}
          textAnchor="middle"
          fontSize={12}
          fontWeight={600}
          fill="white"
        >
          {focusData.updated !== false && offset.y !== false
            ? moment(focusData.updated).format("YYYY-MM-DD HH:mm")
            : ""}
        </text>
      </svg>
    </div>
  );
}
