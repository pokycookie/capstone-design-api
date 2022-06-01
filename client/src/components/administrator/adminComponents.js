import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { URI } from "../../App";
import { AdminGraph } from "./adminGraph";

export function AdminComponents() {
  const [DB, setDB] = useState();
  const [startDate, setStartDate] = useState(
    moment(new Date()).subtract(1, "h").add(1, "m").toISOString()
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(1, "m").toISOString()
  );
  const [graphCount, setGraphCount] = useState(30);

  const getDB = (params) => {
    axios
      .get(`${URI}/api/data`, { params })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDB([...res.data]);
          setGraphCount(res.data.length > 30 ? 30 : res.data.length);
        }
      })
      .catch((err) => console.error(err));
  };

  const query = {
    $filter_updated: `$gte ${startDate} $lte ${endDate}`,
  };

  useEffect(() => {
    getDB(query);
    // eslint-disable-next-line
  }, [startDate, endDate, location]);

  return (
    <div className="adminComponents">
      <div className="adminNav">
        <div className="adminNav-left">
          <button
            className="graphBtn refreshBtn"
            onClick={() => {
              getDB(query);
              setEndDate(moment(new Date()).add(1, "m").toISOString());
            }}
          >
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
        </div>
        <div className="adminNav-right">
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
      <AdminGraph DB={DB} startDate={startDate} endDate={endDate} />
    </div>
  );
}
