import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { URI } from "../../App";
import { GraphComponents } from "./graphComponents";

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

  // graphType
  const defaultSet = new Set();
  defaultSet.add("bar");
  defaultSet.add("line");
  defaultSet.add("dot");
  const [graphType, setGraphType] = useState(defaultSet);

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
                  const tempSet = graphType;
                  tempSet.add("bar");
                  setGraphType(new Set(tempSet));
                } else {
                  const tempSet = graphType;
                  tempSet.delete("bar");
                  setGraphType(new Set(tempSet));
                }
              }}
            />
            <p>Bar</p>
            <input
              type="checkbox"
              defaultChecked="true"
              onChange={({ target }) => {
                if (target.checked) {
                  const tempSet = graphType;
                  tempSet.add("line");
                  setGraphType(new Set(tempSet));
                } else {
                  const tempSet = graphType;
                  tempSet.delete("line");
                  setGraphType(new Set(tempSet));
                }
              }}
            />
            <p>Line</p>
            <input
              type="checkbox"
              defaultChecked="true"
              onChange={({ target }) => {
                if (target.checked) {
                  const tempSet = graphType;
                  tempSet.add("dot");
                  setGraphType(new Set(tempSet));
                } else {
                  const tempSet = graphType;
                  tempSet.delete("dot");
                  setGraphType(new Set(tempSet));
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
          type={graphType}
        />
      </div>
      <div className="vibrationGraphArea graphArea">
        <div className="graphArea-title">
          <p>VIBRATION</p>
        </div>
        <GraphComponents
          DB={DB}
          graphCount={graphCount}
          feild="vibration"
          type={graphType}
        />
      </div>
    </div>
  );
};
