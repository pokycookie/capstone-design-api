import { useEffect, useState } from "react";
import { useWindow } from "../../hooks";

const feildArray = ["sound", "vibration"];

export const GraphComponents = ({ DB, feild, type }) => {
  const [polylinePoints, setPolylinePoints] = useState("");

  const windowSize = useWindow(350);
  const svgHeight = 300;
  const maxWidth = windowSize.width;
  const minWidth = 1040;
  const graphHeight = 0.3;
  const svgWidth =
    windowSize.width > maxWidth
      ? maxWidth
      : windowSize.width < minWidth
      ? minWidth
      : windowSize.width;

  useEffect(() => {
    if (Array.isArray(DB)) {
      let tempString = "";
      DB.forEach((element, index) => {
        tempString = tempString.concat(
          `${index === 0 ? "" : " "}${parseInt(
            (index * svgWidth) / DB.length + svgWidth / DB.length / 2
          )} ${parseInt(svgHeight - element[feild] * graphHeight)}${
            index !== DB.length - 1 ? "," : ""
          }`
        );
        setPolylinePoints(tempString);
      });
      if (DB.length === 0) {
        setPolylinePoints("");
      }
    }
  }, [polylinePoints, DB, windowSize]);

  if (!(typeof feild === "string" && feildArray.includes(feild))) return;
  if (!typeof type === "object") return;

  return (
    <div className="graphComponents">
      <svg width={svgWidth} height={svgHeight}>
        {Array.isArray(DB) && type.has("bar")
          ? DB.map((element, index) => {
              return (
                <rect
                  className="svgGraph"
                  key={index}
                  x={0 + (index * svgWidth) / DB.length}
                  y={svgHeight - element[feild] * graphHeight}
                  width={svgWidth / DB.length}
                  height={element[feild] * graphHeight}
                  fill="#3e497a"
                  opacity={0.8}
                />
              );
            })
          : null}
        {Array.isArray(DB) && type.has("line") ? (
          <polyline
            points={polylinePoints}
            fill="none"
            strokeWidth={5}
            stroke="#1b2433"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />
        ) : null}
        {Array.isArray(DB) && type.has("dot")
          ? DB.map((element, index) => {
              return (
                <circle
                  className="svgGraph circle"
                  key={index}
                  cx={parseInt(
                    (index * svgWidth) / DB.length + svgWidth / DB.length / 2
                  )}
                  cy={parseInt(svgHeight - element[feild] * graphHeight)}
                  r={5}
                  fill="#1b2433"
                  opacity={0.8}
                />
              );
            })
          : null}
      </svg>
    </div>
  );
};
