import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useOffset, useWindow } from "../../hooks";

const INFO_WIDTH = 350; // 352 for square
const INFO_WIDTH_FULL = INFO_WIDTH + 25; // 20 is margin-left

function getColor(index) {
  switch (index) {
    case 0:
      return "#EB5353";
    case 1:
      return "#F8CB2E";
    case 2:
      return "#36AE7C";
    case 3:
      return "#187498";
    case 4:
      return "#A85CF9";
    default:
      return `hsl(${index * 40}, 100%, 50%)`;
  }
}

export function AdminGraph({ DB, startDate, endDate }) {
  const [locationArr, setLocationArr] = useState(0);
  const [sortedData, setSortedData] = useState({});
  const [polylineArr, setPolylineArr] = useState([]);
  const [lineWidth, setLineWidth] = useState(1.5);
  const [updatedData, setUpdatedData] = useState([]);

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

  const RATIO = svgWidth / getTimeDiff(startDate, endDate);

  // updatedData
  useEffect(() => {
    if (Array.isArray(DB)) {
      const tempUpdated = [];
      const tempData = [];

      // tempUpdated
      DB.forEach((element) => {
        if (
          !tempUpdated.includes(
            moment(element.updated).format("YYYY-MM-DD HH:mm")
          )
        ) {
          tempUpdated.push(moment(element.updated).format("YYYY-MM-DD HH:mm"));
        }
      });
      tempUpdated.sort((a, b) => a - b);

      // tempData => sortedData
      tempUpdated.forEach((element) => {
        tempData.push(
          DB.filter(
            (E) => moment(E.updated).format("YYYY-MM-DD HH:mm") === element
          ).sort((a, b) => moment(a.location).diff(moment(b.location)))
        );
      });
      setUpdatedData(tempData);
    } else {
      setUpdatedData([]);
    }
  }, [DB]);

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
                  getTimeDiff(startDate, moment(element.updated)) * RATIO
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
      location.sort((a, b) => a - b);

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
        <div className="left">
          <p style={{ textTransform: "uppercase" }}>{`SOUND GRAPH`}</p>
          <input
            type="range"
            value={lineWidth}
            min="1"
            max="5"
            step="0.1"
            onChange={({ target }) => setLineWidth(target.value)}
          />
        </div>
        <div className="optionArea">
          {Array.isArray(locationArr)
            ? locationArr.map((element, index) => {
                return (
                  <div key={index} className="optionArea">
                    <div
                      className="optionColor"
                      style={{
                        backgroundColor: getColor(index),
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
        {offset.x !== false && Array.isArray(DB) && DB.length > 0 ? (
          <div
            className="info"
            style={{
              left: RATIO * parseInt((offset.x + RATIO / 2) / RATIO) - 55,
            }}
          >
            <p style={{ marginBottom: "10px" }}>
              {moment(startDate)
                .add(parseInt((offset.x + RATIO / 2) / RATIO), "m")
                .format("YYYY-MM-DD HH:mm")}
            </p>
            {Array.isArray(
              updatedData.find(
                (F) =>
                  moment(F[0].updated)
                    .startOf("m")
                    .format("YYYY-MM-DD HH:mm") ===
                  moment(startDate)
                    .add(parseInt((offset.x + RATIO / 2) / RATIO), "m")
                    .startOf("m")
                    .format("YYYY-MM-DD HH:mm")
              )
            )
              ? updatedData
                  .find(
                    (F) =>
                      moment(F[0].updated)
                        .startOf("m")
                        .format("YYYY-MM-DD HH:mm") ===
                      moment(startDate)
                        .add(parseInt((offset.x + RATIO / 2) / RATIO), "m")
                        .startOf("m")
                        .format("YYYY-MM-DD HH:mm")
                  )
                  .map((E, index) => {
                    return (
                      <div className="data" key={index}>
                        <div
                          className="optionColor"
                          style={{
                            backgroundColor: getColor(
                              locationArr.findIndex((L) => L === E.location)
                            ),
                          }}
                        ></div>
                        <p>{E.sound}</p>
                      </div>
                    );
                  })
              : null}
          </div>
        ) : null}

        <svg width={svgWidth} height={svgHeight}>
          {Array.isArray(polylineArr)
            ? polylineArr.map((element, index) => {
                return (
                  <polyline
                    key={index}
                    points={element}
                    fill="none"
                    strokeWidth={lineWidth}
                    stroke={getColor(index)}
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
              <line
                x1={RATIO * parseInt((offset.x + RATIO / 2) / RATIO)}
                y1="0"
                x2={RATIO * parseInt((offset.x + RATIO / 2) / RATIO)}
                y2={svgHeight}
                stroke="#1b2433"
                strokeDasharray="5"
                strokeWidth="1"
              />
            </g>
          ) : null}
        </svg>
      </div>
    </div>
  );
}
