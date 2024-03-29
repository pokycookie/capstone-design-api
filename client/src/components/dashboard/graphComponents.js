import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useOffset, useWindow } from "../../hooks";
import { GraphInfoComponents } from "./graphInfoComponents";

const feildArray = ["sound", "vibration"];

const defaultSet = new Set();
defaultSet.add("line");
defaultSet.add("dot");

const INFO_WIDTH = 352; // 352 for square
const INFO_WIDTH_FULL = INFO_WIDTH + 20; // 20 is margin-right
const NAV_WIDTH = 250;
const PADDING_WIDTH = 100;

export const GraphComponents = ({ DB, field }) => {
  const [polylinePoints, setPolylinePoints] = useState("");
  const [average, setAverage] = useState(0);
  const [averageLine, setAverageLine] = useState(false);
  const [graphType, setGraphType] = useState(new Set(defaultSet));
  const [ratioPoints, setRatioPoints] = useState("");

  const DOM = useRef();
  const offset = useOffset(DOM);
  const windowSize = useWindow(
    NAV_WIDTH + PADDING_WIDTH + INFO_WIDTH_FULL + 10,
    0
  );

  const svgHeight = 300;
  const maxWidth = windowSize.width;
  const minWidth = 700;
  const graphHeight = 0.3;
  const svgWidth = windowSize.width < minWidth ? minWidth : maxWidth;

  // make polyline svg path
  useEffect(() => {
    if (Array.isArray(DB)) {
      let tempString = "";
      let ratioString = "";
      DB.forEach((element, index) => {
        const postSound = element.postSound < 0 ? 0 : element.postSound;
        tempString = tempString.concat(
          `${index === 0 ? "" : " "}${parseInt(
            (index * svgWidth) / DB.length + svgWidth / DB.length / 2
          )} ${parseInt(svgHeight - element[field] * graphHeight)}${
            index !== DB.length - 1 ? "," : ""
          }`
        );
        ratioString = ratioString.concat(
          `${parseInt(
            (index * svgWidth) / DB.length + svgWidth / DB.length / 2
          )} ${parseInt(svgHeight - postSound * graphHeight)}, `
        );

        setPolylinePoints(tempString);
        setRatioPoints(ratioString);
      });
      if (DB.length === 0) {
        setPolylinePoints("");
        setRatioPoints("");
      }
    }
    // eslint-disable-next-line
  }, [polylinePoints, ratioPoints, DB, windowSize, field]);

  // set average value
  useEffect(() => {
    if (Array.isArray(DB) && DB.length > 0) {
      let average;
      if (DB.length > 1) {
        const DBArr = DB.map((element) => {
          return parseInt(element[field]);
        });
        average =
          (DBArr.reduce((prev, curr) => {
            return (prev += curr);
          }) /
            DB.length) *
          0.3;
      } else {
        average = DB[0][field] * 0.3;
      }
      setAverage(parseInt(average));
    } else {
      setAverage(0);
    }
  }, [DB, field]);

  if (!(typeof field === "string" && feildArray.includes(field))) return;
  if (!typeof type === "object") return;

  const setType = (target, type) => {
    if (target.checked) {
      const tempSet = graphType;
      tempSet.add(type);
      setGraphType(new Set(tempSet));
    } else {
      const tempSet = graphType;
      tempSet.delete(type);
      setGraphType(new Set(tempSet));
    }
  };

  return (
    <div className="graphArea">
      <GraphInfoComponents
        width={INFO_WIDTH}
        offset={offset}
        average={average}
        focusData={
          Array.isArray(DB) && DB.length > 0
            ? {
                value:
                  offset.x === false
                    ? 0
                    : DB[parseInt(offset.x / (svgWidth / DB.length))][field],
                updated:
                  offset.x === false
                    ? 0
                    : DB[parseInt(offset.x / (svgWidth / DB.length))].updated,
              }
            : {
                value: 0,
                updated: 0,
              }
        }
      />

      <div className="graph">
        <div className="graphArea-title">
          <p style={{ textTransform: "uppercase" }}>{`${field} GRAPH`}</p>
          <div className="optionArea">
            <input
              type="checkbox"
              defaultChecked={false}
              onChange={({ target }) => {
                setType(target, "soundRatio");
              }}
            />
            <p>소음 비율</p>
            {/* <input
              type="checkbox"
              defaultChecked="true"
              onChange={({ target }) => {
                setType(target, "line");
              }}
            />
            <p>Line</p> */}
            <input
              type="checkbox"
              defaultChecked="true"
              onChange={({ target }) => {
                setType(target, "dot");
              }}
            />
            <p>Dot</p>
            <input
              type="checkbox"
              onChange={({ target }) => {
                setAverageLine(target.checked);
              }}
            />
            <p>Average Line</p>
          </div>
        </div>
        <div className="graphComponents" ref={DOM}>
          {offset.x !== false &&
          offset.y !== false &&
          Array.isArray(DB) &&
          DB.length > 0 ? (
            <div
              className="graphDetails"
              style={{
                position: "absolute",
                top: parseInt(
                  svgHeight -
                    DB[parseInt(offset.x / (svgWidth / DB.length))][field] *
                      graphHeight -
                    60
                ),
                left:
                  (svgWidth / DB.length) *
                    parseInt(offset.x / (svgWidth / DB.length)) +
                  svgWidth / (2 * DB.length) -
                  50,
              }}
            >
              <p className="graphDetails-value">
                {DB[parseInt(offset.x / (svgWidth / DB.length))][field]}
              </p>
              <p className="graphDetails-updated">
                {moment(
                  DB[parseInt(offset.x / (svgWidth / DB.length))].updated
                ).format("YYYY-MM-DD HH:mm")}
              </p>
            </div>
          ) : null}
          <svg width={svgWidth} height={svgHeight}>
            {Array.isArray(DB) && graphType.has("soundRatio") ? (
              <g>
                <polyline
                  points={polylinePoints.concat(
                    `, ${svgWidth} ${svgHeight}, 0 ${svgHeight}`
                  )}
                  fill="#3E497A"
                />
                <polyline
                  points={ratioPoints.concat(
                    `${svgWidth} ${svgHeight}, 0 ${svgHeight}`
                  )}
                  fill="#E84545"
                />
              </g>
            ) : // {DB.map((element, index) => {
            //   const postSound =
            //     element.postSound < 0 ? 0 : element.postSound;
            //   const x = parseInt(
            //     (index * svgWidth) / DB.length + svgWidth / DB.length / 2
            //   );
            //   return (
            //     <g key={index}>
            //       <line
            //         className="svgGraph"
            //         x1={x}
            //         y1={svgHeight - postSound * graphHeight}
            //         x2={x}
            //         y2={svgHeight}
            //         stroke="#e84545"
            //         strokeWidth={svgWidth / DB.length + 2}
            //       />
            //       <line
            //         className="svgGraph"
            //         x1={x}
            //         y1={parseInt(svgHeight - element.sound * graphHeight)}
            //         x2={x}
            //         y2={svgHeight - postSound * graphHeight}
            //         stroke="#3E497A"
            //         strokeWidth={svgWidth / DB.length + 2}
            //       />
            //     </g>
            //   );
            // })}
            null}
            <polyline
              points={polylinePoints}
              fill="none"
              strokeWidth={2}
              stroke="#1b2433"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g>
              {Array.isArray(DB) && graphType.has("dot")
                ? DB.map((element, index) => {
                    return (
                      <circle
                        className="svgGraph circle"
                        key={index}
                        cx={parseInt(
                          (index * svgWidth) / DB.length +
                            svgWidth / DB.length / 2
                        )}
                        cy={parseInt(svgHeight - element[field] * graphHeight)}
                        r={3}
                        fill={
                          parseInt(offset.x / (svgWidth / DB.length)) ===
                            index && offset.x !== false
                            ? "#1b2433"
                            : "white"
                        }
                        stroke="#1b2433"
                        strokeWidth={1.5}
                      />
                    );
                  })
                : null}
            </g>
            {offset.x !== false &&
            offset.y !== false &&
            Array.isArray(DB) &&
            DB.length > 0 ? (
              <g>
                <line
                  x1="0"
                  y1={offset.y}
                  x2={svgWidth}
                  y2={offset.y}
                  stroke="#e84545"
                  strokeDasharray="5"
                  strokeWidth="2"
                />
                <line
                  x1={
                    (svgWidth / DB.length) *
                      parseInt(offset.x / (svgWidth / DB.length)) +
                    svgWidth / (2 * DB.length) -
                    1
                  }
                  y1={svgHeight}
                  x2={
                    (svgWidth / DB.length) *
                      parseInt(offset.x / (svgWidth / DB.length)) +
                    svgWidth / (2 * DB.length) -
                    1
                  }
                  y2={0}
                  stroke="#1b2433"
                  strokeDasharray="5"
                  strokeWidth="1"
                />
              </g>
            ) : null}
            {typeof average === "number" && averageLine === true ? (
              <line
                x1="0"
                y1={svgHeight - average}
                x2={svgWidth}
                y2={svgHeight - average}
                stroke="#e84545"
                strokeDasharray="5"
                strokeWidth={2}
              />
            ) : null}
          </svg>
        </div>
      </div>
    </div>
  );
};
