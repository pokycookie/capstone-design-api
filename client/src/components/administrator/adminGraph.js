import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useOffset, useWindow } from "../../hooks";

const defaultSet = new Set();
defaultSet.add("dot");

const INFO_WIDTH = 350; // 352 for square
const INFO_WIDTH_FULL = INFO_WIDTH + 25; // 20 is margin-left

export function AdminGraph({ DB }) {
  const [polylinePoints, setPolylinePoints] = useState("");
  const [average, setAverage] = useState(0);
  const [averageLine, setAverageLine] = useState(false);
  const [locationArr, setLocationArr] = useState(0);
  const [graphType, setGraphType] = useState(new Set(defaultSet));

  const DOM = useRef();
  const offset = useOffset(DOM);
  const windowSize = useWindow(INFO_WIDTH_FULL);

  const svgHeight = 300;
  const maxWidth = windowSize.width;
  const minWidth = 700;
  const graphHeight = 0.3;
  const svgWidth = windowSize.width < minWidth ? minWidth : maxWidth;

  // make polyline svg path
  useEffect(() => {
    if (Array.isArray(DB)) {
      let tempString = "";
      DB.forEach((element, index) => {
        tempString = tempString.concat(
          `${index === 0 ? "" : " "}${parseInt(
            (index * svgWidth) / DB.length + svgWidth / DB.length / 2
          )} ${parseInt(svgHeight - element.sound * graphHeight)}${
            index !== DB.length - 1 ? "," : ""
          }`
        );
        setPolylinePoints(tempString);
      });
      if (DB.length === 0) {
        setPolylinePoints("");
      }
    }
    // eslint-disable-next-line
  }, [polylinePoints, DB, windowSize]);

  // set average value & location
  useEffect(() => {
    if (Array.isArray(DB) && DB.length > 0) {
      let average;
      const location = [];
      if (DB.length > 1) {
        const DBArr = DB.map((element) => {
          return parseInt(element.sound);
        });
        average =
          (DBArr.reduce((prev, curr) => {
            return (prev += curr);
          }) /
            DB.length) *
          0.3;
      } else {
        average = DB[0].sound * 0.3;
      }
      setAverage(parseInt(average));
      DB.forEach((element) => {
        if (!location.includes(element.location)) {
          location.push(element.location);
        }
      });
      setLocationArr(location);
      console.log(location);
    } else {
      setAverage(0);
      setLocationArr(0);
    }
  }, [DB]);

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
      <div className="graphArea-title">
        <p style={{ textTransform: "uppercase" }}>{`SOUND GRAPH`}</p>
        <div className="optionArea">
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
        DB.length > 0 &&
        typeof DB[parseInt(offset.x / (svgWidth / DB.length))] === "object" &&
        DB[parseInt(offset.x / (svgWidth / DB.length))].hasOwnProperty(
          "sound"
        ) ? (
          <div
            className="graphDetails"
            style={{
              position: "absolute",
              top: parseInt(
                svgHeight -
                  DB[parseInt(offset.x / (svgWidth / DB.length))].sound *
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
              {DB[parseInt(offset.x / (svgWidth / DB.length))].sound}
            </p>
            <p className="graphDetails-updated">
              {moment(
                DB[parseInt(offset.x / (svgWidth / DB.length))].updated
              ).format("YYYY-MM-DD HH:mm")}
            </p>
          </div>
        ) : null}
        <svg width={svgWidth} height={svgHeight}>
          {Array.isArray(DB) ? (
            <polyline
              points={polylinePoints}
              fill="none"
              strokeWidth={2}
              stroke="#1b2433"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.5}
            />
          ) : null}
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
                      cy={parseInt(svgHeight - element.sound * graphHeight)}
                      r={3}
                      fill={
                        parseInt(offset.x / (svgWidth / DB.length)) === index &&
                        offset.x !== false
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
  );
}
