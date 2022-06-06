import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useOffset, useWindow } from "../../hooks";

const INFO_WIDTH = 350; // 352 for square
const INFO_WIDTH_FULL = INFO_WIDTH + 25; // 20 is margin-left

export function AdminGraph({ DB, startDate, endDate }) {
  const [locationArr, setLocationArr] = useState(0);
  const [sortedData, setSortedData] = useState({});
  const [polylineArr, setPolylineArr] = useState([]);

  const DOM = useRef();
  const offset = useOffset(DOM);
  const windowSize = useWindow(INFO_WIDTH_FULL);

  const svgHeight = 300;
  const maxWidth = windowSize.width;
  const minWidth = 700;
  const graphHeight = 0.3;
  const svgWidth = windowSize.width < minWidth ? minWidth : maxWidth;

  const getTimeDiff = (start, end) => {
    if (!moment(start).isValid) return;
    return moment(end).diff(moment(start), "m");
  };

  // make polyline svg path
  useEffect(() => {
    let tempArr = [];
    if (Object.keys(sortedData).length === 0) {
      setPolylineArr([]);
    } else {
      if (Array.isArray(locationArr)) {
        locationArr.forEach((L) => {
          if (Array.isArray(sortedData[L])) {
            let tempString = "";
            sortedData[L].forEach((element, index, arr) => {
              tempString = tempString.concat(
                `${index === 0 ? "" : " "}${parseInt(
                  getTimeDiff(startDate, moment(element.updated)) *
                    (svgWidth / getTimeDiff(startDate, endDate))
                )} ${parseInt(svgHeight - element.sound * graphHeight)}${
                  index !== arr.length - 1 ? "," : ""
                }`
              );
            });
            if (sortedData[L].length === 0) {
              tempString = "";
            }
            tempArr.push(tempString);
          }
        });
        setPolylineArr(tempArr);
      }
    }
    // eslint-disable-next-line
  }, [sortedData, windowSize]);

  // set average value & location
  useEffect(() => {
    if (Array.isArray(DB) && DB.length > 0) {
      const location = [];
      const tempDB = {};

      DB.forEach((element, index, arr) => {
        if (!location.includes(element.location)) {
          location.push(element.location);
          tempDB[element.location] = arr.filter(
            (E) => E.location === element.location
          );
        }
      });
      setLocationArr(location);
      setSortedData(tempDB);
    } else {
      setLocationArr(0);
      setSortedData({});
    }
  }, [DB]);

  if (!typeof type === "object") return;

  return (
    <div className="graphArea">
      <div className="graphArea-title">
        <p style={{ textTransform: "uppercase" }}>{`SOUND GRAPH`}</p>
        <div className="optionArea">
          {Array.isArray(locationArr)
            ? locationArr.map((element, index) => {
                return (
                  <div key={index} className="optionArea">
                    <div
                      className="optionColor"
                      style={{
                        background: `hsl(${index * 40}, 100%, 50%)`,
                      }}
                    ></div>
                    <p>{element}</p>
                  </div>
                );
              })
            : null}
        </div>
      </div>
      <div className="graphComponents" ref={DOM}>
        <svg width={svgWidth} height={svgHeight}>
          {Array.isArray(polylineArr)
            ? polylineArr.map((element, index) => {
                return (
                  <polyline
                    key={index}
                    points={element}
                    fill="none"
                    strokeWidth={1}
                    stroke={`hsl(${index * 40}, 100%, 50%)`}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })
            : null}
          {offset.x !== false &&
          offset.y !== false &&
          Array.isArray(DB) &&
          DB.length > 0 ? (
            <g>
              <text
                x="20"
                y={offset.y - 10}
                textAnchor="middle"
                fontWeight={600}
                fontSize={12}
              >
                {offset.y !== false ? parseInt((299 - offset.y) * 3.333) : 0}
              </text>
              <line
                x1="0"
                y1={offset.y}
                x2={svgWidth}
                y2={offset.y}
                stroke="#e84545"
                strokeDasharray="5"
                strokeWidth="2"
              />
            </g>
          ) : null}
        </svg>
      </div>
    </div>
  );
}
