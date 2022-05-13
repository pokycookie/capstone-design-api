import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { URI } from "../../App";
import { GraphComponents } from "./graphComponents";

const defaultSet = new Set();
defaultSet.add("bar");
defaultSet.add("line");
defaultSet.add("dot");

export const DashboardComponents = () => {
  const [DB, setDB] = useState();
  const [location, setLocation] = useState(101);
  const [startDate, setStartDate] = useState(
    moment(new Date()).add(9, "h").subtract(1, "months").toISOString()
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(9, "h").toISOString()
  );
  const [graphCount, setGraphCount] = useState(30);
  const [soundGraphType, setSoundGraphType] = useState(new Set(defaultSet));
  const [vibrationGraphType, setVibrationGraphType] = useState(
    new Set(defaultSet)
  );

  const getDB = (params) => {
    axios
      .get(`${URI}/api/data`, { params })
      .then((res) => {
        setDB(res.data);
        if (Array.isArray(res.data)) {
          setGraphCount(res.data.length > 30 ? 30 : res.data.length);
        }
      })
      .catch((err) => console.error(err));
  };

  const query = {
    $filter_updated: `$gte ${startDate} $lte ${endDate}`,
    $filter_location: `$equals ${location}`,
  };

  useEffect(() => {
    getDB(query);
  }, [startDate, endDate, location]);

  return (
    <div className="dashboardComponents">
      <div className="dashboardNav">
        <div className="dashboardNav-left">
          <button
            className="graphBtn refreshBtn"
            onClick={() => {
              getDB(query);
            }}
          >
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
          <input
            className="graphLocationInput location"
            type="number"
            placeholder="Location"
            value={location}
            onChange={({ target }) => setLocation(target.value)}
          />
          <p>호</p>
        </div>
        <div className="dashboardNav-right">
          <input
            className="graphLocationInput"
            type="datetime-local"
            defaultValue={moment(startDate).format("YYYY-MM-DDTHH:mm")}
            onChange={({ target }) => {
              setStartDate(moment(target.value).toISOString());
            }}
          />
          <p className="graphLocationInput-text">부터</p>
          <input
            className="graphLocationInput"
            type="datetime-local"
            defaultValue={moment(endDate).format("YYYY-MM-DDTHH:mm")}
            onChange={({ target }) => {
              setEndDate(moment(target.value).toISOString());
            }}
          />
          <p className="graphLocationInput-text">까지</p>
        </div>
      </div>
      <div className="soundGraphArea graphArea">
        <div className="graphArea-title">
          <p>SOUND</p>
          <div className="optionArea">
            <input
              type="checkbox"
              defaultChecked="true"
              onChange={({ target }) => {
                if (target.checked) {
                  const tempSet = soundGraphType;
                  tempSet.add("bar");
                  setSoundGraphType(new Set(tempSet));
                } else {
                  const tempSet = soundGraphType;
                  tempSet.delete("bar");
                  setSoundGraphType(new Set(tempSet));
                }
              }}
            />
            <p>Bar</p>
            <input
              type="checkbox"
              defaultChecked="true"
              onChange={({ target }) => {
                if (target.checked) {
                  const tempSet = soundGraphType;
                  tempSet.add("line");
                  setSoundGraphType(new Set(tempSet));
                } else {
                  const tempSet = soundGraphType;
                  tempSet.delete("line");
                  setSoundGraphType(new Set(tempSet));
                }
              }}
            />
            <p>Line</p>
            <input
              type="checkbox"
              defaultChecked="true"
              onChange={({ target }) => {
                if (target.checked) {
                  const tempSet = soundGraphType;
                  tempSet.add("dot");
                  setSoundGraphType(new Set(tempSet));
                } else {
                  const tempSet = soundGraphType;
                  tempSet.delete("dot");
                  setSoundGraphType(new Set(tempSet));
                }
              }}
            />
            <p>Dot</p>
          </div>
        </div>
        <GraphComponents
          DB={DB}
          graphCount={graphCount}
          feild="sound"
          type={soundGraphType}
        />
      </div>
      <div className="vibrationGraphArea graphArea">
        <div className="graphArea-title">
          <p>VIBRATION</p>
          <div className="optionArea">
            <input
              type="checkbox"
              defaultChecked="true"
              onChange={({ target }) => {
                if (target.checked) {
                  const tempSet = vibrationGraphType;
                  tempSet.add("bar");
                  setVibrationGraphType(new Set(tempSet));
                } else {
                  const tempSet = vibrationGraphType;
                  tempSet.delete("bar");
                  setVibrationGraphType(new Set(tempSet));
                }
              }}
            />
            <p>Bar</p>
            <input
              type="checkbox"
              defaultChecked="true"
              onChange={({ target }) => {
                if (target.checked) {
                  const tempSet = vibrationGraphType;
                  tempSet.add("line");
                  setVibrationGraphType(new Set(tempSet));
                } else {
                  const tempSet = vibrationGraphType;
                  tempSet.delete("line");
                  setVibrationGraphType(new Set(tempSet));
                }
              }}
            />
            <p>Line</p>
            <input
              type="checkbox"
              defaultChecked="true"
              onChange={({ target }) => {
                if (target.checked) {
                  const tempSet = vibrationGraphType;
                  tempSet.add("dot");
                  setVibrationGraphType(new Set(tempSet));
                } else {
                  const tempSet = vibrationGraphType;
                  tempSet.delete("dot");
                  setVibrationGraphType(new Set(tempSet));
                }
              }}
            />
            <p>Dot</p>
          </div>
        </div>
        <GraphComponents
          DB={DB}
          graphCount={graphCount}
          feild="vibration"
          type={vibrationGraphType}
        />
      </div>
    </div>
  );
};
